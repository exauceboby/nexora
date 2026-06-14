import { NextResponse } from 'next/server';
import { buildAiResponse } from '@/lib/aiEngine';

export async function POST(request) {
  try {
    const body = await request.json();
    const answer = buildAiResponse({
      message: body.message,
      context: body.context,
      role: body.role,
    });

    return NextResponse.json({
      success: true,
      answer,
      reply: answer,
      sources: ['Nexora marketplace workflows', 'Nexora support rules', 'Nexora bug triage'],
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
