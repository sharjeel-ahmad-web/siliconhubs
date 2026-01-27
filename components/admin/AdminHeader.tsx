'use client';

import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import {
  Bell,
  LogOut,
  Search,
  MessageSquare,
  UserPlus,
  FileText,
  Check,
  X,
} from 'lucide-react';

interface AdminHeaderProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

interface Notification {
  id: string;
  type: 'contact' | 'user' | 'content' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'contact',
    title: 'New Contact Submission',
    message: 'John Doe submitted a contact form',
    time: '5 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'user',
    title: 'New User Registration',
    message: 'Sarah Wilson joined as an editor',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    type: 'content',
    title: 'Content Updated',
    message: 'Homepage hero section was modified',
    time: '2 hours ago',
    read: true,
  },
  {
    id: '4',
    type: 'system',
    title: 'System Update',
    message: 'Database backup completed successfully',
    time: '1 day ago',
    read: true,
  },
];

export default function AdminHeader({ user }: AdminHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'contact':
        return <MessageSquare className="h-4 w-4 text-[#37AFE1]" />;
      case 'user':
        return <UserPlus className="h-4 w-4 text-green-400" />;
      case 'content':
        return <FileText className="h-4 w-4 text-[#F58122]" />;
      default:
        return <Bell className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <header className="flex h-[73px] items-center border-b border-slate-700 bg-[#1E293B] px-6 py-4">
      <div className="flex w-full items-center justify-between">
        {/* Search */}
        <div className="max-w-md flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-lg border border-slate-700 bg-[#0F172A] py-2 pl-10 pr-4 text-white placeholder-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#37AFE1]"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-slate-700 bg-[#1E293B] shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-700 p-4">
                  <h3 className="font-semibold text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-[#37AFE1] transition-colors hover:text-[#37AFE1]/80"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="mx-auto mb-2 h-8 w-8 text-slate-600" />
                      <p className="text-sm text-slate-400">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`border-b border-slate-700/50 p-4 transition-colors hover:bg-slate-700/30 ${
                          !notification.read ? 'bg-slate-700/20' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="rounded-lg bg-slate-700/50 p-2">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="truncate text-sm font-medium text-white">
                                {notification.title}
                              </p>
                              <div className="flex items-center gap-1">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-1 text-slate-400 transition-colors hover:text-green-400"
                                    title="Mark as read"
                                  >
                                    <Check className="h-3 w-3" />
                                  </button>
                                )}
                                <button
                                  onClick={() =>
                                    removeNotification(notification.id)
                                  }
                                  className="p-1 text-slate-400 transition-colors hover:text-red-400"
                                  title="Remove"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                            <p className="mt-0.5 truncate text-xs text-slate-400">
                              {notification.message}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-slate-700 p-3">
                  <button className="w-full py-2 text-center text-sm text-[#37AFE1] transition-colors hover:text-[#37AFE1]/80">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sign Out */}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center space-x-2 rounded-lg px-4 py-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
