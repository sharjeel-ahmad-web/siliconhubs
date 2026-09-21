import { sendTransactionalEmail } from '@/lib/email';

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
  if (!adminEmail) {
    throw new Error('No notification email configured for contact form.');
  }

  await sendTransactionalEmail({
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
}
// ---------------------------------------------------------------------------
// Careers / recruitment emails — reuse the same Resend infrastructure.
// Candidate-facing templates (application received, status updates, interviews).
// ---------------------------------------------------------------------------

interface ApplicationReceivedData {
  candidateName: string;
  jobTitle: string;
  referenceId: string;
}

export async function sendApplicationReceivedEmail(
  data: ApplicationReceivedData & { email: string }
) {
  const careersEmail =
    process.env.CAREERS_EMAIL || 'careers@siliconhubs.agency';

  await sendTransactionalEmail({
    to: data.email,
    replyTo: careersEmail,
    subject: `Application received — ${data.jobTitle} | SiliconHubs`,
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #363534;">
          <h2 style="color: #0a192f;">Thank you for applying, ${data.candidateName}!</h2>
          <p>We have received your application for <strong>${data.jobTitle}</strong> at SiliconHubs.</p>
          <p><strong>Your reference id:</strong> ${data.referenceId}</p>
          <div style="background: #ffe8c1; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="color: #515161; margin: 0;">
              Our recruitment team reviews every application carefully. You will hear from
              us next at each stage of the hiring process — no silent rejections.
            </p>
          </div>
          <p>Best regards,<br/>The SiliconHubs Team</p>
        </div>
      `,
  });
}

export interface ApplicationStatusUpdateData {
  email: string;
  candidateName: string;
  jobTitle: string;
  stage: string;
  message?: string;
}

export async function sendApplicationStatusEmail(
  data: ApplicationStatusUpdateData
) {
  const careersEmail =
    process.env.CAREERS_EMAIL || 'careers@siliconhubs.agency';

  await sendTransactionalEmail({
    to: data.email,
    replyTo: careersEmail,
    subject: `Application update — ${data.jobTitle} | SiliconHubs`,
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #363534;">
          <h2 style="color: #0a192f;">Hi ${data.candidateName},</h2>
          <p>There is an update on your application for <strong>${data.jobTitle}</strong>.</p>
          <p><strong>Current stage:</strong> ${data.stage}</p>
          ${data.message ? `<p>${data.message}</p>` : ''}
          <p>If you have questions, reply to this email and we will get back to you.</p>
          <p>Best regards,<br/>The SiliconHubs Team</p>
        </div>
      `,
  });
}

export interface InterviewInviteData {
  email: string;
  candidateName: string;
  jobTitle: string;
  interviewType: string;
  date: string;
  time: string;
  timezone?: string;
  meetingLink?: string;
  interviewer?: string;
}

export async function sendInterviewInviteEmail(data: InterviewInviteData) {
  const careersEmail =
    process.env.CAREERS_EMAIL || 'careers@siliconhubs.agency';

  await sendTransactionalEmail({
    to: data.email,
    replyTo: careersEmail,
    subject: `Interview invitation — ${data.jobTitle} | SiliconHubs`,
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #363534;">
          <h2 style="color: #0a192f;">Interview invitation, ${data.candidateName}!</h2>
          <p>We are excited to move your application for <strong>${data.jobTitle}</strong> forward.</p>
          <div style="background: #ffe8c1; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Interview type:</strong> ${data.interviewType}</p>
            <p><strong>Date:</strong> ${data.date}</p>
            <p><strong>Time:</strong> ${data.time} ${data.timezone ? `(${data.timezone})` : ''}</p>
            ${data.interviewer ? `<p><strong>Interviewer:</strong> ${data.interviewer}</p>` : ''}
            ${data.meetingLink ? `<p><strong>Join link:</strong> <a href="${data.meetingLink}">${data.meetingLink}</a></p>` : ''}
          </div>
          <p>Best regards,<br/>The SiliconHubs Team</p>
        </div>
      `,
  });
}
