import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import {
  BookOpen, ClipboardList, Layers, Megaphone, Trophy,
  ChevronDown, ChevronUp, Pin, Calendar, Clock, Edit2, Trash2,
  Medal, UserCheck, ExternalLink
} from 'lucide-react';

// ── Post type config ────────────────────────────────────────
const POST_TYPE_CONFIG = {
  Introduction: {
    icon: BookOpen,
    label: 'Introduction',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    border: 'border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500',
    emoji: '📘',
  },
  Registration: {
    icon: ClipboardList,
    label: 'Registration',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/30',
    border: 'border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500',
    emoji: '📝',
  },
  Stage: {
    icon: Layers,
    label: 'Stage',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-900/30',
    border: 'border-violet-200 dark:border-violet-800',
    dot: 'bg-violet-500',
    emoji: '🧩',
  },
  Announcement: {
    icon: Megaphone,
    label: 'Announcement',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    border: 'border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
    emoji: '📢',
  },
  Result: {
    icon: Trophy,
    label: 'Result',
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-900/30',
    border: 'border-yellow-200 dark:border-yellow-800',
    dot: 'bg-yellow-500',
    emoji: '🏆',
  },
};

const MEDAL_CONFIG = {
  1: { icon: '🥇', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-700' },
  2: { icon: '🥈', color: 'text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800/40', border: 'border-slate-200 dark:border-slate-700' },
  3: { icon: '🥉', color: 'text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-700' },
};

// Simple markdown-ish renderer (bold + bullets only)
const SimpleMarkdown = ({ text }) => {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const isBullet = line.startsWith('- ');
        const content = isBullet ? line.slice(2) : line;
        // Bold **text**
        const parts = content.split(/\*\*(.*?)\*\*/g);
        const rendered = parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j} className="font-semibold">{part}</strong> : part
        );
        if (isBullet) return (
          <div key={i} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-current shrink-0 opacity-60" />
            <span>{rendered}</span>
          </div>
        );
        if (!content.trim()) return <div key={i} className="h-1" />;
        return <p key={i}>{rendered}</p>;
      })}
    </div>
  );
};

// ── Main PostCard component ───────────────────────────────────
const PostCard = ({
  post,
  competitionId,
  isAdmin = false,
  onEdit,
  onDelete,
  onRegister,
  defaultExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const navigate = useNavigate();

  const config = POST_TYPE_CONFIG[post.type] || POST_TYPE_CONFIG.Announcement;
  const Icon = config.icon;

  // Registration deadline auto-detect
  const isRegistrationClosed = post.type === 'Registration' && post.registrationDeadline
    ? new Date(post.registrationDeadline) < new Date()
    : post.registrationStatus === 'Closed';

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className={cn(
      'relative group rounded-2xl border bg-white dark:bg-slate-900 shadow-sm transition-all duration-300',
      'hover:shadow-lg hover:-translate-y-0.5',
      config.border,
      post.isPinned && 'ring-2 ring-violet-300 dark:ring-violet-700/60',
    )}>
      {/* Pinned banner */}
      {post.isPinned && (
        <div className="absolute -top-2.5 left-4 flex items-center gap-1 px-3 py-0.5 rounded-full bg-violet-600 text-white text-[10px] font-bold uppercase tracking-wider shadow">
          <Pin size={9} /> Pinned
        </div>
      )}

      {/* Draft banner */}
      {post.status === 'draft' && (
        <div className="absolute -top-2.5 right-4 flex items-center gap-1 px-3 py-0.5 rounded-full bg-slate-400 text-white text-[10px] font-bold uppercase tracking-wider shadow">
          Draft
        </div>
      )}

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={cn('shrink-0 h-10 w-10 rounded-xl flex items-center justify-center text-xl shadow-sm', config.bg)}>
            {config.emoji}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                {/* Type badge */}
                <span className={cn('inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider mb-1', config.color)}>
                  <Icon size={11} /> {config.label}
                </span>
                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-50 leading-snug">
                  {post.title}
                </h3>
                {/* Date */}
                <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-1">
                  <Calendar size={11} /> {formatDate(post.date)}
                </p>
              </div>

              {/* Right side: admin actions + expand toggle */}
              <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                {isAdmin && (
                  <>
                    <button
                      onClick={() => onEdit && onEdit(post)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                      title="Edit post"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(post.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                      title="Delete post"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
                <button
                  onClick={() => setExpanded(e => !e)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title={expanded ? 'Collapse' : 'Expand'}
                >
                  {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stage date range */}
        {post.type === 'Stage' && post.stageStartDate && (
          <div className="mt-3 ml-14 flex items-center gap-2 text-xs text-violet-600 dark:text-violet-400 font-medium">
            <Clock size={11} />
            {formatDate(post.stageStartDate)} → {formatDate(post.stageEndDate)}
          </div>
        )}

        {/* Registration status pill */}
        {post.type === 'Registration' && (
          <div className="mt-3 ml-14 flex items-center gap-3 flex-wrap">
            <span className={cn(
              'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border',
              isRegistrationClosed
                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
                : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
            )}>
              <UserCheck size={10} />
              Registration {isRegistrationClosed ? 'Closed' : 'Open'}
            </span>
            {post.registrationDeadline && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar size={10} /> Deadline: {formatDate(post.registrationDeadline)}
              </span>
            )}
          </div>
        )}

        {/* Expanded content */}
        {expanded && (
          <div className="mt-4 ml-14 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Description */}
            <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <SimpleMarkdown text={post.description} />
            </div>

            {/* Result Winners */}
            {post.type === 'Result' && post.winners && post.winners.length > 0 && (
              <div className="mt-5 space-y-2">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Trophy size={11} /> Rankings
                </h4>
                <div className="space-y-2">
                  {post.winners.map(w => {
                    const medal = MEDAL_CONFIG[w.rank] || MEDAL_CONFIG[3];
                    return (
                      <div key={w.rank} className={cn(
                        'flex items-center gap-3 p-3 rounded-xl border text-sm font-medium',
                        medal.bg, medal.border
                      )}>
                        <span className="text-2xl leading-none">{medal.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 dark:text-slate-100">{w.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{w.project}</p>
                        </div>
                        <span className="text-xs font-semibold text-slate-400 shrink-0">{w.teamName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Registration CTA */}
            {post.type === 'Registration' && !isAdmin && (
              <div className="mt-5">
                <button
                  disabled={isRegistrationClosed}
                  onClick={() => onRegister ? onRegister() : navigate('/register')}
                  className={cn(
                    'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm',
                    isRegistrationClosed
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                  )}
                >
                  <ExternalLink size={14} />
                  {isRegistrationClosed ? 'Registration Closed' : 'Register Now'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export { POST_TYPE_CONFIG };
export default PostCard;
