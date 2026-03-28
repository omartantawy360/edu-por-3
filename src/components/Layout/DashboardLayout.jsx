import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, Award } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import NotificationDrawer from '../ui/NotificationDrawer';
import ChatWidget from '../chat/ChatWidget';
import AIAssistant from '../ui/AIAssistant';
import { Bell } from 'lucide-react';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { user } = useAuth();
  const { unreadCount } = useNotification();

  return (
    <div className="flex h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-white to-fuchsia-50/30 dark:from-violet-950/20 dark:via-slate-900 dark:to-fuchsia-950/10 pointer-events-none z-0"></div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 relative z-10 box-border">
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Award className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">EduComp</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsNotificationOpen(true)}
              className="relative h-10 w-10 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-rose-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[9px] font-bold text-white shadow-sm">
                   {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-6 w-6 text-slate-600 dark:text-slate-300" />
            </Button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto pb-20 md:pb-10">
            <Outlet />
          </div>
        </main>
      </div>

      {/* AI Assistant for Students */}
      {user?.role === 'student' && <AIAssistant />}

      {/* Chat Widget for Students */}
      {user?.role === 'student' && <ChatWidget />}

      <NotificationDrawer 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />
    </div>
  );
};

export default DashboardLayout;
