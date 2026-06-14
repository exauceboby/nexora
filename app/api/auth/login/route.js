import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getAuthStore } from '@/lib/authStore';
import { createToken, hashPassword, publicUser } from '@/lib/serverAuth';

export async function POST(request) {
  try {
    const store = await getAuthStore();
    const body = await request.json();
    const identifier = String(body.identifier || body.email || '').toLowerCase().trim();
    const passwordHash = hashPassword(body.password);

    const user = await store.findUser({
      $or: [{ email: identifier }, { phone: identifier }],
      passwordHash,
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const token = createToken();
    await store.insertSession({
      id: uuidv4(),
      token,
      userId: user.id,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, token, user: publicUser(user) });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
