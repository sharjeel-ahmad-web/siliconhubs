import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/db/mongodb';
import { getChatResponse, ChatMessage } from '@/lib/groq';
import { Resend } from 'resend';

const DB_NAME = 'rising-dot';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { conversationId, message } = await request.json();

    if (!conversationId || !message) {
      return NextResponse.json(
        { error: 'Conversation ID and message are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Get conversation
    const conversation = await db.collection('conversations').findOne({
      _id: new ObjectId(conversationId),
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Add user message
    const userMessage = {
      role: 'user' as const,
      content: message,
      timestamp: new Date(),
    };

    await db.collection('conversations').updateOne(
      { _id: new ObjectId(conversationId) },
      {
        $push: { messages: userMessage as any },
        $set: { updatedAt: new Date() },
      }
    );

    // If conversation is in human mode, don't get AI response
    if (conversation.status === 'waiting' || conversation.status === 'human') {
      return NextResponse.json({
        message: userMessage,
        aiResponse: null,
        status: conversation.status,
      });
    }

    // Get AI response
    const previousMessages: ChatMessage[] = conversation.messages.map(
      (msg: any) => ({
        role: msg.role,
        content: msg.content,
      })
    );

    const { response, wantsHuman } = await getChatResponse(
      previousMessages,
      message
    );

    const assistantMessage = {
      role: 'assistant' as const,
      content: response,
      timestamp: new Date(),
    };

    // Update conversation with AI response
    const updateData: any = {
      $push: { messages: assistantMessage },
      $set: { updatedAt: new Date() },
    };

    if (wantsHuman) {
      updateData.$set.status = 'waiting';

      // Send notification email for human support request
      try {
        const notificationEmail =
          process.env.CHAT_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;

        if (notificationEmail) {
          await resend.emails.send({
            from: 'Rising Dot <onboarding@resend.dev>',
            to: notificationEmail,
            subject: `🔔 Human Support Requested - ${conversation.visitorName}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #F58122;">Human Support Requested</h2>
                <p>A visitor has requested to speak with a human:</p>
                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>Name:</strong> ${conversation.visitorName}</p>
                  <p><strong>Email:</strong> ${conversation.visitorEmail}</p>
                  <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                </div>
                <p><strong>Their last message:</strong></p>
                <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 10px 0;">
                  "${message}"
                </div>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/live-chat/${conversationId}" 
                   style="display: inline-block; background: #F58122; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 15px;">
                  Reply Now
                </a>
              </div>
            `,
          });
        }
      } catch (emailError) {
        console.error('Failed to send human support notification:', emailError);
      }
    }

    await db
      .collection('conversations')
      .updateOne({ _id: new ObjectId(conversationId) }, updateData);

    return NextResponse.json({
      message: userMessage,
      aiResponse: assistantMessage,
      status: wantsHuman ? 'waiting' : 'ai',
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

// GET - Fetch messages for a conversation (for polling)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const lastMessageCount = parseInt(searchParams.get('lastCount') || '0');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const conversation = await db.collection('conversations').findOne({
      _id: new ObjectId(conversationId),
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Return only new messages if lastMessageCount is provided
    const messages = conversation.messages;
    const newMessages =
      lastMessageCount > 0 ? messages.slice(lastMessageCount) : messages;

    return NextResponse.json({
      messages: newMessages,
      totalCount: messages.length,
      status: conversation.status,
      hasNewMessages: newMessages.length > 0,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
