import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, Send, Trash2, Megaphone, Users, Target, 
  Info, AlertTriangle, CheckCircle, Star, Clock, Search
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const AnnouncementManager = () => {
  const { announcements, addAnnouncement, competitions } = useApp();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('info');
  const [target, setTarget] = useState('all');
  const [isSending, setIsSending] = useState(false);

  const handleBroadcast = () => {
    if (!title.trim() || !content.trim()) return;
    
    setIsSending(true);
    // Simulate API delay
    setTimeout(() => {
      addAnnouncement({
        title,
        content,
        type,
        target,
        date: new Date().toISOString()
      });
      setTitle('');
      setContent('');
      setIsSending(false);
    }, 1000);
  };

  const getIcon = (t) => {
    switch (t) {
      case 'info': return <Info size={16} className="text-blue-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'success': return <CheckCircle size={16} className="text-emerald-500" />;
      case 'important': return <Star size={16} className="text-red-500" />;
      default: return <Bell size={16} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Broadcast Center</h1>
          <p className="text-slate-500">Send announcements and platform-wide updates to your students.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="h-12 w-12 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600">
              <Megaphone size={24} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Creator Panel */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] shadow-xl border-white/10 relative overflow-hidden">
             {/* Gradient Edge */}
             <div className="absolute top-0 left-0 w-1 h-full bg-violet-600"></div>

             <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
               Create New Announcement
             </h2>

             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Headline</label>
                   <input 
                     type="text" 
                     placeholder="e.g. Registration deadline extended!"
                     className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 transition-all outline-none"
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Announcement Type</label>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['info', 'warning', 'success', 'important'].map(t => (
                        <button
                          key={t}
                          onClick={() => setType(t)}
                          className={cn(
                            "py-3 rounded-xl border flex flex-col items-center gap-2 transition-all capitalize text-xs font-bold",
                            type === t 
                              ? "bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-500/20" 
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-violet-500"
                          )}
                        >
                          {getIcon(t)}
                          {t}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Broadcast Target</label>
                   <select 
                     className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 transition-all outline-none capitalize"
                     value={target}
                     onChange={(e) => setTarget(e.target.value)}
                   >
                     <option value="all">Everyone</option>
                     {competitions.map(c => (
                       <option key={c.id} value={c.id}>{c.name}</option>
                     ))}
                   </select>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Content</label>
                   <textarea 
                     rows="6"
                     placeholder="Type your message here..."
                     className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 transition-all outline-none resize-none"
                     value={content}
                     onChange={(e) => setContent(e.target.value)}
                   />
                </div>

                <Button 
                  onClick={handleBroadcast} 
                  disabled={isSending || !title.trim() || !content.trim()}
                  className="w-full py-6 rounded-2xl text-lg font-black gap-3 shadow-xl"
                >
                  {isSending ? (
                    <div className="h-6 w-6 border-4 border-white border-t-transparent animate-spin rounded-full"></div>
                  ) : (
                    <>
                      <Send size={20} />
                      Broadcast Now
                    </>
                  )}
                </Button>
             </div>
          </div>
        </div>

        {/* History Panel */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
           <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                 Announcement Feed
                 <Badge variant="secondary" className="ml-2">{announcements.length}</Badge>
              </h2>
              <div className="relative">
                 <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="Search feed..." 
                   className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-violet-500 outline-none"
                 />
              </div>
           </div>

           <div className="space-y-4 max-h-[800px] overflow-y-auto sidebar-scroll pr-2">
              {announcements.length > 0 ? announcements.slice().reverse().map((ann) => (
                <div key={ann.id} className="glass-card p-6 rounded-[2rem] border-white/10 shadow-sm hover:shadow-lg transition-all group">
                   <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                         <div className={cn(
                           "h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg",
                           ann.type === 'info' ? "bg-blue-500 shadow-blue-500/20" :
                           ann.type === 'warning' ? "bg-amber-500 shadow-amber-500/20" :
                           ann.type === 'success' ? "bg-emerald-500 shadow-emerald-500/20" :
                           ann.type === 'important' ? "bg-red-500 shadow-red-500/20" :
                           "bg-violet-600 shadow-violet-500/20"
                         )}>
                           {getIcon(ann.type)}
                         </div>
                         <div>
                            <h3 className="font-bold text-slate-900 dark:text-slate-100">{ann.title}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mt-0.5">
                               <Clock size={10} /> 
                               {new Date(ann.date).toLocaleDateString()} • Target: 
                               <span className="text-violet-500">{ann.target === 'all' ? 'Everyone' : 'Competition ID: ' + ann.target}</span>
                            </p>
                         </div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all">
                        <Trash2 size={16} />
                      </button>
                   </div>
                   <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-16">
                      {ann.content}
                   </p>
                </div>
              )) : (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                   <p className="text-slate-400 font-medium">No announcements yet.</p>
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default AnnouncementManager;
