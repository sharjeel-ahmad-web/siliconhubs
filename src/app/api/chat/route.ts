import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { generateChatResponse } from '@/lib/groq';

export async function POST(request: NextRequest) {
  try {
    const { messages, sessionId } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'siliconhubs');

    let context = '';

    try {
      const [blogs, projects, services, pages] = await Promise.all([
        db.collection('blogs').find({ status: 'published' }).limit(5).toArray(),
        db
          .collection('projects')
          .find({ status: 'published' })
          .limit(5)
          .toArray(),
        db
          .collection('services')
          .find({ status: 'active' })
          .limit(10)
          .toArray(),
        db
          .collection('pages')
          .find({ status: 'published' })
          .limit(10)
          .toArray(),
      ]);

      context = `
You are Silicon Hubs AI Assistant. Here is the current site context:

SERVICES:
${services.map((s) => `- ${s.title}: ${s.shortDescription}`).join('\n') || 'No services available'}

RECENT PROJECTS:
${projects.map((p) => `- ${p.title} (${p.category}): ${p.shortDescription}`).join('\n') || 'No projects available'}

RECENT BLOGS:
${blogs.map((b) => `- ${b.title}: ${b.excerpt}`).join('\n') || 'No blogs available'}

PAGES:
${pages.map((p) => `- ${p.title}: ${p.slug}`).join('\n') || 'No pages available'}

SILICON HUBS OVERVIEW:
Silicon Hubs is a premium digital agency based in India offering:
- Web Design & Development
- AI Chatbot Development
- N8N Automations
- Digital Marketing
- WordPress Development
- Shopify Development
- SEO Optimization

  CONTACT INFO:
  Email: contact@siliconhubs.com
  Phone: +92 317 4662728

RULES:
- Always be helpful, professional, and friendly
- If you don't know something about Silicon Hubs, say so
- Keep responses concise but informative
- Encourage users to contact us for detailed inquiries
- Use the context above to answer questions accurately
`;
    } catch (dbError) {
      console.error('Error fetching context:', dbError);
      context = `
You are Silicon Hubs AI Assistant. The database is currently unavailable, but here is what you know:
Silicon Hubs is a premium digital agency offering web design, AI chatbots, N8N automations, digital marketing, WordPress, Shopify, and SEO services.
`;
    }

    const aiResponse = await generateChatResponse(
      messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      context
    );

    if (sessionId) {
      const messagesCollection = db.collection('chatMessages');
      await messagesCollection.insertOne({
        sessionId,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      });
    }

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
