export const HR_LETTER_VERIFICATION_ORIGIN = 'https://siliconhubs.com';

export function getHRLetterVerificationUrl(token: string): string {
  return new URL(
    `/verify/hr-letter/${encodeURIComponent(token)}`,
    HR_LETTER_VERIFICATION_ORIGIN
  ).toString();
}
