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
  // Using Resend account email for testing (until domain is verified)
  const adminEmail = 'achagames6@gmail.com';

  try {
    const { error } = await resend.emails.send({
      from: 'Rising Dot <onboarding@resend.dev>',
      to: adminEmail,
      subject: `New Contact: ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563EB;">New Contact Form Submission</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
            ${data.service ? `<p><strong>Service:</strong> ${data.service}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 4px;">${data.message}</p>
          </div>
          <p style="color: #64748b; font-size: 14px;">
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
