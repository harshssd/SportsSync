import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { env } from '@/lib/env';
import prisma from '@/lib/prisma';
import { serializeEncryptedData, encrypt } from '@/lib/crypto';

async function exchangeCodeForToken(code: string) {
  const url = new URL('https://graph.facebook.com/v19.0/oauth/access_token');
  url.searchParams.set('client_id', env.META_APP_ID);
  url.searchParams.set('client_secret', env.META_APP_SECRET);
  url.searchParams.set('redirect_uri', `${env.NEXT_PUBLIC_APP_URL}/api/instagram/callback`);
  url.searchParams.set('code', code);

  const response = await fetch(url.toString());
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to exchange code for token');
  }
  return data.access_token;
}

async function getLongLivedToken(shortLivedToken: string) {
  const url = new URL('https://graph.facebook.com/v19.0/oauth/access_token');
  url.searchParams.set('grant_type', 'fb_exchange_token');
  url.searchParams.set('client_id', env.META_APP_ID);
  url.searchParams.set('client_secret', env.META_APP_SECRET);
  url.searchParams.set('fb_exchange_token', shortLivedToken);

  const response = await fetch(url.toString());
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to exchange for long-lived token');
  }
  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
  };
}

async function getInstagramBusinessAccountId(accessToken: string): Promise<string | null> {
    const url = `https://graph.facebook.com/v19.0/me/accounts?fields=instagram_business_account&access_token=${accessToken}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch Facebook pages');
    }

    // Find the first page that has an Instagram Business Account linked
    for (const page of data.data) {
        if (page.instagram_business_account) {
            return page.instagram_business_account.id;
        }
    }

    return null; // No linked Instagram Business Account found
}


export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    console.error('OAuth error:', error);
    return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/dashboard?error=oauth_failed`);
  }
  
  if (!code) {
    return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
  }

  try {
    const shortLivedToken = await exchangeCodeForToken(code);
    const { accessToken: longLivedToken, expiresIn } = await getLongLivedToken(shortLivedToken);
    
    const igBusinessAccountId = await getInstagramBusinessAccountId(longLivedToken);

    if (!igBusinessAccountId) {
        return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/dashboard?error=no_business_account`);
    }

    const encryptedToken = serializeEncryptedData(encrypt(longLivedToken));
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    await prisma.socialProvider.upsert({
      where: {
        userId_provider: {
          userId: session.user.id,
          provider: 'instagram',
        },
      },
      update: {
        igBusinessAccountId: igBusinessAccountId,
        longLivedAccessTokenEnc: encryptedToken,
        tokenExpiresAt: expiresAt,
      },
      create: {
        userId: session.user.id,
        provider: 'instagram',
        igBusinessAccountId: igBusinessAccountId,
        longLivedAccessTokenEnc: encryptedToken,
        tokenExpiresAt: expiresAt,
      },
    });

    return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/dashboard`);

  } catch (err: any) {
    console.error('Instagram callback error:', err);
    return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/dashboard?error=${encodeURIComponent(err.message)}`);
  }
}
