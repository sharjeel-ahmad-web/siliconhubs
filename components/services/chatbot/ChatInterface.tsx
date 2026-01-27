'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

interface ChatInterfaceProps {
  initialMessage?: string;
  inputPlaceholder?: string;
  sendButtonText?: string;
  typingIndicatorText?: string;
  aiResponses?: string[];
  userMessageColor?: string;
  aiMessageColor?: string;
}

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

// Default values
const defaultAiResponses = [
  "That's a great question! Let me help you with that.",
  "I understand. Here's what I can tell you...",
  'Interesting! Based on my analysis...',
  "I'd be happy to assist you with that.",
  'Let me process that information for you.',
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  initialMessage = "Hello! I'm an AI assistant. How can I help you today?",
  inputPlaceholder = 'Type your message...',
  sendButtonText = 'Send',
  typingIndicatorText = 'AI is typing...',
  aiResponses = defaultAiResponses,
  userMessageColor = '#2563EB',
  aiMessageColor = '#37AFE1',
}) => {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setMounted(true);
    setMessages([
      {
        id: '1',
        text: initialMessage,
        sender: 'ai',
        timestamp: Date.now(),
      },
    ]);
  }, [initialMessage]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      setParticles((prev) => {
        const updated = prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.02,
          }))
          .filter((p) => p.life > 0);

        updated.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(139, 92, 246, ${p.life})`;
          ctx.fill();
        });

        return updated;
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  const emitParticles = (x: number, y: number) => {
    const newParticles: Particle[] = [];
    const count = 8 + Math.random() * 7;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 2;
      newParticles.push({
        id: `${Date.now()}-${i}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      emitParticles(rect.width - 50, rect.height - 30);
    }

    setTimeout(
      () => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
          sender: 'ai',
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);

        if (canvasRef.current) {
          const rect = canvasRef.current.getBoundingClientRect();
          emitParticles(50, rect.height - 100);
        }
      },
      1500 + Math.random() * 1000
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!mounted) {
    return (
      <div className="relative flex h-[600px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-[#64748B]/20 bg-[#0F172A]">
        <div className="text-[#64748B]">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="relative flex h-[600px] w-full flex-col overflow-hidden rounded-lg border border-[#64748B]/20 bg-[#0F172A]">
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0"
        width={800}
        height={600}
      />

      <div
        ref={messagesContainerRef}
        className="flex-1 space-y-4 overflow-y-auto p-6"
      >
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{
                opacity: 0,
                x: message.sender === 'user' ? 50 : -50,
                scale: 0.8,
              }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: 'spring',
                mass: 0.8,
                tension: 170,
                friction: 26,
              }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-4 ${
                  message.sender === 'user' ? 'text-white' : 'text-white'
                }`}
                style={{
                  backgroundColor:
                    message.sender === 'user'
                      ? userMessageColor
                      : aiMessageColor,
                }}
              >
                <p className="text-sm md:text-base">{message.text}</p>
                <p className="mt-2 text-xs opacity-70">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex justify-start"
            >
              <div
                className="flex items-center space-x-2 rounded-lg p-4 text-white"
                style={{ backgroundColor: aiMessageColor }}
              >
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="h-2 w-2 rounded-full bg-white"
                      animate={{
                        y: [0, -8, 0],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm">{typingIndicatorText}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-[#64748B]/20 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={inputPlaceholder}
            className="flex-1 rounded-lg border border-[#64748B]/20 bg-[#1E293B] px-4 py-3 text-white transition-all focus:border-[#37AFE1] focus:outline-none focus:ring-2 focus:ring-[#37AFE1]/20"
          />
          <motion.button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-lg px-6 py-3 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: userMessageColor }}
          >
            {sendButtonText}
          </motion.button>
        </div>
      </div>
    </div>
  );
};
