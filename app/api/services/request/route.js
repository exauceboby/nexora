import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getAuthStore } from '@/lib/authStore';

export async function GET() {
  const store = await getAuthStore();
  const requests = await store.listServiceRequests();
  return NextResponse.json({ success: true, requests, serviceRequests: requests });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const details = String(body.details || '').trim();

    if (!details) {
      return NextResponse.json(
        { success: false, error: 'Les details du service sont obligatoires.' },
        { status: 400 },
      );
    }

    const serviceRequest = {
      id: uuidv4(),
      service: body.service || 'Sourcing IA',
      details,
      priority: body.priority || 'NORMAL',
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };
    const store = await getAuthStore();
    await store.insertServiceRequest(serviceRequest);
    return NextResponse.json({ success: true, request: serviceRequest, serviceRequest });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
