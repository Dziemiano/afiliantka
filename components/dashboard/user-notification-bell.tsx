"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Bell, Check, CheckCheck, X } from "lucide-react";
import Link from "next/link";
import type { UserNotification } from "@/types/notifications";

export function UserNotificationBell() {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const fetchNotifications = async () => {
    const res = await fetch("/api/user/notifications");
    if (res.ok) {
      const data = await res.json();
      setNotifications(data.notifications);
      setUnreadCount(data.unread_count);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, []);

  const closePanel = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, closePanel]);

  const markAsRead = async (id: string) => {
    await fetch("/api/user/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: true }),
    });
    await fetchNotifications();
  };

  const markAllRead = async () => {
    await fetch("/api/user/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    await fetchNotifications();
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(!open)}
        className="relative p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        aria-label="Powiadomienia"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
            aria-hidden="true"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Lista powiadomień"
          className="absolute right-0 top-full mt-2 w-full min-w-[20rem] sm:w-96 bg-white rounded-lg shadow-lg border border-stone-200 z-50 max-h-[70vh] overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200">
            <h3 className="font-semibold text-stone-900 text-sm">
              Powiadomienia
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="text-xs text-brand hover:text-brand-dark flex items-center gap-1 min-h-[44px] px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
                >
                  <CheckCheck className="h-3 w-3" aria-hidden="true" />
                  Oznacz wszystkie
                </button>
              )}
              <button
                type="button"
                onClick={closePanel}
                className="text-stone-400 hover:text-stone-600 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
                aria-label="Zamknij powiadomienia"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-stone-500">
                Brak powiadomień
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  role="menuitem"
                  className={`px-4 py-3 border-b border-stone-100 last:border-b-0 ${
                    n.read ? "bg-white" : "bg-brand-light/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${n.read ? "text-stone-700" : "font-medium text-stone-900"}`}
                      >
                        {n.title}
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {n.message}
                      </p>
                      {n.link && (
                        <Link
                          href={n.link}
                          onClick={() => {
                            if (!n.read) markAsRead(n.id);
                            setOpen(false);
                          }}
                          className="text-xs text-brand hover:text-brand-dark mt-1 inline-block min-h-[44px] flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded px-1 -ml-1"
                        >
                          Zobacz szczegóły →
                        </Link>
                      )}
                      <p className="text-xs text-stone-400 mt-1">
                        {new Date(n.created_at).toLocaleDateString("pl-PL", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {!n.read && (
                      <button
                        type="button"
                        onClick={() => markAsRead(n.id)}
                        className="text-stone-400 hover:text-green-600 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
                        aria-label="Oznacz jako przeczytane"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
