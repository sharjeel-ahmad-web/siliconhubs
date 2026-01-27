import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { query } from '@/lib/db/connection';

/**
 * Generate a new 2FA secret for a user
 * @param userId User ID
 * @param email User email
 * @returns Secret and QR code data URL
 */
export async function generateTwoFactorSecret(
  userId: number,
  email: string
): Promise<{ secret: string; qrCode: string }> {
  const secret = speakeasy.generateSecret({
    name: `Rising Dot Agency (${email})`,
    issuer: 'Rising Dot Agency',
  });

  const qrCode = await QRCode.toDataURL(secret.otpauth_url || '');

  return {
    secret: secret.base32,
    qrCode,
  };
}

/**
 * Enable 2FA for a user
 * @param userId User ID
 * @param secret 2FA secret
 * @param token Verification token
 * @returns True if enabled successfully, false otherwise
 */
export async function enableTwoFactor(
  userId: number,
  secret: string,
  token: string
): Promise<boolean> {
  // Verify the token first
  const isValid = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2,
  });

  if (!isValid) {
    return false;
  }

  // Update user in database
  await query(
    'UPDATE users SET two_factor_enabled = TRUE, two_factor_secret = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
    [secret, userId]
  );

  return true;
}

/**
 * Disable 2FA for a user
 * @param userId User ID
 * @param token Verification token
 * @returns True if disabled successfully, false otherwise
 */
export async function disableTwoFactor(
  userId: number,
  token: string
): Promise<boolean> {
  // Get user's current secret
  const users = await query<{ two_factor_secret: string }>(
    'SELECT two_factor_secret FROM users WHERE id = $1',
    [userId]
  );

  const user = users[0];

  if (!user || !user.two_factor_secret) {
    return false;
  }

  // Verify the token
  const isValid = speakeasy.totp.verify({
    secret: user.two_factor_secret,
    encoding: 'base32',
    token,
    window: 2,
  });

  if (!isValid) {
    return false;
  }

  // Update user in database
  await query(
    'UPDATE users SET two_factor_enabled = FALSE, two_factor_secret = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
    [userId]
  );

  return true;
}

/**
 * Verify a 2FA token
 * @param userId User ID
 * @param token Token to verify
 * @returns True if valid, false otherwise
 */
export async function verifyTwoFactorToken(
  userId: number,
  token: string
): Promise<boolean> {
  const users = await query<{ two_factor_secret: string }>(
    'SELECT two_factor_secret FROM users WHERE id = $1 AND two_factor_enabled = TRUE',
    [userId]
  );

  const user = users[0];

  if (!user || !user.two_factor_secret) {
    return false;
  }

  return speakeasy.totp.verify({
    secret: user.two_factor_secret,
    encoding: 'base32',
    token,
    window: 2,
  });
}
