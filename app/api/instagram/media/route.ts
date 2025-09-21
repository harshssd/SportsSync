import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { decrypt, deserializeEncryptedData } from '@/lib/crypto';
import { getInstagramMedia } from '@/lib/instagram';

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
    const mediaData = await getInstagramMedia(connection.igBusinessAccountId, accessToken);
    return NextResponse.json(mediaData);
  } catch (error: any) {
    console.error('Failed to fetch Instagram media:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch Instagram media' }, { status: error.status || 500 });
  }
}
