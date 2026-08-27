import { NextResponse } from 'next/server';

export async function GET() {
  const checks = {
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
    MONGODB_URI: !!process.env.MONGODB_URI,
  };

  return NextResponse.json({
    status: 'ok',
    checks,
    message: checks.NEXTAUTH_SECRET 
      ? 'All environment variables are loaded' 
      : '⚠️ NEXTAUTH_SECRET is missing',
  });
}

