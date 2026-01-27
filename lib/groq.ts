import Groq from 'groq-sdk';
import fs from 'fs';
import path from 'path';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Load agency knowledge base
function getKnowledgeBase(): string {
  try {
    const knowledgePath = path.join(
      process.cwd(),
      'data',
      'agency-knowledge.md'
    );
    return fs.readFileSync(knowledgePath, 'utf-8');
  } catch (error) {
    console.error('Error loading knowledge base:', error);
    return '';
  }
}

const SYSTEM_PROMPT = `You are a helpful customer support assistant for Rising Dot Agency, a premium digital agency. 

Your role is to:
1. Answer questions about our services, pricing, and process
2. Help visitors understand what we offer
3. Be friendly, professional, and helpful
4. If you don't know something specific, suggest they contact us directly

Important guidelines:
- Keep responses concise and helpful (2-3 sentences when possible)
- Be warm and welcoming
- If someone asks for pricing, explain that it varies by project and suggest a free consultation
- If someone wants to speak to a human, acknowledge their request politely

Here is our agency information:

{KNOWLEDGE_BASE}

Remember: You represent Rising Dot Agency. Be professional, helpful, and friendly.`;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function getChatResponse(
  messages: ChatMessage[],
  userMessage: string
): Promise<{ response: string; wantsHuman: boolean }> {
  const knowledgeBase = getKnowledgeBase();
  const systemPrompt = SYSTEM_PROMPT.replace('{KNOWLEDGE_BASE}', knowledgeBase);

  // Check if user wants to talk to a human
  const humanKeywords = [
    'talk to human',
    'speak to human',
    'human agent',
    'real person',
    'customer service',
    'customer support',
    'talk to someone',
    'speak to someone',
    'representative',
    'live agent',
    'human support',
    'connect me',
    'transfer me',
  ];

  const lowerMessage = userMessage.toLowerCase();
  const wantsHuman = humanKeywords.some((keyword) =>
    lowerMessage.includes(keyword)
  );

  if (wantsHuman) {
    return {
      response:
        "I understand you'd like to speak with a team member. I'm connecting you now - someone from our team will be with you shortly. In the meantime, feel free to share any details about what you need help with!",
      wantsHuman: true,
    };
  }

  try {
    const chatMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: userMessage },
    ];

    const completion = await groq.chat.completions.create({
      messages: chatMessages,
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 500,
    });

    const response =
      completion.choices[0]?.message?.content ||
      "I apologize, but I'm having trouble responding right now. Please try again or contact us directly.";

    return { response, wantsHuman: false };
  } catch (error) {
    console.error('Groq API error:', error);
    return {
      response:
        "I'm sorry, I'm experiencing some technical difficulties. Please try again in a moment, or feel free to contact us directly at contact@risingdot.com",
      wantsHuman: false,
    };
  }
}
