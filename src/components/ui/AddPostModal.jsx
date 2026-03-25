import React, { useState, useEffect } from 'react';
import { X, Pin, BookOpen, ClipboardList, Layers, Megaphone, Trophy, Plus, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

const POST_TYPES = ['Introduction', 'Registration', 'Stage', 'Announcement', 'Result'];

const TYPE_ICONS = {
  Introduction: { icon: BookOpen, emoji: '📘' },
  Registration: { icon: ClipboardList, emoji: '📝' },
  Stage: { icon: Layers, emoji: '🧩' },
  Announcement: { icon: Megaphone, emoji: '📢' },
  Result: { icon: Trophy, emoji: '🏆' },
};

const inputCls = 'w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all placeholder:text-slate-400 text-sm';
const labelCls = 'block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5';

const EMPTY_FORM = {
  type: 'Announcement',
  title: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  status: 'published',
  isPinned: false,
  // Registration fields
  registrationStatus: 'Open',
  registrationDeadline: '',
  // Stage fields
  stageStartDate: '',
  stageEndDate: '',
  // Result fields
  winners: [
    { rank: 1, name: '', teamName: '', project: '' },
    { rank: 2, name: '', teamName: '', project: '' },
    { rank: 3, name: '', teamName: '', project: '' },
  ],
};

const AddPostModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [form, setForm] = useState(EMPTY_FORM);

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        ...EMPTY_FORM,
        ...initialData,
        winners: initialData.winners?.length
          ? [...initialData.winners]
          : EMPTY_FORM.winners,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const updateWinner = (rank, field, value) => {
    setForm(prev => ({
      ...prev,
      winners: prev.winners.map(w => w.rank === rank ? { ...w, [field]: value } : w),
    }));
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    const payload = { ...form };
    // Only keep relevant extra fields per type
    if (form.type !== 'Registration') {
      delete payload.registrationStatus;
      delete payload.registrationDeadline;
    }
    if (form.type !== 'Stage') {
      delete payload.stageStartDate;
      delete payload.stageEndDate;
    }
    if (form.type !== 'Result') {
      delete payload.winners;
    } else {
      payload.winners = form.winners.filter(w => w.name.trim());
    }
    onSave(payload);
    onClose();
  };

  const isEditing = !!initialData;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
              {isEditing ? 'Edit Post' : 'Add New Post'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isEditing ? 'Update this timeline entry' : 'Add a new entry to the competition timeline'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Post Type */}
          <div>
            <label className={labelCls}>Post Type</label>
            <div className="grid grid-cols-5 gap-2">
              {POST_TYPES.map(type => {
                const { emoji } = TYPE_ICONS[type];
                const isActive = form.type === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => set('type', type)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-bold transition-all',
                      isActive
                        ? 'bg-violet-50 dark:bg-violet-900/40 border-violet-400 dark:border-violet-600 text-violet-700 dark:text-violet-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300 dark:hover:border-slate-600'
                    )}
                  >
                    <span className="text-lg">{emoji}</span>
                    <span className="hidden sm:block text-center leading-tight">{type}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className={labelCls}>Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              className={inputCls}
              placeholder="e.g. Stage 1 is now live!"
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={5}
              className={inputCls + ' resize-none'}
              placeholder="Write the post content here. You can use **bold** and - bullet lists."
            />
            <p className="text-[11px] text-slate-400 mt-1">Supports **bold** and - bullet formatting</p>
          </div>

          {/* Date & Status row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Post Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => set('date', e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} className={inputCls}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Pinned toggle */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={form.isPinned}
                onChange={e => set('isPinned', e.target.checked)}
              />
              <div className={cn(
                'w-10 h-5 rounded-full transition-colors',
                form.isPinned ? 'bg-violet-600' : 'bg-slate-200 dark:bg-slate-700'
              )}>
                <div className={cn(
                  'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
                  form.isPinned && 'translate-x-5'
                )} />
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Pin size={13} /> Pin this post to top
            </div>
          </label>

          {/* Registration-specific fields */}
          {form.type === 'Registration' && (
            <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-900/10 space-y-4">
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">📝 Registration Settings</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Registration Status</label>
                  <select value={form.registrationStatus} onChange={e => set('registrationStatus', e.target.value)} className={inputCls}>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Deadline</label>
                  <input type="date" value={form.registrationDeadline} onChange={e => set('registrationDeadline', e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>
          )}

          {/* Stage-specific fields */}
          {form.type === 'Stage' && (
            <div className="p-4 rounded-2xl border border-violet-200 dark:border-violet-800 bg-violet-50/40 dark:bg-violet-900/10 space-y-4">
              <p className="text-xs font-bold text-violet-700 dark:text-violet-400 uppercase tracking-wider">🧩 Stage Dates</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Stage Start Date</label>
                  <input type="date" value={form.stageStartDate} onChange={e => set('stageStartDate', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Stage End Date</label>
                  <input type="date" value={form.stageEndDate} onChange={e => set('stageEndDate', e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>
          )}

          {/* Result-specific fields */}
          {form.type === 'Result' && (
            <div className="p-4 rounded-2xl border border-yellow-200 dark:border-yellow-800 bg-yellow-50/40 dark:bg-yellow-900/10 space-y-4">
              <p className="text-xs font-bold text-yellow-700 dark:text-yellow-400 uppercase tracking-wider">🏆 Winner Rankings</p>
              {[1, 2, 3].map(rank => {
                const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
                const w = form.winners.find(x => x.rank === rank) || { rank, name: '', teamName: '', project: '' };
                return (
                  <div key={rank} className="grid grid-cols-3 gap-3 items-center">
                    <span className="text-xl col-span-1 text-center">{medals[rank]}</span>
                    <input
                      type="text"
                      placeholder="Name"
                      value={w.name}
                      onChange={e => updateWinner(rank, 'name', e.target.value)}
                      className={inputCls + ' col-span-2'}
                    />
                    <input
                      type="text"
                      placeholder="Team Name (optional)"
                      value={w.teamName}
                      onChange={e => updateWinner(rank, 'teamName', e.target.value)}
                      className={inputCls + ' col-span-3'}
                    />
                    <input
                      type="text"
                      placeholder="Project Title"
                      value={w.project}
                      onChange={e => updateWinner(rank, 'project', e.target.value)}
                      className={inputCls + ' col-span-3'}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <Button
            onClick={handleSave}
            disabled={!form.title.trim()}
            className="gap-2 bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20"
          >
            <Plus size={16} />
            {isEditing ? 'Save Changes' : 'Add Post'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddPostModal;
