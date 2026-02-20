import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTeam } from '../../context/TeamContext';
import { useChat } from '../../context/ChatContext';
import { LayoutDashboard, LogOut, FileText, Settings, Award, Users, Target, Upload, Trophy, Medal, Lightbulb, Shield, ChevronDown, ChevronRight, MessageCircle, Moon, Sun } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import { ThemeToggle } from '../ThemeToggle';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { userTeams, getMyTeamRequests } = useTeam();
  const { getUnreadCount } = useChat();
  const navigate = useNavigate();
  const [teamsExpanded, setTeamsExpanded] = useState(true);

  const teamRequests = getMyTeamRequests ? getMyTeamRequests() : [];
  const unreadMessages = getUnreadCount ? getUnreadCount() : 0;

  const links = user?.role === 'admin'
    ? [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { name: 'Messages', path: '/admin/messages', icon: MessageCircle, badge: unreadMessages },
      { name: 'Teams', path: '/admin/teams', icon: Users },
      { name: 'Students', path: '/admin/students', icon: Target },
      { name: 'Submissions', path: '/admin/submissions', icon: Upload },
      { name: 'Certificates', path: '/admin/certificates', icon: Award },
      { name: 'Add Competition', path: '/admin/create-competition', icon: Settings },
    ]
    : [
      { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
      { name: 'Browse Teams', path: '/student/teams', icon: Users },
      { name: 'Competition Skills', path: '/student/skills', icon: Target },
      { name: 'Submissions', path: '/student/submissions', icon: Upload },
      { name: 'Achievements', path: '/student/achievements', icon: Medal },
      { name: 'Leaderboard', path: '/student/leaderboard', icon: Trophy },
      { name: 'Certificate', path: '/student/certificate', icon: Award },
      { name: 'Find Competitions', path: '/student/recommendations', icon: Lightbulb },
      { name: 'Register', path: '/register', icon: FileText },
    ];

  if (!user) return null;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col transition-all duration-300 ease-in-out md:static md:translate-x-0 md:z-0 border-r border-white/20 shadow-2xl md:shadow-none",
        "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo Section */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-slate-100/50 dark:border-slate-800/50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30">
              <Award className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
              EduComp
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden" onClick={onClose}>
              <LogOut className="h-4 w-4 rotate-180" />
            </Button>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex flex-1 flex-col overflow-y-auto py-6 sidebar-scroll">
          <nav className="flex-1 space-y-1.5 px-4">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose}
                end={link.path === '/student' || link.path === '/admin'}
                className={({ isActive }) => cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                  "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100",
                  isActive && "bg-gradient-to-r from-violet-500/[0.08] to-purple-500/[0.08] text-violet-700 dark:text-violet-300 shadow-sm ring-1 ring-violet-500/20"
                )}
              >
                {({ isActive }) => (
                  <>
                    <link.icon className={cn(
                      "h-5 w-5 shrink-0 transition-colors duration-300",
                      isActive ? "text-violet-600 dark:text-violet-400" : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                    )} />
                    <span className="flex-1">{link.name}</span>
                    {link.badge > 0 && (
                      <span className="h-5 w-5 rounded-full bg-violet-600 text-white text-[10px] flex items-center justify-center font-bold shadow-md shadow-violet-500/30">
                        {link.badge}
                      </span>
                    )}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-violet-600 rounded-r-full shadow-[0_0_12px_rgba(124,58,237,0.5)]"></div>
                    )}
                  </>
                )}
              </NavLink>
            ))}

            {/* My Teams Section - Only for students */}
            {user?.role === 'student' && userTeams && userTeams.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-100/50 dark:border-slate-800/50">
                <button
                  onClick={() => setTeamsExpanded(!teamsExpanded)}
                  className="flex items-center justify-between w-full px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors mb-2"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5" />
                    My Teams
                  </div>
                  <div className="flex items-center gap-2">
                    {teamRequests.length > 0 && (
                      <span className="h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                        {teamRequests.length}
                      </span>
                    )}
                    {teamsExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  </div>
                </button>

                <div className={cn("space-y-1 overflow-hidden transition-all duration-300", teamsExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
                  {userTeams && userTeams.map((team) => (
                    <button
                      key={team.id}
                      onClick={() => {
                        navigate(`/student/team/${team.id}`);
                        if (onClose) onClose();
                      }}
                      className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-left group mx-1"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold shrink-0 shadow-sm group-hover:border-violet-300 dark:group-hover:border-violet-700 transition-colors">
                          <span className="bg-clip-text text-transparent bg-gradient-to-br from-violet-600 to-purple-600">
                            {team.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 truncate transition-colors">
                          {team.name}
                        </span>
                      </div>
                      {team.members.length > 0 && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-violet-600 group-hover:bg-violet-50 dark:group-hover:bg-violet-900/30 transition-colors">
                          {team.members.length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* User Profile Section */}
          <div className="p-4 mt-auto">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 mb-2">
              <button
                type="button"
                onClick={() => {
                  const accountPath = user.role === 'admin' ? '/admin/account' : '/student/account';
                  navigate(accountPath);
                  if (onClose) onClose();
                }}
                className="flex w-full items-center gap-3 mb-3 group"
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 p-[1px] shadow-sm group-hover:shadow-md transition-all">
                  <div className="h-full w-full rounded-[11px] bg-white dark:bg-slate-900 flex items-center justify-center">
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-br from-violet-500 to-purple-600">
                      {user?.name?.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="min-w-0 text-left flex-1">
                  <p className="text-sm font-bold truncate text-slate-900 dark:text-slate-100 group-hover:text-violet-600 transition-colors">{user?.name}</p>
                  <p className="text-xs capitalize text-slate-500 dark:text-slate-400">{user?.role}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-violet-500 transition-colors" />
              </button>
              <Button
                variant="ghost"
                className="w-full justify-center gap-2 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 dark:nav-hover-red h-9 text-xs font-semibold"
                onClick={logout}
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
