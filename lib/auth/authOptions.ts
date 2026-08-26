import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

// Admin credentials - loaded from environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

// Validate admin credentials are set
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.warn(
    'âš ï¸ WARNING: ADMIN_EMAIL or ADMIN_PASSWORD not set in environment variables'
  );
}

// Build providers array conditionally
const providers: any[] = [
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
      token: { label: '2FA Token', type: 'text', optional: true },
    },
    async authorize(credentials) {
      // Check if admin credentials are configured
      if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        console.error(
          'âŒ Admin credentials not configured in environment variables'
        );
        return null;
      }

      // Debug: Log what we received
      console.log('=== LOGIN ATTEMPT ===');
      console.log('Received email:', credentials?.email);
      console.log(
        'Received password:',
        credentials?.password ? '[HIDDEN]' : 'empty'
      );
      console.log('Expected email:', ADMIN_EMAIL);

      if (!credentials?.email || !credentials?.password) {
        console.log('Missing credentials');
        return null;
      }

      // Direct comparison with environment variables
      const inputEmail = credentials.email.trim().toLowerCase();
      const expectedEmail = ADMIN_EMAIL.toLowerCase();
      const inputPassword = credentials.password;
      const expectedPassword = ADMIN_PASSWORD;

      console.log(
        'Email comparison:',
        inputEmail,
        '===',
        expectedEmail,
        ':',
        inputEmail === expectedEmail
      );
      console.log('Password comparison:', inputPassword === expectedPassword);

      if (inputEmail === expectedEmail && inputPassword === expectedPassword) {
        console.log('âœ“ Login successful!');
        return {
          id: '1',
          email: ADMIN_EMAIL,
          name: 'Admin',
          role: 'admin',
        };
      }

      console.log('âœ— Login failed - credentials do not match');
      return null;
    },
  }),
];

// Only add Google provider if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 15 * 60, // 15 minutes
  },
  jwt: {
    maxAge: 15 * 60, // 15 minutes
  },
  secret: (() => {
    const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
    if (!secret) {
      console.error(
        'âŒ CRITICAL: NEXTAUTH_SECRET is not set in environment variables!'
      );
      console.error('ðŸ’¡ Please add NEXTAUTH_SECRET to your .env.local file');
      throw new Error('NEXTAUTH_SECRET is required');
    }
    return secret;
  })(),
};
