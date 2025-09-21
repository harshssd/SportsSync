import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.socialProvider.delete({
      where: {
        userId_provider: {
          userId: session.user.id,
          provider: 'instagram',
        },
      },
    });
    return NextResponse.json({ message: 'Instagram connection removed successfully.' });
  } catch (error) {
    console.error('Failed to delete instagram connection:', error);
    // It's okay if it doesn't exist, maybe the user clicked twice.
    // Prisma throws an error if record to delete is not found.
    return NextResponse.json({ message: 'Instagram connection removed successfully.' });
  }
}
