import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userId } = auth();
  const { role } = await req.json();

  if (!userId || !role) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: {
      role,
    },
  });

  return NextResponse.json({ success: true });
}
