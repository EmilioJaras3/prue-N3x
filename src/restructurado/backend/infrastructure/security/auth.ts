import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10');
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '7d';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}

export function generateJWT(userId: number): string {
  const secret = JWT_SECRET as jwt.Secret;
  const payload = { sub: String(userId), iat: Math.floor(Date.now() / 1000), type: 'access' };
  return jwt.sign(payload, secret, { 
    expiresIn: JWT_EXPIRATION as jwt.SignOptions['expiresIn'], 
    algorithm: 'HS256', 
    issuer: 'panel-seguro' 
  });
}

export function verifyJWT(token: string): { userId: number } | null {
  if (!JWT_SECRET) throw new Error('JWT_SECRET no configurado');
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: 'panel-seguro',
    }) as jwt.JwtPayload;
    
    if (decoded && decoded.sub) {
      return { userId: parseInt(decoded.sub as string) };
    }
    return null;
  } catch {
    return null;
  }
}

export function generateHexToken(length: number = 32): string {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (c) => map[c]);
}
