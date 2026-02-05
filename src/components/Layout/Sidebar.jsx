import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, LogOut, FileText, Settings, Award, Users, Target, Upload, Trophy, Medal, Lightbulb } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import { ThemeToggle } from '../ThemeToggle';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = user?.role === 'admin'
    ? [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Students', path: '/admin/students', icon: Users },
        { name: 'Submissions', path: '/admin/submissions', icon: Upload },
        { name: 'Certificates', path: '/admin/certificates', icon: Award },
        { name: 'Add Competition', path: '/admin/create-competition', icon: Settings },
      ]
    : [
        { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
        { name: 'Team Hub', path: '/student/team', icon: Users },
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
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col transition-all duration-300 ease-out md:static md:translate-x-0",
        "bg-card/95 dark:bg-card/90 backdrop-blur-xl border-r border-border text-card-foreground shadow-soft-lg",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center justify-between px-5 border-b border-border">
          <span className="text-xl font-bold gradient-text">EduComp</span>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="md:hidden rounded-xl" onClick={onClose}>
              <LogOut className="h-5 w-5 rotate-180" />
            </Button>
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto py-5">
          <nav className="flex-1 space-y-1 px-4">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  "text-card-foreground/80 hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-gradient-to-r from-violet-500/15 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/15 text-primary border-l-2 border-l-primary -ml-0.5 pl-[18px]"
                )}
              >
                <link.icon className="h-5 w-5 shrink-0" />
                {link.name}
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-border p-4 space-y-2">
            <button
              type="button"
              onClick={() => {
                const accountPath = user.role === 'admin' ? '/admin/account' : '/student/account';
                navigate(accountPath);
                if (onClose) onClose();
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
                "hover:bg-accent"
              )}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white text-sm font-bold shadow-sm">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate text-card-foreground">{user.name}</p>
                <p className="text-xs capitalize text-muted-foreground">{user.role}</p>
              </div>
            </button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
