import React from "react";
import { X, Bell, ShieldAlert, FileText, CheckCircle, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface Notification {
  id: string;
  type: "critical" | "warning" | "success" | "info";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
}

export default function NotificationDrawer({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onClearAll,
}: NotificationDrawerProps) {
  const handleMarkAllRead = () => {
    notifications.filter(n => !n.read).forEach(n => onMarkRead(n.id));
  };
  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "critical":
        return <ShieldAlert className="h-5 w-5 text-brand-crimson" />;
      case "warning":
        return <ShieldAlert className="h-5 w-5 text-brand-amber" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-brand-emerald" />;
      case "info":
      default:
        return <FileText className="h-5 w-5 text-brand-info" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-brand-border bg-brand-card shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border bg-theme-tint">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-md bg-theme-tint border border-brand-border">
                      <Bell className="h-4.5 w-4.5 text-brand-cyan" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-outfit font-semibold text-base text-brand-text-primary">Notifications</h3>
                      {notifications.some(n => !n.read) && (
                        <span className="bg-brand-crimson text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                          {notifications.filter(n => !n.read).length} new
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {notifications.length > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-sm px-2 py-1 rounded-md bg-theme-tint border border-brand-border text-brand-text-secondary hover:bg-theme-subtle transition-colors"
                        title="Mark all read"
                      >
                        Mark all read
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={onClearAll}
                        className="p-2 hover:bg-theme-tint rounded-md text-brand-text-secondary hover:text-brand-crimson transition-colors cursor-pointer"
                        title="Clear All"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-theme-tint rounded-md text-brand-text-secondary hover:text-brand-text-primary transition-colors cursor-pointer"
                      aria-label="Close notifications"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-brand-text-secondary space-y-2">
                  <Bell className="h-6 w-6 opacity-20" />
                  <p className="text-xs">All quiet. No notifications.</p>
                </div>
              ) : (
                <>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start space-x-3 p-3 rounded-lg transition-all cursor-pointer border bg-brand-card ${notification.read ? "border-brand-border/40" : "ring-1 ring-brand-cyan/10 border-brand-cyan/10"}`}
                    onClick={() => onMarkRead(notification.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="mt-0.5 shrink-0 p-2 rounded-md bg-theme-tint border border-brand-border">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold truncate ${notification.read ? "text-brand-text-primary" : "text-brand-cyan"}`}>
                          {notification.title}
                        </span>
                        <span className="text-[11px] text-brand-text-secondary font-mono shrink-0 ml-2">{notification.time}</span>
                      </div>
                      <p className="text-sm text-brand-text-secondary leading-relaxed break-words">
                        {notification.description}
                      </p>
                    </div>
                  </div>
                ))}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


