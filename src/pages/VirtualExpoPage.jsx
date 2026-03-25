import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import CompetitionProjectCard from '../components/ui/CompetitionProjectCard';
import { Search, Filter, Trophy, Sparkles, LayoutGrid, List } from 'lucide-react';
import { cn } from '../utils/cn';

const VirtualExpoPage = () => {
  const { submissions, competitions, isDemoMode } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComp, setSelectedComp] = useState('All');

  // Filter for winning projects only
  const winningProjects = useMemo(() => {
    return submissions.filter(sub => sub.isWinner || sub.status === 'approved' && sub.rank);
  }, [submissions]);

  const filteredProjects = useMemo(() => {
    return winningProjects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const competition = competitions.find(c => c.id === project.competitionId);
      const matchesComp = selectedComp === 'All' || competition?.name === selectedComp;
      
      return matchesSearch && matchesComp;
    });
  }, [winningProjects, searchQuery, selectedComp, competitions]);

  return (
    <div className="min-h-screen pb-20">
      {/* Premium Header */}
      <div className="relative h-80 flex items-center justify-center overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-900"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 animate-fade-in-up">
            <Trophy className="text-amber-400" size={20} />
            <span className="text-white font-bold tracking-widest text-xs uppercase">Hall of Excellence</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight animate-fade-in-up delay-100">
            Virtual <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">Expo</span> 2026
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Discover the most innovative student projects, groundbreaking research, and creative solutions born in our prestigious competitions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search & Filters */}
        <div className="glass-card p-4 mb-12 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-20 z-30 shadow-xl border-white/10">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search projects, tech, or keywords..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            <Filter size={18} className="text-slate-400 shrink-0" />
            {['All', ...competitions.map(c => c.name)].map((comp) => (
              <button
                key={comp}
                onClick={() => setSelectedComp(comp)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border",
                  selectedComp === comp 
                    ? "bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-500/30" 
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-violet-500"
                )}
              >
                {comp}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <CompetitionProjectCard 
                key={project.id} 
                project={project} 
                competitionName={competitions.find(c => c.id === project.competitionId)?.name || 'Internal Competition'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-6">
              <Sparkles size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">No projects found</h2>
            <p className="text-slate-500">Try adjusting your filters or search keywords to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualExpoPage;
