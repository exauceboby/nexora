import { NextResponse } from 'next/server';
import { getAuthStore } from '@/lib/authStore';
import { getUserFromRequest } from '@/lib/serverAuth';

export async function PUT(request, { params }) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const status = body.status || 'PAID';
    const update = {
      status,
      providerReference: body.providerReference || '',
      updatedAt: new Date().toISOString(),
    };

    if (status === 'PAID') {
      update.escrowStatus = body.releaseNow ? 'RELEASED' : 'ESCROW_HOLD';
      update.paidAt = new Date().toISOString();
    }

    const store = await getAuthStore();
    const payment = await store.updatePayment(params.id, update);

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
