import React, { useMemo } from 'react';
import { 
  CheckCircle2, Flag, Send, Trophy, Award, Users, 
  Calendar, Star, Sparkles, Zap, Timer
} from 'lucide-react';
import { cn } from '../../utils/cn';

const StudentJourneyTimeline = ({ studentId, submissions = [], certificates = [], userTeams = [] }) => {
  
  const journeyEvents = useMemo(() => {
    const events = [];

    // 1. Team Joins
    userTeams.forEach(team => {
      events.push({
        id: `team-${team.id}`,
        type: 'team',
        title: 'Joined Team',
        subtitle: team.name,
        description: `Successfully joined "${team.name}" for the ${team.competitionName}.`,
        date: team.createdDate || '2026-01-01',
        icon: <Users size={16} />,
        color: 'blue'
      });
    });

    // 2. Submissions
    submissions.forEach(sub => {
      events.push({
        id: `sub-${sub.id}`,
        type: 'submission',
        title: 'Project Submitted',
        subtitle: sub.title,
        description: `Project "${sub.title}" was submitted to ${sub.competitionId}.`,
        date: sub.date,
        icon: <Send size={16} />,
        color: 'indigo'
      });

      if (sub.status === 'approved') {
        events.push({
          id: `eval-${sub.id}`,
          type: 'evaluation',
          title: 'Judging Completed',
          subtitle: sub.title,
          description: `Evaluation for "${sub.title}" is finished. Feedback: ${sub.feedback || 'Excellent work!'}`,
          date: sub.date, // Shifted in real app
          icon: <CheckCircle2 size={16} />,
          color: 'emerald'
        });
      }
    });

    // 3. Certificates
    certificates.forEach(cert => {
      events.push({
        id: `cert-${cert.id}`,
        type: 'reward',
        title: 'Award Received',
        subtitle: cert.competitionName,
        description: `Received "${cert.certificateTitle || cert.achievement}" for outstanding performance.`,
        date: cert.date || cert.createdAt?.split('T')[0] || '2026-03-01',
        icon: <Trophy size={16} />,
        color: 'amber'
      });
    });

    // Sort by date descending
    return events.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [submissions, certificates, userTeams]);

  if (journeyEvents.length === 0) {
    return (
      <div className="py-12 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
        <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
          <Timer size={32} />
        </div>
        <p className="text-slate-500 font-bold">Your journey is just beginning!</p>
        <p className="text-xs text-slate-400 mt-1">Start by registering for a competition or joining a team.</p>
      </div>
    );
  }

  return (
    <div className="relative pl-8 space-y-8 before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 before:content-['']">
      {journeyEvents.map((event, idx) => (
        <div 
          key={event.id} 
          className="relative animate-fade-in-up"
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          {/* Timeline Dot */}
          <div className={cn(
            "absolute -left-[30px] h-6 w-6 rounded-full border-4 border-white dark:border-slate-950 flex items-center justify-center z-10 shadow-sm",
            event.color === 'blue' ? "bg-blue-500" :
            event.color === 'indigo' ? "bg-indigo-600" :
            event.color === 'emerald' ? "bg-emerald-500" :
            event.color === 'amber' ? "bg-amber-500" :
            "bg-slate-400"
          )}>
          </div>

          <div className="glass-card hover:bg-white dark:hover:bg-slate-900 transition-all p-5 rounded-2xl border-white/10 group cursor-default">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                 <div className={cn(
                   "p-1.5 rounded-lg",
                   event.color === 'blue' ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" :
                   event.color === 'indigo' ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" :
                   event.color === 'emerald' ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" :
                   event.color === 'amber' ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
                   "bg-slate-100 text-slate-600"
                 )}>
                   {event.icon}
                 </div>
                 <h4 className="font-black text-sm uppercase tracking-wider">{event.title}</h4>
              </div>
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{event.date}</span>
            </div>

            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">{event.subtitle}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{event.description}</p>
          </div>
        </div>
      ))}
      
      {/* End Point */}
      <div className="relative pl-2">
         <div className="absolute -left-[27px] h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded-full border-4 border-white dark:border-slate-950"></div>
         <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Beginning of Journey</p>
      </div>
    </div>
  );
};

export default StudentJourneyTimeline;
