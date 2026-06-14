import { NextResponse } from 'next/server';
import { getAuthStore } from '@/lib/authStore';
import { getUserFromRequest, publicUser } from '@/lib/serverAuth';

export async function GET(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ success: true, user: publicUser(user) });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const allowed = ['name', 'phone', 'city', 'companyName', 'address', 'avatarUrl'];
    const update = Object.fromEntries(Object.entries(body).filter(([key]) => allowed.includes(key)));
    update.updatedAt = new Date().toISOString();

    const store = await getAuthStore();
    const updated = await store.updateUser(user.id, update);

    return NextResponse.json({ success: true, user: publicUser(updated) });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
