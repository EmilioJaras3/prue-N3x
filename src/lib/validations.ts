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

// solo caracteres hexadecimales, minimo 6
export const hexPasswordSchema = z
  .string()
  .min(6, 'Minimo 6 caracteres')
  .max(128, 'Maximo 128 caracteres')
  .regex(/^[0-9a-fA-F]+$/, 'Solo caracteres hexadecimales (0-9, a-f)')
  .refine((v) => !hasDangerousContent(v), 'Contenido no permitido');

export const emailSchema = z
  .string()
  .email('Email invalido')
  .max(255, 'Email muy largo')
  .transform((e) => e.toLowerCase().trim())
  .refine((v) => !hasDangerousContent(v), 'Contenido no permitido');

export const usernameSchema = z
  .string()
  .min(3, 'Minimo 3 caracteres')
  .max(50, 'Maximo 50 caracteres')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Solo letras, numeros, guiones y guion bajo')
  .refine((v) => !hasDangerousContent(v), 'Contenido no permitido');

export const fullNameSchema = z
  .string()
  .min(2, 'Minimo 2 caracteres')
  .max(100, 'Maximo 100 caracteres')
  .regex(
    /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.'-]+$/,
    'Solo letras, espacios, puntos y guiones'
  )
  .refine((v) => !hasDangerousContent(v), 'Contenido no permitido');

export const registerSchema = z.object({
  email: emailSchema,
  password: hexPasswordSchema,
  username: usernameSchema,
  full_name: fullNameSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Contrasena requerida'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
