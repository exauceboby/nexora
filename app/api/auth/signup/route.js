import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getAuthStore } from '@/lib/authStore';
import { createToken, hashPassword, publicUser } from '@/lib/serverAuth';

export async function POST(request) {
  try {
    const store = await getAuthStore();
    const body = await request.json();
    const email = String(body.email || '').toLowerCase().trim();

    if (!email || !body.password || !body.name) {
      return NextResponse.json({ success: false, error: 'name, email and password are required' }, { status: 400 });
    }

    const existing = await store.findUser({ email });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already exists' }, { status: 409 });
    }

    const role = body.role || 'ACHETEUR';
    const now = new Date().toISOString();
    const user = {
      id: uuidv4(),
      name: body.name,
      email,
      phone: body.phone || '',
      role,
      city: body.city || 'Kinshasa',
      companyName: body.companyName || '',
      address: body.address || '',
      avatarUrl: '',
      kycStatus: ['VENDEUR', 'FOURNISSEUR'].includes(role) ? 'PENDING' : 'VERIFIED',
      status: ['VENDEUR', 'FOURNISSEUR'].includes(role) ? 'PENDING_VERIFICATION' : 'ACTIVE',
      availableBalance: 0,
      blockedBalance: 0,
      passwordHash: hashPassword(body.password),
      createdAt: now,
      updatedAt: now,
    };

    const token = createToken();
    await store.insertUser(user);
    await store.insertSession({ id: uuidv4(), token, userId: user.id, createdAt: now });

    return NextResponse.json({ success: true, token, user: publicUser(user) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
