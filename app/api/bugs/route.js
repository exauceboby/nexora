import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getAuthStore } from '@/lib/authStore';

export async function GET() {
  const store = await getAuthStore();
  const reports = await store.listBugReports();
  return NextResponse.json({ success: true, reports, bugs: reports });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const title = String(body.title || '').trim();
    const description = String(body.description || '').trim();

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Titre et description du bug sont obligatoires.' },
        { status: 400 },
      );
    }

    const report = {
      id: uuidv4(),
      title,
      module: body.module || 'SYSTEME',
      description,
      page: body.page || '',
      priority: body.priority || body.severity || 'MEDIUM',
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };
    const store = await getAuthStore();
    await store.insertBugReport(report);
    return NextResponse.json({ success: true, report, bug: report });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
