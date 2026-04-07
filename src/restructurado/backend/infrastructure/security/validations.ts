import { z } from 'zod';

const DANGEROUS_PATTERNS = [
  /<script/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /<!--/,
  /<iframe/i,
  /eval\(/i,
];

function sanitize(input: string): string {
  return input.replace(/<[^>]*>?/gm, '').trim();
}

function hasDangerousContent(input: string): boolean {
  return DANGEROUS_PATTERNS.some((p) => p.test(input));
}

export const passwordSchema = z
  .string()
  .min(8, 'Por seguridad, usa al menos 8 caracteres.')
  .max(128, 'La contraseña es demasiado larga.')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    'La contraseña debe incluir mayúsculas, minúsculas, números y al menos un símbolo.'
  )
  .refine((v: string) => !hasDangerousContent(v), 'La contraseña contiene caracteres no permitidos.')
  .transform(sanitize);

export const emailSchema = z
  .string()
  .email('El correo electrónico no es válido')
  .max(255, 'El correo es demasiado largo')
  .refine((v: string) => !hasDangerousContent(v), 'El correo contiene caracteres no permitidos')
  .transform((e: string) => e.toLowerCase().trim())
  .transform(sanitize);

export const usernameSchema = z
  .string()
  .min(3, 'El usuario debe tener al menos 3 caracteres')
  .max(50, 'El usuario no puede tener más de 50 caracteres')
  .regex(/^[a-zA-Z0-9_-]+$/, 'El usuario solo puede tener letras, números, guiones y guion bajo')
  .refine((v: string) => !hasDangerousContent(v), 'El usuario contiene caracteres no permitidos')
  .transform(sanitize);

export const fullNameSchema = z
  .string()
  .min(2, 'El nombre debe tener al menos 2 caracteres')
  .max(100, 'El nombre no puede tener más de 100 caracteres')
  .regex(
    /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.'-]+$/,
    'El nombre solo puede tener letras, espacios, puntos y guiones'
  )
  .refine((v: string) => !hasDangerousContent(v), 'El nombre contiene caracteres no permitidos')
  .transform(sanitize);

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
  full_name: fullNameSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Debes ingresar tu contraseña'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
