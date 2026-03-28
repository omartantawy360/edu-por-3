import React, { useState, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, Award } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import NotificationDrawer from '../ui/NotificationDrawer';
import ChatWidget from '../chat/ChatWidget';
import AIAssistant from '../ui/AIAssistant';
import { Bell, Info, Calendar, Rocket, Award as AwardIcon } from 'lucide-react';
import { useApp, COMPETITION_PHASES } from '../../context/AppContext';
import { cn } from '../../utils/cn';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { user } = useAuth();
  const { unreadCount } = useNotification();
  const { competitions = [], students = [] } = useApp();

  // Identify the most relevant competition for this user
  const activeCompetition = useMemo(() => {
    if (!user) return null;
    if (user.role === 'admin') {
      // Find the most advanced phase competition
      return competitions.find(c => c.phase !== COMPETITION_PHASES.ARCHIVED) || competitions[0];
    }
    // Find competition the student is registered for
    const registration = students.find(s => s.name === user.name);
    if (registration) {
      return competitions.find(c => c.name === registration.competition);
    }
    // Default to the first non-draft competition if nothing found
    return competitions.find(c => c.phase !== COMPETITION_PHASES.DRAFT) || competitions[0];
  }, [user, competitions, students]);

  const phaseConfig = {
    [COMPETITION_PHASES.DRAFT]: { color: 'bg-slate-500', icon: Info, label: 'Preparation' },
    [COMPETITION_PHASES.REGISTRATION_OPEN]: { color: 'bg-blue-500', icon: Calendar, label: 'Registration Live' },
    [COMPETITION_PHASES.REGISTRATION_CLOSED]: { color: 'bg-indigo-500', icon: Lock, label: 'Registration Closed' },
    [COMPETITION_PHASES.EVALUATION]: { color: 'bg-amber-500', icon: Bell, label: 'Judging Ongoing' },
    [COMPETITION_PHASES.PEER_REVIEW]: { color: 'bg-purple-500', icon: Bell, label: 'Peer Review Phase' },
    [COMPETITION_PHASES.RESULTS_READY]: { color: 'bg-emerald-500', icon: Rocket, label: 'Results Pending' },
    [COMPETITION_PHASES.RESULTS_PUBLISHED]: { color: 'bg-emerald-600', icon: AwardIcon, label: 'Final Results Out' },
    [COMPETITION_PHASES.ARCHIVED]: { color: 'bg-slate-700', icon: Info, label: 'Archived' },
  };

  const currentPhase = activeCompetition ? phaseConfig[activeCompetition.phase] || phaseConfig[COMPETITION_PHASES.DRAFT] : null;

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

        {/* Competition Phase Banner */}
        {activeCompetition && currentPhase && (
          <div className="px-4 md:px-6 lg:px-8 mt-4 animate-fade-down no-print">
            <div className={cn(
              "flex items-center justify-between p-3 rounded-2xl border backdrop-blur-md shadow-sm",
              "bg-white/40 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60"
            )}>
              <div className="flex items-center gap-4">
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-sm", currentPhase.color)}>
                  <currentPhase.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Current Phase</span>
                    <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", currentPhase.color)}></span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{activeCompetition.name}</h4>
                </div>
              </div>
              
              <div className="hidden sm:flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
                  <p className="text-sm font-black text-slate-700 dark:text-slate-300">{currentPhase.label}</p>
                </div>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
                <div className="text-right pr-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deadline</p>
                  <p className="text-sm font-black text-rose-500">{activeCompetition.endDate || 'TBA'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

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
