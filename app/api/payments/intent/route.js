import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getAuthStore } from '@/lib/authStore';
import { getUserFromRequest } from '@/lib/serverAuth';

export async function POST(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const amount = Number(body.amount || 0);
    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, error: 'amount must be greater than 0' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const payment = {
      id: uuidv4(),
      reference: body.reference || `PAY-${Date.now()}`,
      module: body.module || 'MARKET',
      payerId: user.id,
      receiverId: body.receiverId || '',
      amount,
      currency: body.currency || 'USD',
      provider: body.provider || 'MANUAL_MOBILE_MONEY',
      providerPhone: body.providerPhone || '',
      status: 'PENDING_PROVIDER',
      escrowStatus: body.escrow === false ? 'DIRECT' : 'ESCROW_PENDING',
      metadata: body.metadata || {},
      createdAt: now,
      updatedAt: now,
    };

    const store = await getAuthStore();
    await store.insertPayment(payment);

    return NextResponse.json({
      success: true,
      payment,
      nextAction: {
        type: 'COLLECT_PROVIDER_PAYMENT',
        message: 'Connecter ici Orange Money, M-Pesa, Airtel Money, Stripe ou un agregateur local.',
      },
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
