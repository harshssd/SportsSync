import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const connection = await prisma.socialProvider.findFirst({
    where: {
      userId: session.user.id,
      provider: 'instagram',
      igBusinessAccountId: { not: null },
      longLivedAccessTokenEnc: { not: null },
      tokenExpiresAt: {
        gt: new Date(), // Check if the token is not expired
      },
    },
  });

  return NextResponse.json({ connected: !!connection });
}
