import { NextResponse } from 'next/server';
import { platformState } from '@/lib/platformData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: platformState,
  });
}
