export function getSecurityHeaders(): Record<string, string> {
  // Desactivado para restaurar compatibilidad y video
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  };
}
