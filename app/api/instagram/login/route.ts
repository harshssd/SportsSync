import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { randomBytes } from 'crypto';

export async function GET(req: NextRequest) {
  const state = randomBytes(16).toString('hex');
  // In a real app, you'd store this state in the user's session or a temporary cookie to verify on callback.
  // For simplicity in this MVP, we'll just pass it along.

  const scope = 'instagram_basic,pages_show_list';

  const authorizationUrl = new URL('https://www.facebook.com/v19.0/dialog/oauth');
  authorizationUrl.searchParams.set('client_id', env.META_APP_ID);
  authorizationUrl.searchParams.set('redirect_uri', `${env.NEXT_PUBLIC_APP_URL}/api/instagram/callback`);
  authorizationUrl.searchParams.set('state', state);
  authorizationUrl.searchParams.set('scope', scope);
  authorizationUrl.searchParams.set('response_type', 'code');

  return NextResponse.redirect(authorizationUrl.toString());
}
