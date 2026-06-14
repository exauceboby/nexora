import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getAuthStore } from '@/lib/authStore';
import { getUserFromRequest } from '@/lib/serverAuth';

export async function POST(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    if (!body.fileBase64 || !body.fileName) {
      return NextResponse.json({ success: false, error: 'fileBase64 and fileName are required' }, { status: 400 });
    }

    const upload = {
      id: uuidv4(),
      ownerId: user.id,
      fileName: body.fileName,
      mimeType: body.mimeType || 'application/octet-stream',
      size: Number(body.size || 0),
      purpose: body.purpose || 'profile',
      fileBase64: body.fileBase64,
      createdAt: new Date().toISOString(),
    };

    const store = await getAuthStore();
    await store.insertUpload(upload);

    return NextResponse.json({
      success: true,
      upload: {
        id: upload.id,
        fileName: upload.fileName,
        mimeType: upload.mimeType,
        size: upload.size,
        purpose: upload.purpose,
        url: `/api/uploads/${upload.id}`,
      },
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
