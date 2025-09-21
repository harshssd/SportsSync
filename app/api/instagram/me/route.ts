import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { decrypt, deserializeEncryptedData } from '@/lib/crypto';
import { getInstagramProfile } from '@/lib/instagram';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const connection = await prisma.socialProvider.findFirst({
    where: { userId: session.user.id, provider: 'instagram' },
  });

  if (!connection?.longLivedAccessTokenEnc || !connection.igBusinessAccountId) {
    return NextResponse.json({ error: 'Instagram not connected' }, { status: 404 });
  }

  const encryptedData = deserializeEncryptedData(connection.longLivedAccessTokenEnc);
  if (!encryptedData) {
    return NextResponse.json({ error: 'Invalid token format' }, { status: 500 });
  }

  try {
    const accessToken = decrypt(encryptedData);
    const profileData = await getInstagramProfile(connection.igBusinessAccountId, accessToken);
    return NextResponse.json(profileData);
  } catch (error: any) {
    console.error('Failed to fetch Instagram profile:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch Instagram profile' }, { status: error.status || 500 });
  }
}
