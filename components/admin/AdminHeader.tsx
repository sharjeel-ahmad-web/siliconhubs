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
    message: 'Sharjeel Ahmad Khan submitted a contact form',
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
        return <MessageSquare className="h-4 w-4 text-[#F4511E]" />;

      case 'user':
        return <UserPlus className="h-4 w-4 text-[#15803D]" />;

      case 'content':
        return <FileText className="h-4 w-4 text-[#D97706]" />;

      default:
        return <Bell className="h-4 w-4 text-[#515161]" />;
    }
  };

  return (
    <header
      className="
        flex
        h-[73px]
        items-center
        border-b
        border-[#E8D8C5]
        bg-[#FFF4E6]
        px-6
        py-4
      "
    >
      <div className="flex w-full items-center justify-between">
        {/* Search */}
        <div className="max-w-md flex-1">
          <div className="relative">
            <Search
              className="
                absolute
                left-3
                top-1/2
                h-5
                w-5
                -translate-y-1/2
                text-[#515161]
              "
            />

            <input
              type="text"
              placeholder="Search..."
              className="
                w-full
                rounded-xl
                border
                border-[#E8D8C5]
                bg-[#FFFFFF]
                py-2.5
                pl-10
                pr-4
                text-[#14213D]
                placeholder-[#8A8580]
                shadow-sm
                outline-none
                transition-all
                duration-200
                focus:border-[#F4511E]
                focus:ring-2
                focus:ring-[#F4511E]/20
              "
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="
                admin-icon-button
                relative
                rounded-xl
                p-2.5
                text-[#515161]
                transition-all
                duration-200
                hover:bg-[#FFEDD7]
                hover:text-[#F4511E]
              "
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />

              {unreadCount > 0 && (
                <span
                  className="
                    absolute
                    right-1
                    top-1
                    flex
                    h-4
                    w-4
                    items-center
                    justify-center
                    rounded-full
                    bg-[#F4511E]
                    text-[10px]
                    font-bold
                    text-white
                    shadow-sm
                  "
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div
                className="
                  absolute
                  right-0
                  z-50
                  mt-3
                  w-80
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[#E8D8C5]
                  bg-[#FFFFFF]
                  shadow-2xl
                  shadow-[#14213D]/10
                "
              >
                {/* Dropdown Header */}
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-[#E8D8C5]
                    bg-[#FFF4E6]
                    p-4
                  "
                >
                  <h3 className="font-bold text-[#14213D]">Notifications</h3>

                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="
                        text-xs
                        font-semibold
                        text-[#F4511E]
                        transition-colors
                        hover:text-[#D84315]
                      "
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <div
                        className="
                          mx-auto
                          mb-3
                          flex
                          h-12
                          w-12
                          items-center
                          justify-center
                          rounded-full
                          bg-[#FFEDD7]
                        "
                      >
                        <Bell className="h-6 w-6 text-[#F4511E]" />
                      </div>

                      <p className="text-sm text-[#515161]">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`
                          border-b
                          border-[#E8D8C5]
                          p-4
                          transition-colors
                          duration-200
                          hover:bg-[#FFF4E6]
                          ${!notification.read ? 'bg-[#FFEDD7]/50' : ''}
                        `}
                      >
                        <div className="flex items-start gap-3">
                          {/* Notification Icon */}
                          <div
                            className="
                              flex
                              h-9
                              w-9
                              flex-shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              bg-[#F7E3C6]
                            "
                          >
                            {getNotificationIcon(notification.type)}
                          </div>

                          {/* Notification Content */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p
                                className="
                                  truncate
                                  text-sm
                                  font-semibold
                                  text-[#14213D]
                                "
                              >
                                {notification.title}
                              </p>

                              <div className="flex items-center gap-1">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="
                                      rounded-md
                                      p-1
                                      text-[#515161]
                                      transition-colors
                                      hover:bg-[#DCFCE7]
                                      hover:text-[#15803D]
                                    "
                                    title="Mark as read"
                                  >
                                    <Check className="h-3 w-3" />
                                  </button>
                                )}

                                <button
                                  onClick={() =>
                                    removeNotification(notification.id)
                                  }
                                  className="
                                    rounded-md
                                    p-1
                                    text-[#515161]
                                    transition-colors
                                    hover:bg-[#FEE2E2]
                                    hover:text-[#B91C1C]
                                  "
                                  title="Remove"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            </div>

                            <p
                              className="
                                mt-1
                                truncate
                                text-xs
                                text-[#515161]
                              "
                            >
                              {notification.message}
                            </p>

                            <p
                              className="
                                mt-1.5
                                text-xs
                                font-medium
                                text-[#8A8580]
                              "
                            >
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* View All */}
                <div
                  className="
                    border-t
                    border-[#E8D8C5]
                    bg-[#FFF4E6]
                    p-3
                  "
                >
                  <button
                    className="
                      w-full
                      rounded-lg
                      py-2
                      text-center
                      text-sm
                      font-semibold
                      text-[#F4511E]
                      transition-all
                      duration-200
                      hover:bg-[#FFEDD7]
                      hover:text-[#D84315]
                    "
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sign Out */}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="
              flex
              items-center
              space-x-2
              rounded-xl
              border
              border-transparent
              px-4
              py-2.5
              text-[#515161]
              transition-all
              duration-200
              hover:border-[#F4511E]/20
              hover:bg-[#FFEDD7]
              hover:text-[#F4511E]
            "
          >
            <LogOut className="h-5 w-5" />

            <span className="font-semibold">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
