import React, { useState } from 'react';
import { Filter, Search, BookOpen, ClipboardList, Layers, Megaphone, Trophy, LayoutList } from 'lucide-react';
import { cn } from '../../utils/cn';
import PostCard from './PostCard';

const TYPE_FILTERS = [
  { key: 'all', label: 'All', icon: LayoutList },
  { key: 'Introduction', label: 'Intro', icon: BookOpen },
  { key: 'Registration', label: 'Register', icon: ClipboardList },
  { key: 'Stage', label: 'Stages', icon: Layers },
  { key: 'Announcement', label: 'Updates', icon: Megaphone },
  { key: 'Result', label: 'Results', icon: Trophy },
];

const DOT_COLORS = {
  Introduction: 'bg-blue-500',
  Registration: 'bg-emerald-500',
  Stage: 'bg-violet-500',
  Announcement: 'bg-amber-500',
  Result: 'bg-yellow-500',
};

const CompetitionTimeline = ({
  posts = [],
  competitionId,
  isAdmin = false,
  onEdit,
  onDelete,
  onRegister,
  emptyMessage = 'No posts yet. Check back soon!',
}) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = posts.filter(post => {
    const matchesType = activeFilter === 'all' || post.type === activeFilter;
    const matchesSearch = !searchQuery.trim() ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Always show published posts (and drafts only to admins)
  const visible = filtered.filter(p => p.status === 'published' || isAdmin);

  return (
    <div className="space-y-5">
      {/* Filter + Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Type pill filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 grow flex-wrap">
          {TYPE_FILTERS.map(({ key, label, icon: FilterIcon }) => {
            const isActive = activeFilter === key;
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap shrink-0',
                  isActive
                    ? 'bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-500/25'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300'
                )}
              >
                <FilterIcon size={11} />
                {label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative shrink-0">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search posts…"
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all w-full sm:w-48 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Timeline */}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <LayoutList size={36} className="mb-3 opacity-40" />
          <p className="text-sm font-medium">{emptyMessage}</p>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical spine */}
          <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-gradient-to-b from-slate-200 via-slate-200 to-transparent dark:from-slate-700 dark:via-slate-700 hidden sm:block" />

          <div className="space-y-4">
            {visible.map((post, idx) => (
              <div key={post.id} className="flex gap-0 sm:gap-4 items-start">
                {/* Timeline dot */}
                <div className="hidden sm:flex shrink-0 flex-col items-center pt-5 z-10">
                  <div className={cn(
                    'h-2.5 w-2.5 rounded-full ring-4 ring-white dark:ring-slate-950 shadow-sm transition-all',
                    DOT_COLORS[post.type] || 'bg-slate-400',
                  )} />
                </div>

                {/* Post card */}
                <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 40}ms` }}>
                  <PostCard
                    post={post}
                    competitionId={competitionId}
                    isAdmin={isAdmin}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onRegister={onRegister}
                    defaultExpanded={post.type === 'Result' || post.isPinned}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results count */}
      {visible.length > 0 && (
        <p className="text-xs text-slate-400 text-center pt-2">
          {visible.length} post{visible.length !== 1 ? 's' : ''} shown
          {activeFilter !== 'all' && ` · filtered by ${activeFilter}`}
        </p>
      )}
    </div>
  );
};

export default CompetitionTimeline;
