import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { isAdminOrModerator } from '@/lib/permissions';

export async function POST(request: Request): Promise<NextResponse> {
  const { allowed } = await isAdminOrModerator();
  if (!allowed) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename || !request.body) {
    return NextResponse.json({ message: 'Missing filename or file body' }, { status: 400 });
  }

  const blob = await put(filename, request.body, {
    access: 'public',
  });

  return NextResponse.json(blob);
}
