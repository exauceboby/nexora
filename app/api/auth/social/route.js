import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getAuthStore } from '@/lib/authStore';
import { createToken, publicUser } from '@/lib/serverAuth';

const providers = ['GOOGLE', 'FACEBOOK', 'LINKEDIN'];

export async function POST(request) {
  try {
    const store = await getAuthStore();
    const body = await request.json();
    const provider = String(body.provider || '').toUpperCase().trim();
    const identifier = String(body.identifier || '').toLowerCase().trim();

    if (!providers.includes(provider)) {
      return NextResponse.json({ success: false, error: 'Provider not supported' }, { status: 400 });
    }

    if (!identifier) {
      return NextResponse.json({ success: false, error: 'Email or phone is required' }, { status: 400 });
    }

    const isEmail = identifier.includes('@');
    const lookup = isEmail ? { email: identifier } : { phone: identifier };
    const now = new Date().toISOString();
    let user = await store.findUser(lookup);

    if (!user) {
      user = {
        id: uuidv4(),
        name: body.name || 'Utilisateur Nexora',
        email: isEmail ? identifier : '',
        phone: isEmail ? '' : identifier,
        role: body.role || 'ACHETEUR',
        city: body.city || '',
        companyName: '',
        address: '',
        avatarUrl: '',
        authProviders: [provider],
        kycStatus: 'VERIFIED',
        status: 'ACTIVE',
        availableBalance: 0,
        blockedBalance: 0,
        passwordHash: '',
        createdAt: now,
        updatedAt: now,
      };
      await store.insertUser(user);
    } else {
      const authProviders = Array.from(new Set([...(user.authProviders || []), provider]));
      user = await store.updateUser(user.id, { authProviders, updatedAt: now });
    }

    const token = createToken();
    await store.insertSession({ id: uuidv4(), token, userId: user.id, provider, createdAt: now });

    return NextResponse.json({ success: true, token, user: publicUser(user), provider });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
