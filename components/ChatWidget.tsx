'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  isHuman?: boolean;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'chat'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [status, setStatus] = useState<'ai' | 'waiting' | 'human' | 'resolved'>(
    'ai'
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Polling for new messages when in waiting/human mode
  useEffect(() => {
    if (conversationId && (status === 'waiting' || status === 'human')) {
      pollingRef.current = setInterval(async () => {
        try {
          const res = await fetch(
            `/api/chat/message?conversationId=${conversationId}&lastCount=${messages.length}`
          );
          if (res.ok) {
            const data = await res.json();
            if (data.hasNewMessages && data.newMessages?.length > 0) {
              setMessages((prev) => [...prev, ...data.newMessages]);
            }
            if (data.status) {
              setStatus(data.status);
            }
          }
        } catch (error) {
          console.error('Polling error:', error);
        }
      }, 3000);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [conversationId, status, messages.length]);

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsStarting(true);
    try {
      const res = await fetch('/api/chat/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (res.ok) {
        const data = await res.json();
        setConversationId(data.conversationId);
        setMessages([data.message]);
        setStep('chat');
      }
    } catch (error) {
      console.error('Error starting chat:', error);
    } finally {
      setIsStarting(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !conversationId || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Optimistically add user message
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, message: userMessage }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.aiResponse) {
          setMessages((prev) => [...prev, data.aiResponse]);
        }
        if (data.status) {
          setStatus(data.status);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setStep('form');
    setName('');
    setEmail('');
    setConversationId(null);
    setMessages([]);
    setStatus('ai');
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#F58122] text-white shadow-lg transition-colors hover:bg-[#e0741d] ${isOpen ? 'hidden' : ''}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex h-[500px] max-h-[calc(100vh-6rem)] w-[380px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-[#37AFE1]/20 bg-[#0F172A] shadow-2xl"
          >
            {/* Header - Compact */}
            <div className="flex items-center justify-between bg-gradient-to-r from-[#F58122] to-[#F97316] px-4 py-3">
              <div className="flex items-center gap-2.5">
                <Bot className="h-6 w-6 text-white" />
                <span className="text-sm font-medium text-white">
                  {status === 'waiting'
                    ? 'Connecting...'
                    : status === 'human'
                      ? 'Live Agent'
                      : 'AI Assistant'}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 transition-colors hover:text-white"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            {step === 'form' ? (
              /* User Info Form */
              <div className="flex flex-1 flex-col justify-center p-6">
                <div className="mb-6 text-center">
                  <h4 className="mb-2 text-lg font-semibold text-white">
                    Welcome! 👋
                  </h4>
                  <p className="text-sm text-slate-400">
                    Please enter your details to start chatting
                  </p>
                </div>
                <form onSubmit={handleStartChat} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm text-slate-300">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                      className="w-full rounded-lg border border-slate-700 bg-[#1E293B] px-4 py-2.5 text-white placeholder-slate-500 focus:border-[#37AFE1] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-slate-300">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full rounded-lg border border-slate-700 bg-[#1E293B] px-4 py-2.5 text-white placeholder-slate-500 focus:border-[#37AFE1] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isStarting}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#F58122] py-3 font-semibold text-white transition-colors hover:bg-[#e0741d] disabled:opacity-50"
                  >
                    {isStarting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Starting...
                      </>
                    ) : (
                      'Start Chat'
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* Chat Messages */
              <>
                <div
                  className="scrollbar-hide flex-1 space-y-4 overflow-y-auto p-4"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                          msg.role === 'user'
                            ? 'rounded-br-md bg-[#F58122] text-white'
                            : 'rounded-bl-md bg-[#1E293B] text-slate-200'
                        }`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="mb-1 flex items-center gap-1.5">
                            {msg.isHuman ? (
                              <User className="h-3 w-3 text-[#37AFE1]" />
                            ) : (
                              <Bot className="h-3 w-3 text-[#37AFE1]" />
                            )}
                            <span className="text-xs text-[#37AFE1]">
                              {msg.isHuman ? 'Support Agent' : 'AI Assistant'}
                            </span>
                          </div>
                        )}
                        <p className="whitespace-pre-wrap text-sm">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl rounded-bl-md bg-[#1E293B] px-4 py-3">
                        <div className="flex gap-1">
                          <span
                            className="h-2 w-2 animate-bounce rounded-full bg-slate-500"
                            style={{ animationDelay: '0ms' }}
                          />
                          <span
                            className="h-2 w-2 animate-bounce rounded-full bg-slate-500"
                            style={{ animationDelay: '150ms' }}
                          />
                          <span
                            className="h-2 w-2 animate-bounce rounded-full bg-slate-500"
                            style={{ animationDelay: '300ms' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Status Banner */}
                {status === 'waiting' && (
                  <div className="border-t border-[#37AFE1]/30 bg-[#37AFE1]/20 px-4 py-2">
                    <p className="text-center text-xs text-[#37AFE1]">
                      🔔 A team member will join shortly...
                    </p>
                  </div>
                )}

                {/* Input */}
                <form
                  onSubmit={handleSendMessage}
                  className="border-t border-slate-800 p-4"
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 rounded-lg border border-slate-700 bg-[#1E293B] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#37AFE1] focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || isLoading}
                      className="rounded-lg bg-[#F58122] px-4 py-2.5 text-white transition-colors hover:bg-[#e0741d] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
