import { NextResponse } from 'next/server';
import { getAuthStore } from '@/lib/authStore';

export async function GET(request, { params }) {
  try {
    const store = await getAuthStore();
    const upload = await store.findUpload(params.id);
    if (!upload) return NextResponse.json({ success: false, error: 'Upload not found' }, { status: 404 });

    const base64 = String(upload.fileBase64 || '').includes(',')
      ? String(upload.fileBase64).split(',').pop()
      : upload.fileBase64;
    const bytes = Buffer.from(base64, 'base64');

    return new NextResponse(bytes, {
      headers: {
        'Content-Type': upload.mimeType || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
