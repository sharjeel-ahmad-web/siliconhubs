'use client';

import { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  User,
  Bot,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  RefreshCw,
} from 'lucide-react';

interface Conversation {
  id: string;
  visitorName: string;
  visitorEmail: string;
  status: 'ai' | 'waiting' | 'human' | 'resolved';
  messageCount: number;
  lastMessage: string;
  lastMessageTime: string;
  createdAt: string;
}

const statusConfig = {
  ai: {
    label: 'AI Handling',
    color: 'bg-blue-500/20 text-blue-400',
    icon: Bot,
  },
  waiting: {
    label: 'Waiting',
    color: 'bg-yellow-500/20 text-yellow-400',
    icon: AlertCircle,
  },
  human: {
    label: 'Human Agent',
    color: 'bg-green-500/20 text-green-400',
    icon: User,
  },
  resolved: {
    label: 'Resolved',
    color: 'bg-slate-500/20 text-slate-400',
    icon: CheckCircle,
  },
};

export default function LiveChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [hasNewWaiting, setHasNewWaiting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousWaitingCount = useRef(0);

  useEffect(() => {
    // Create audio element for notification sound
    audioRef.current = new Audio('/notification.mp3');
    fetchConversations();

    // Poll for new conversations every 5 seconds
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`/api/admin/chat?status=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data);

        // Check for new waiting conversations and play sound
        const waitingCount = data.filter(
          (c: Conversation) => c.status === 'waiting'
        ).length;
        if (
          waitingCount > previousWaitingCount.current &&
          previousWaitingCount.current > 0
        ) {
          setHasNewWaiting(true);
          audioRef.current?.play().catch(() => {});
        }
        previousWaitingCount.current = waitingCount;
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    try {
      const res = await fetch(`/api/admin/chat/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setConversations((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/chat/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchConversations();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const waitingCount = conversations.filter(
    (c) => c.status === 'waiting'
  ).length;

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
            <MessageCircle className="h-8 w-8 text-[#fc4c00]" />
            Live Chat
            {waitingCount > 0 && (
              <span className="animate-pulse rounded-full bg-yellow-500/20 px-2 py-1 text-sm text-yellow-400">
                {waitingCount} waiting
              </span>
            )}
          </h1>
          <p className="mt-1 text-slate-400">Manage customer conversations</p>
        </div>
        <button
          onClick={fetchConversations}
          className="flex items-center gap-2 rounded-lg bg-[#1E293B] px-4 py-2 text-slate-300 transition-colors hover:bg-slate-700"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        {['all', 'waiting', 'ai', 'human', 'resolved'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-lg px-4 py-2 font-medium capitalize transition-colors ${
              filter === status
                ? 'bg-[#fc4c00] text-white'
                : 'bg-[#1E293B] text-slate-300 hover:bg-slate-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Conversations List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#06b6d4]/30 border-t-[#06b6d4]" />
        </div>
      ) : conversations.length === 0 ? (
        <div className="py-20 text-center">
          <MessageCircle className="mx-auto mb-4 h-16 w-16 text-slate-600" />
          <h3 className="text-xl text-slate-400">No conversations yet</h3>
          <p className="mt-2 text-slate-500">
            Conversations will appear here when visitors start chatting
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv) => {
            const StatusIcon = statusConfig[conv.status].icon;
            return (
              <div
                key={conv.id}
                className={`rounded-xl border bg-[#1E293B] p-4 transition-all hover:border-[#06b6d4]/50 ${
                  conv.status === 'waiting'
                    ? 'border-yellow-500/50'
                    : 'border-slate-700/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F172A] text-lg font-semibold text-[#fc4c00]">
                      {conv.visitorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-white">
                          {conv.visitorName}
                        </h3>
                        <span
                          className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${statusConfig[conv.status].color}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig[conv.status].label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">
                        {conv.visitorEmail}
                      </p>
                      <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        {formatTime(conv.lastMessageTime)}
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        {conv.messageCount} messages
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={conv?.id ? `/admin/live-chat/${conv.id}` : '#'}
                        className="rounded-lg bg-[#fc4c00] px-3 py-1.5 text-sm text-white transition-colors hover:bg-[#e0741d]"
                      >
                        {conv.status === 'waiting' ? 'Reply' : 'View'}
                      </a>
                      {conv.status !== 'resolved' && (
                        <button
                          onClick={() =>
                            handleStatusChange(conv.id, 'resolved')
                          }
                          className="rounded-lg p-1.5 text-green-400 transition-colors hover:bg-green-500/20"
                          title="Mark as resolved"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(conv.id)}
                        className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-500/20"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
