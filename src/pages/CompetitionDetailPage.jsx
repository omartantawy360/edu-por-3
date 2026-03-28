import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Trophy, Calendar, Users, Tag } from 'lucide-react';
import CompetitionTimeline from '../components/ui/CompetitionTimeline';

const CompetitionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { competitions, getCompetitionPosts } = useApp();

  const competition = competitions.find(c => c.id === id);
  const posts = getCompetitionPosts(id);

  if (!competition) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-slate-400">
        <Trophy size={40} className="mx-auto mb-3 opacity-30" />
        <p className="font-medium">Competition not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-violet-600 hover:underline text-sm">
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Back */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Competition Timeline</p>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">{competition.name}</h1>
        </div>
      </div>

      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white p-6 shadow-xl shadow-violet-500/20">
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 border border-white/30 text-xs font-bold">
              {competition.type}
            </span>
            {competition.categories?.slice(0, 2).map((cat, i) => (
              <span key={i} className="hidden sm:inline px-3 py-1 rounded-full bg-white/10 text-xs font-medium border border-white/20">
                <Tag size={10} className="inline mr-1" />{cat}
              </span>
            ))}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold leading-tight">{competition.name}</h2>
          <p className="text-violet-200 max-w-xl text-sm leading-relaxed">{competition.description}</p>
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-violet-200">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              {competition.startDate} → {competition.endDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={12} />
              {competition.maxParticipants} spots available
            </span>
          </div>
        </div>
      </div>

      {/* Stages overview */}
      {competition.stages?.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Competition Stages</p>
          <div className="flex items-center gap-0 overflow-x-auto pb-1">
            {competition.stages.map((stage, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-1 shrink-0 px-3">
                  <div className="h-8 w-8 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 flex items-center justify-center text-xs font-black">
                    {i + 1}
                  </div>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400 text-center whitespace-nowrap">
                    {typeof stage === 'string' ? stage : (stage?.name || 'Stage')}
                  </span>
                </div>
                {i < competition.stages.length - 1 && (
                  <div className="h-0.5 w-6 bg-slate-200 dark:bg-slate-700 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-6 flex items-center gap-2">
          <Trophy size={18} className="text-violet-500" />
          Competition Feed
        </h3>

        <CompetitionTimeline
          posts={posts}
          competitionId={id}
          isAdmin={false}
          onRegister={() => navigate('/register')}
          emptyMessage="No updates yet. Check back soon for the latest from this competition!"
        />
      </div>
    </div>
  );
};

export default CompetitionDetailPage;
