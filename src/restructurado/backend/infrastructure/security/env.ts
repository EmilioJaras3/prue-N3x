/**
 * @file env.ts
 * @description Centralized and validated environment variables access.
 * This ensures that secrets are only accessed in server-side context and are present.
 */

if (typeof window !== 'undefined') {
  throw new Error('Seguridad: Intento de cargar variables de entorno del servidor en el cliente detectado.');
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  NODE_ENV: process.env.NODE_ENV || 'development',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12'),
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '7d',
};

// Validación inmediata en el arranque del servidor
const missingVars = Object.entries(env)
  .filter(([_, value]) => value === undefined || value === null || value === '')
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(`Configuración Crítica Faltante: ${missingVars.join(', ')}`);
}
