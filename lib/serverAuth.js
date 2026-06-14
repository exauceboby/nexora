import crypto from 'crypto';
import { getAuthStore } from '@/lib/authStore';

export function publicUser(user) {
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export function hashPassword(password) {
  const secret = process.env.AUTH_SECRET || 'nexora-dev-secret';
  return crypto.createHmac('sha256', secret).update(String(password || '')).digest('hex');
}

export function createToken() {
  return crypto.randomBytes(32).toString('hex');
}

export async function getUserFromRequest(request) {
  const header = request.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return null;

  const store = await getAuthStore();
  const session = await store.findSession({ token, revokedAt: { $exists: false } });
  if (!session) return null;

  const user = await store.findUser({ id: session.userId });
  return user || null;
}
