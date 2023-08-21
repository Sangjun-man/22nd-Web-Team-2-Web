import { logout } from '@/api/mypage/mypage';
import {
  COOKIE_ACCESS_TOKEN_KEY,
  COOKIE_REFRESH_TOKEN_KEY
} from '@/constants/cookieKeys';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const cookies = req.cookies;
  const redirectPath = cookies.get('redirectUrl')?.value || '/';
  const redirectTo = `${req.nextUrl.origin}${decodeURIComponent(redirectPath)}`;
  const accessToken = cookies.get(COOKIE_ACCESS_TOKEN_KEY)?.value;

  try {
    if (!accessToken) throw new Error('accessToken is not exist');
    await logout({
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const res = NextResponse.json({
      success: true,
      redirctURI: redirectTo
    });

    res.cookies.delete(COOKIE_ACCESS_TOKEN_KEY);
    res.cookies.delete(COOKIE_REFRESH_TOKEN_KEY);
    return res;
  } catch (e) {
    const err = e as Error;
    return NextResponse.json({
      success: false,
      error: err.message,
      status: 400
    });
  }
}
