import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactEmailData {
  name: string;
  email: string;
  company?: string;
  service?: string;
  message: string;
}

export async function sendContactNotification(data: ContactEmailData) {
  // Contact form submissions are delivered to the agency inbox.
  const adminEmail = process.env.CONTACT_EMAIL || 'contact@siliconhubs.com';
  // Sender must be a domain verified in Resend (e.g. siliconhubs.com).
  const from =
    process.env.EMAIL_FROM || 'SiliconHubs <onboarding@siliconhubs.com>';

  if (!adminEmail) {
    console.error('No notification email configured for contact form');
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from,
      to: adminEmail,
      subject: `New Contact: ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0a192f;">New Contact Form Submission</h2>
          <div style="background: #ffe8c1; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
            ${data.service ? `<p><strong>Service:</strong> ${data.service}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 4px;">${data.message}</p>
          </div>
          <p style="color: #515161; font-size: 14px;">
            Reply directly to this email or <a href="mailto:${data.email}">click here</a> to respond.
          </p>
        </div>
      `,
      replyTo: data.email,
    });

    if (error) {
      console.error('Resend error:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}
