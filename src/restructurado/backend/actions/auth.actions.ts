'use server';

import { db } from '@/restructurado/backend/infrastructure/database/client';
import { users, sessions, action_logs } from '@/restructurado/backend/infrastructure/database/services/schema';
import { eq, and, or, gt, desc } from 'drizzle-orm';
import {
  hashPassword,
  verifyPassword,
  generateJWT,
  verifyJWT,
  generateHexToken,
} from '@/restructurado/backend/infrastructure/security/auth';
import {
  registerSchema,
  loginSchema,
  type RegisterInput,
  type LoginInput,
} from '@/restructurado/backend/infrastructure/security/validations';
import { ZodError } from 'zod';
import { cookies, headers } from 'next/headers';
import { rateLimitLogin, rateLimitRegister } from '@/restructurado/backend/infrastructure/security/rate-limit';
import type { ApiResponse } from '@/types';

async function getClientInfo() {
  const h = await headers();
  return {
    ip: h.get('x-forwarded-for') || 'unknown',
    ua: h.get('user-agent') || '',
  };
}

async function logAction(
  userId: number | null,
  actionType: string,
  details?: string
) {
  const { ip, ua } = await getClientInfo();
  await db.insert(action_logs).values({
    user_id: userId,
    action_type: actionType,
    action_details: details || null,
    ip_address: ip,
    user_agent: ua,
  });
}

async function isAccountLocked(email: string, ip: string): Promise<boolean> {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  
  // Buscar intentos fallidos por IP o por Email en los detalles
  const failedAttempts = await db
    .select()
    .from(action_logs)
    .where(
      and(
        eq(action_logs.action_type, 'FAILED_LOGIN'),
        gt(action_logs.created_at, fifteenMinutesAgo),
        or(
          eq(action_logs.ip_address, ip),
          eq(action_logs.action_details, email)
        )
      )
    );

  return failedAttempts.length >= 5;
}

export async function registerAction(
  input: RegisterInput
): Promise<ApiResponse<{ userId: number }>> {
  try {
    const { ip } = await getClientInfo();
    const rl = rateLimitRegister(ip);
    if (!rl.allowed) {
      return { success: false, error: 'Demasiados intentos, espera un momento' };
    }

    const validated = registerSchema.parse(input);

    const existingEmail = await db
      .select()
      .from(users)
      .where(eq(users.email, validated.email))
      .limit(1);

    if (existingEmail.length > 0) {
      return { success: false, error: 'Email ya registrado' };
    }

    const existingUsername = await db
      .select()
      .from(users)
      .where(eq(users.username, validated.username))
      .limit(1);

    if (existingUsername.length > 0) {
      return { success: false, error: 'Username ya en uso' };
    }

    const passwordHash = await hashPassword(validated.password);

    const [newUser] = await db
      .insert(users)
      .values({
        email: validated.email,
        password_hash: passwordHash,
        username: validated.username,
        full_name: validated.full_name,
      })
      .returning({ id: users.id });

    await logAction(newUser.id, 'REGISTER', JSON.stringify({ email: validated.email }));

    return { success: true, data: { userId: newUser.id } };
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const fieldError = error.issues[0]?.message;
      return { success: false, error: fieldError || 'Error de validación en los datos' };
    }
    return { success: false, error: 'No se pudo crear la cuenta' };
  }
}

export async function loginAction(
  input: LoginInput
): Promise<ApiResponse<{ userId: number }>> {
  try {
    const { ip } = await getClientInfo();
    
    const locked = await isAccountLocked(input.email, ip);
    if (locked) {
      await logAction(null, 'ACCOUNT_LOCKED', input.email);
      return { success: false, error: 'Credenciales inválidas' };
    }

    const rl = rateLimitLogin(ip);
    if (!rl.allowed) {
      return { success: false, error: 'Demasiados intentos, espera 15 minutos' };
    }

    const validated = loginSchema.parse(input);

    const [foundUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, validated.email))
      .limit(1);

    if (!foundUser) {
      await logAction(null, 'FAILED_LOGIN', validated.email);
      return { success: false, error: 'Credenciales inválidas' };
    }

    const valid = await verifyPassword(validated.password, foundUser.password_hash);
    if (!valid) {
      await logAction(foundUser.id, 'FAILED_LOGIN', validated.email);
      return { success: false, error: 'Credenciales inválidas' };
    }

    const token = generateJWT(foundUser.id);

    const sessionToken = generateHexToken(32);
    await db.insert(sessions).values({
      user_id: foundUser.id,
      session_token: sessionToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await db
      .update(users)
      .set({ last_login: new Date() })
      .where(eq(users.id, foundUser.id));

    await logAction(foundUser.id, 'LOGIN');

    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return { success: true, data: { userId: foundUser.id } };
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const fieldError = error.issues[0]?.message;
      return { success: false, error: fieldError || 'Error de validación en los datos' };
    }
    return { success: false, error: 'Credenciales incorrectas' };
  }
}

export async function logoutAction(): Promise<ApiResponse<null>> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
    return { success: true, data: null };
  } catch {
    return { success: false, error: 'Error al cerrar sesión' };
  }
}

export async function getCurrentUser(): Promise<ApiResponse<{
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  is_verified: boolean | null;
  created_at: Date | null;
}>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return { success: false, error: 'No autenticado' };
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return { success: false, error: 'Token inválido' };
    }

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        full_name: users.full_name,
        is_verified: users.is_verified,
        created_at: users.created_at,
      })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    return { success: true, data: user };
  } catch {
    return { success: false, error: 'Error al obtener usuario' };
  }
}
