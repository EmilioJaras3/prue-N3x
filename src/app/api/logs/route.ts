import { db } from '@/lib/db';
import { action_logs } from '@/services/postgres/schema';
import { eq, desc } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/security/auth';
import { rateLimitApi } from '@/lib/security/rate-limit';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: 'Token invalido' }, { status: 401 });
    }

    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rl = rateLimitApi(ip);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Demasiadas peticiones' },
        { status: 429 }
      );
    }

    const limit = parseInt(
      request.nextUrl.searchParams.get('limit') || '20'
    );

    const logs = await db
      .select()
      .from(action_logs)
      .where(eq(action_logs.user_id, payload.userId))
      .orderBy(desc(action_logs.created_at))
      .limit(Math.min(limit, 100));

    return NextResponse.json({ success: true, data: logs });
  } catch {
    return NextResponse.json(
      { error: 'Error interno' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: 'Token invalido' }, { status: 401 });
    }

    const body = await request.json();

    const [log] = await db
      .insert(action_logs)
      .values({
        user_id: payload.userId,
        action_type: body.action_type || 'CUSTOM',
        action_details: JSON.stringify(body.details || {}),
        ip_address:
          request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || '',
      })
      .returning();

    return NextResponse.json({ success: true, data: log });
  } catch {
    return NextResponse.json(
      { error: 'Error interno' },
      { status: 500 }
    );
  }
}
