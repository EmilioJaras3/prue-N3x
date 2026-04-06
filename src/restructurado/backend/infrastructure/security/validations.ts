import { z } from 'zod';

const DANGEROUS_PATTERNS = [
  /<script/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /<!--/,
  /<iframe/i,
  /eval\(/i,
];

function hasDangerousContent(input: string): boolean {
  return DANGEROUS_PATTERNS.some((p) => p.test(input));
}

export const passwordSchema = z
  .string()
  .min(6, 'La contraseña debe tener al menos 6 caracteres')
  .max(128, 'La contraseña no puede tener más de 128 caracteres')
  .regex(/^[a-zA-Z0-9\.]+$/, 'La contraseña solo acepta letras, números y el punto (.). No símbolos raros.')
  .refine((v) => !hasDangerousContent(v), 'La contraseña contiene caracteres no permitidos');

export const emailSchema = z
  .string()
  .email('El correo electrónico no es válido')
  .max(255, 'El correo es demasiado largo')
  .transform((e) => e.toLowerCase().trim())
  .refine((v) => !hasDangerousContent(v), 'El correo contiene caracteres no permitidos');

export const usernameSchema = z
  .string()
  .min(3, 'El usuario debe tener al menos 3 caracteres')
  .max(50, 'El usuario no puede tener más de 50 caracteres')
  .regex(/^[a-zA-Z0-9_-]+$/, 'El usuario solo puede tener letras, números, guiones y guion bajo')
  .refine((v) => !hasDangerousContent(v), 'El usuario contiene caracteres no permitidos');

export const fullNameSchema = z
  .string()
  .min(2, 'El nombre debe tener al menos 2 caracteres')
  .max(100, 'El nombre no puede tener más de 100 caracteres')
  .regex(
    /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.'-]+$/,
    'El nombre solo puede tener letras, espacios, puntos y guiones'
  )
  .refine((v) => !hasDangerousContent(v), 'El nombre contiene caracteres no permitidos');

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
