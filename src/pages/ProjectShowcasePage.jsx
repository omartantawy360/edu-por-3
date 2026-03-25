import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTeam } from '../context/TeamContext';
import { 
  Trophy, Users, Calendar, Award, ExternalLink, Github, 
  Share2, ArrowLeft, Play, Info, CheckCircle2, ChevronRight,
  ShieldCheck, Code, Paintbrush, Presentation
} from 'lucide-react';
import { cn } from '../utils/cn';

const ProjectShowcasePage = () => {
  const { id } = useParams();
  const { submissions, competitions, addNotification } = useApp();
  const { teams } = useTeam();
  const [activeImage, setActiveImage] = useState(0);

  const project = useMemo(() => submissions.find(s => s.id === id), [submissions, id]);
  const competition = useMemo(() => 
    competitions.find(c => c.id === project?.competitionId), 
  [competitions, project]);

  // Find team associated with this project (if any)
  const team = useMemo(() => {
    if (!project) return null;
    return teams.find(t => 
      t.members.some(m => m.id === project.studentId) || t.id === project.teamId
    );
  }, [teams, project]);

  if (!project) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-6 animate-bounce">
        <Info size={40} />
      </div>
      <h2 className="text-2xl font-bold">Project Not Found</h2>
      <Link to="/expo" className="mt-4 text-violet-600 font-bold hover:underline">Back to Expo</Link>
    </div>
  );

  const images = project.gallery || ['https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80'];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addNotification('Project link copied to clipboard!', 'success');
  };

  const getRoleIcon = (role) => {
    const r = role?.toLowerCase() || '';
    if (r.includes('lead') || r.includes('leader')) return <ShieldCheck size={16} className="text-amber-500" />;
    if (r.includes('dev')) return <Code size={16} className="text-blue-500" />;
    if (r.includes('design')) return <Paintbrush size={16} className="text-pink-500" />;
    if (r.includes('present')) return <Presentation size={16} className="text-emerald-500" />;
    return <Users size={16} className="text-slate-400" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <Link 
          to="/expo" 
          className="flex items-center gap-2 text-slate-500 hover:text-violet-600 transition-colors font-bold group"
        >
          <div className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:border-violet-500 transition-colors">
            <ArrowLeft size={16} />
          </div>
          Back to Expo
        </Link>
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full font-bold hover:border-violet-500 transition-all shadow-sm hover:shadow-lg active:scale-95"
        >
          <Share2 size={18} className="text-violet-600" />
          Share Project
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Visuals & Details */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          
          {/* Main Showcase */}
          <div className="flex flex-col gap-4 animate-fade-in delay-100">
             <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl group">
                <img 
                  src={images[activeImage]} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </div>
             
             {/* Thumbnail Gallery */}
             {images.length > 1 && (
               <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                 {images.map((img, i) => (
                   <button 
                     key={i}
                     onClick={() => setActiveImage(i)}
                     className={cn(
                       "h-20 w-32 rounded-2xl overflow-hidden border-2 transition-all shrink-0",
                       activeImage === i ? "border-violet-600 scale-95 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                     )}
                   >
                     <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                   </button>
                 ))}
               </div>
             )}
          </div>

          {/* Video Section */}
          {project.videoUrl && (
            <div className="animate-fade-in delay-200">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
                  <Play size={16} />
                </div>
                Project Demo
              </h3>
              <div className="aspect-video rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 bg-black shadow-xl">
                 <iframe 
                   className="w-full h-full"
                   src={project.videoUrl} 
                   title="Project Demo Video"
                   frameBorder="0"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                   allowFullScreen
                 ></iframe>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="animate-fade-in delay-300">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                <Info size={16} />
              </div>
              About the Project
            </h3>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </div>
            
            {/* Tech Stack / Tags */}
            <div className="flex flex-wrap gap-3 mt-8">
              {project.tags?.map((tag, i) => (
                <span key={i} className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-violet-500"></div>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Meta & Team */}
        <div className="lg:col-span-4 flex flex-col gap-8 animate-fade-in-up delay-200">
          
          {/* Main Info Card */}
          <div className="glass-card p-8 rounded-[2.5rem] shadow-xl border-white/10 overflow-hidden relative">
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
             
             <div className="relative z-10">
                <Badge className="mb-4 bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 rounded-full px-4 py-1.5">
                  {competition?.name || 'Project Showcase'}
                </Badge>
                <h1 className="text-4xl font-black mb-6 tracking-tight leading-tight">
                  {project.title}
                </h1>

                {project.isWinner && (
                  <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10 border border-amber-200 dark:border-amber-700/50 mb-8 flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-amber-400 flex items-center justify-center text-white shadow-lg rotate-3">
                      <Trophy size={28} />
                    </div>
                    <div>
                      <p className="text-amber-700 dark:text-amber-400 font-black text-sm uppercase tracking-widest">Achievement</p>
                      <h4 className="text-2xl font-black text-amber-900 dark:text-amber-100">
                        {project.rank === 1 ? '🥇 1st Place' : project.rank === 2 ? '🥈 2nd Place' : '🥉 3rd Place'}
                      </h4>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                   <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 font-medium">Date Published</span>
                      <span className="font-bold flex items-center gap-2"><Calendar size={16} /> {project.date}</span>
                   </div>
                   <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 font-medium">Type</span>
                      <span className="font-bold uppercase tracking-wider text-xs">{project.type}</span>
                   </div>
                   {project.url && (
                     <a 
                       href={project.url} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="w-full mt-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl flex items-center justify-center gap-2 font-black text-sm hover:scale-[1.02] transition-transform active:scale-95 shadow-xl"
                     >
                       {project.type === 'github' ? <Github size={20} /> : <ExternalLink size={20} />}
                       View Live Project
                     </a>
                   )}
                </div>
             </div>
          </div>

          {/* Team / Author Card */}
          <div className="glass-card p-8 rounded-[2.5rem] shadow-xl border-white/10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Users size={18} className="text-violet-600" />
              The Team
            </h3>
            
            {team ? (
              <div className="space-y-5">
                <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                  {team.name}
                </div>
                <div className="space-y-3">
                  {team.members.map((member) => (
                    <Link 
                      key={member.id} 
                      to={`/profile/${member.id}`}
                      className="flex items-center gap-4 p-3 rounded-2xl border border-transparent hover:border-violet-500/30 hover:bg-violet-500/5 transition-all group/member"
                    >
                      <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-black text-sm border-2 border-white dark:border-slate-700 group-hover/member:border-violet-500 transition-colors">
                        {member.avatar || member.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 dark:text-slate-100 group-hover/member:text-violet-600 transition-colors">{member.name}</p>
                        <div className="flex items-center gap-1.5">
                          {getRoleIcon(member.role)}
                          <p className="text-xs text-slate-500">{member.role || 'Member'}</p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover/member:translate-x-1 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-3">
                 <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                   <Users size={20} />
                 </div>
                 <div>
                   <p className="font-bold">Individual Project</p>
                   <p className="text-xs text-slate-500">Student Submission</p>
                 </div>
              </div>
            )}
          </div>

          {/* Verification / Quality Badge */}
          <div className="p-6 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/20 flex flex-col items-center text-center">
             <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 mb-4">
                <CheckCircle2 size={24} />
             </div>
             <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">Verified Submission</p>
             <p className="text-[10px] text-emerald-800/60 dark:text-emerald-400/60">This project has been reviewed and verified by our academic board for the 2026 competition cycle.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectShowcasePage;
