/**
 * @file env.ts
 * @description Centralized and validated environment variables access.
 * This ensures that secrets are only accessed in server-side context and are present.
 */

if (typeof window !== 'undefined') {
  throw new Error('Seguridad: Intento de cargar variables de entorno del servidor en el cliente detectado.');
}

const isProduction = process.env.NODE_ENV === 'production';
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  NODE_ENV: process.env.NODE_ENV || 'development',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12'),
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '7d',
};

// Validación de entorno
const missingVars = Object.entries(env)
  .filter(([key, value]) => {
    // Solo validamos presencia de llaves críticas
    if (key === 'DATABASE_URL' || key === 'JWT_SECRET') {
      return value === undefined || value === null || value === '';
    }
    return false;
  })
  .map(([key]) => key);

if (missingVars.length > 0) {
  const errorMsg = `Configuración Crítica Faltante: ${missingVars.join(', ')}`;
  
  if (isProduction && !isBuildPhase) {
    // Solo bloqueamos la ejecución REAL en producción
    throw new Error(errorMsg);
  } else {
    // En desarrollo o durante la construcción de Vercel, solo emitimos una advertencia
    console.warn(`[SEGURIDAD] Advertencia: ${errorMsg}. El sistema fallará en tiempo de ejecución.`);
  }
}
