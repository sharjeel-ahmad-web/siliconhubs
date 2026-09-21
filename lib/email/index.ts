import { createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Resend } from 'resend';
import { connectDB } from '@/lib/db/mongodb';

export type SmtpEncryption = 'tls' | 'ssl' | 'none';

export interface SmtpSettings {
  enabled?: boolean;
  host?: string;
  port?: string | number;
  encryption?: SmtpEncryption;
  username?: string;
  password?: string;
  fromEmail?: string;
}

interface EmailMessage {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);
const SMTP_SETTINGS_KEY = 'email_smtp';

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function safeErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code;
  const responseCode = (error as { responseCode?: number })?.responseCode;

  if (code === 'EAUTH' || responseCode === 535) {
    return 'SMTP authentication failed. Check the username and app password.';
  }
  if (code === 'ENOTFOUND') {
    return 'SMTP host could not be found. Check the SMTP host.';
  }
  if (code === 'ECONNREFUSED') {
    return 'SMTP connection was refused. Check the host and port.';
  }
  if (code === 'ETIMEDOUT' || code === 'ESOCKET') {
    return 'SMTP connection timed out. Check the host, port, and encryption.';
  }
  if (code === 'EENVELOPE') {
    return 'The sender or recipient email address is invalid.';
  }
  return 'The email provider could not send this message.';
}

async function getSmtpSettings(): Promise<SmtpSettings | null> {
  const db = await connectDB();
  const setting = await db.collection('settings').findOne({
    key: SMTP_SETTINGS_KEY,
  });
  return (setting?.value as SmtpSettings | undefined) || null;
}

function validateSmtpSettings(settings: SmtpSettings): Required<SmtpSettings> {
  const host = String(settings.host || '').trim();
  const username = String(settings.username || '').trim();
  const password = String(settings.password || '');
  const fromEmail = String(settings.fromEmail || '').trim();
  const encryption = settings.encryption || 'tls';
  const port = Number(settings.port);

  if (!host) throw new Error('SMTP host is required.');
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('SMTP port must be a number between 1 and 65535.');
  }
  if (!isValidEmail(username))
    throw new Error('SMTP username must be a valid email.');
  if (!password) throw new Error('SMTP password or app password is required.');
  if (!isValidEmail(fromEmail))
    throw new Error('A valid From email address is required.');
  if (!['tls', 'ssl', 'none'].includes(encryption)) {
    throw new Error('SMTP encryption must be TLS, SSL, or None.');
  }

  // Prevent an SMTP account from claiming an unrelated sender domain.
  if (
    fromEmail.split('@')[1].toLowerCase() !==
    username.split('@')[1].toLowerCase()
  ) {
    throw new Error(
      'From email must use the same domain as the SMTP username.'
    );
  }

  return {
    enabled: Boolean(settings.enabled),
    host,
    port,
    encryption,
    username,
    password,
    fromEmail,
  };
}

async function sendWithSmtp(
  settings: SmtpSettings,
  message: EmailMessage
): Promise<void> {
  const config = validateSmtpSettings(settings);
  const secure = config.encryption === 'ssl';
  const transport = (createTransport as any)({
    host: config.host,
    port: config.port,
    secure,
    requireTLS: config.encryption === 'tls',
    auth: { user: config.username, pass: config.password },
    ...(config.encryption === 'none' ? {} : { tls: { minVersion: 'TLSv1.2' } }),
  } as SMTPTransport.Options);

  try {
    await transport.sendMail({
      from: config.fromEmail,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
      replyTo: message.replyTo,
    });
  } catch (error) {
    throw new Error(safeErrorMessage(error));
  } finally {
    transport.close();
  }
}

async function sendWithResend(message: EmailMessage): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Resend is not configured.');
  }

  const from =
    process.env.EMAIL_FROM || 'SiliconHubs <onboarding@siliconhubs.com>';
  const { error } = await resend.emails.send({
    from,
    to: message.to,
    subject: message.subject,
    html: message.html,
    text: message.text,
    replyTo: message.replyTo,
  });

  if (error) throw new Error('Resend could not send this message.');
}

export async function sendTransactionalEmail(
  message: EmailMessage
): Promise<void> {
  let smtp: SmtpSettings | null = null;
  try {
    smtp = await getSmtpSettings();
  } catch {
    // Database failures should still allow the configured Resend fallback.
  }

  if (smtp?.enabled) {
    try {
      await sendWithSmtp(smtp, message);
      return;
    } catch (smtpError) {
      if (!process.env.RESEND_API_KEY) throw smtpError;
      try {
        await sendWithResend(message);
        return;
      } catch {
        throw smtpError;
      }
    }
  }

  await sendWithResend(message);
}

export async function sendTestEmail(recipient: string): Promise<void> {
  if (!isValidEmail(recipient))
    throw new Error('A valid test recipient email is required.');
  await sendTransactionalEmail({
    to: recipient,
    subject: 'SiliconHubs email configuration test',
    text: 'Your SiliconHubs email provider is configured correctly.',
    html: '<p>Your SiliconHubs email provider is configured correctly.</p>',
  });
}

export async function getEmailSettingsForAdmin() {
  const settings = await getSmtpSettings();
  return {
    enabled: Boolean(settings?.enabled),
    host: settings?.host || '',
    port: settings?.port || '',
    encryption: settings?.encryption || 'tls',
    username: settings?.username || '',
    fromEmail: settings?.fromEmail || '',
    passwordConfigured: Boolean(settings?.password),
  };
}

export { SMTP_SETTINGS_KEY };
