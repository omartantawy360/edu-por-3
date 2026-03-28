import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { X, Bell, CheckCircle, AlertCircle, Info, RefreshCcw, Trash2 } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';
import { formatDistanceToNow } from 'date-fns';

const NotificationDrawer = ({ isOpen, onClose }) => {
  const { notifications, markAsRead, markAllAsRead, clearNotifications, unreadCount } = useNotification();

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'error': return <X className="h-4 w-4 text-rose-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={cn(
        "fixed inset-y-0 right-0 z-[70] w-full max-w-sm transform transition-transform duration-500 ease-out flex flex-col",
        "bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-l border-white/20 shadow-2xl",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-slate-200/50 dark:border-slate-800/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">Notifications</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {unreadCount > 0 ? `You have ${unreadCount} unread messages` : 'Up to date'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:rotate-90 transition-transform duration-200">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Actions Bar */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between px-6 py-3 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200/50 dark:border-slate-800/50 shrink-0">
            <button 
              onClick={markAllAsRead}
              className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle className="h-3 w-3" />
              Mark all read
            </button>
            <button 
              onClick={clearNotifications}
              className="text-[10px] font-bold uppercase tracking-wider text-rose-500 hover:text-rose-600 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              Clear all
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 px-4 sidebar-scroll">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
              <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <RefreshCcw className="h-8 w-8 text-slate-400 animate-spin-slow" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">No notifications</h3>
              <p className="text-sm text-slate-500">We'll let you know when something important happens.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div 
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={cn(
                    "group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden",
                    "hover:shadow-lg hover:shadow-violet-500/5",
                    n.read 
                      ? "bg-white/40 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 opacity-70"
                      : "bg-white dark:bg-slate-800/80 border-violet-200/50 dark:border-violet-500/20 ring-1 ring-violet-500/10 shadow-sm"
                  )}
                >
                  {/* Unread indicator */}
                  {!n.read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-500 to-indigo-600" />
                  )}

                  <div className="flex gap-3">
                    <div className={cn(
                      "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 duration-300",
                      n.type === 'success' ? "bg-emerald-100 dark:bg-emerald-900/30" :
                      n.type === 'warning' ? "bg-amber-100 dark:bg-amber-900/30" :
                      n.type === 'error' ? "bg-rose-100 dark:bg-rose-900/30" :
                      "bg-blue-100 dark:bg-blue-900/30"
                    )}>
                      {getTypeIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className={cn(
                          "text-sm font-bold truncate",
                          n.read ? "text-slate-600 dark:text-slate-400" : "text-slate-900 dark:text-white"
                        )}>
                          {n.title}
                        </h4>
                        <span className="text-[10px] whitespace-nowrap text-slate-400 font-medium">
                          {formatDistanceToNow(new Date(n.date), { addSuffix: true })}
                        </span>
                      </div>
                      <p className={cn(
                        "text-xs leading-relaxed line-clamp-2",
                        n.read ? "text-slate-500 dark:text-slate-500" : "text-slate-600 dark:text-slate-400"
                      )}>
                        {n.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-slate-200/50 dark:border-slate-800/50 text-center">
          <Button variant="outline" className="w-full text-xs font-bold rounded-xl h-11" onClick={onClose}>
            Close Drawer
          </Button>
        </div>
      </div>
    </>
  );
};

export default NotificationDrawer;
