import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { Resend } from 'resend';

const DB_NAME = 'rising-dot';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Save to subscribers collection
    await db.collection('subscribers').updateOne(
      { email },
      {
        $set: {
          email,
          name,
          source: 'live-chat',
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
          status: 'active',
        },
      },
      { upsert: true }
    );

    // Create new conversation
    const conversation = {
      visitorName: name,
      visitorEmail: email,
      status: 'ai', // ai | waiting | human | resolved
      messages: [
        {
          role: 'assistant',
          content: `Hi ${name}! 👋 Welcome to Rising Dot. I'm here to help you with any questions about our services. How can I assist you today?`,
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      notificationSent: false,
    };

    const result = await db.collection('conversations').insertOne(conversation);

    // Send email notification
    try {
      const notificationEmail =
        process.env.CHAT_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;

      if (notificationEmail) {
        await resend.emails.send({
          from: 'Rising Dot <onboarding@resend.dev>',
          to: notificationEmail,
          subject: `New Chat Started - ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #F58122;">New Live Chat Started</h2>
              <p>A new visitor has started a chat on your website:</p>
              <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              </div>
              <p>The AI assistant is currently handling the conversation. You'll be notified if they request human support.</p>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/live-chat" 
                 style="display: inline-block; background: #F58122; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 15px;">
                View in Dashboard
              </a>
            </div>
          `,
        });

        // Mark notification as sent
        await db
          .collection('conversations')
          .updateOne(
            { _id: result.insertedId },
            { $set: { notificationSent: true } }
          );
      }
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
    }

    return NextResponse.json({
      conversationId: result.insertedId.toString(),
      message: conversation.messages[0],
    });
  } catch (error) {
    console.error('Error starting chat:', error);
    return NextResponse.json(
      { error: 'Failed to start chat' },
      { status: 500 }
    );
  }
}
