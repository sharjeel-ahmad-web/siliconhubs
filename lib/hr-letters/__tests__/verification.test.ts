import { getHRLetterVerificationUrl } from '@/lib/hr-letters/verification';

describe('HR letter verification URLs', () => {
  it('always uses the public SiliconHubs domain', () => {
    expect(getHRLetterVerificationUrl('abc123')).toBe(
      'https://siliconhubs.com/verify/hr-letter/abc123'
    );
  });

  it('encodes the verification token as a URL path segment', () => {
    expect(getHRLetterVerificationUrl('token/with spaces')).toBe(
      'https://siliconhubs.com/verify/hr-letter/token%2Fwith%20spaces'
    );
  });
});
