import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Trophy, Award, BookOpen, Star, Share2, Mail, MapPin, 
  ExternalLink, Github, Linkedin, Twitter, Grid, List,
  CheckCircle2, Flame, Target, Zap
} from 'lucide-react';
import { cn } from '../utils/cn';
import CompetitionProjectCard from '../components/ui/CompetitionProjectCard';

const StudentProfilePage = () => {
  const { id } = useParams();
  const { students, submissions, certificates, achievements, competitions, addNotification } = useApp();

  const student = useMemo(() => students.find(s => s.id === id), [students, id]);
  
  const studentSubmissions = useMemo(() => 
    submissions.filter(s => s.studentId === id || (s.isTeamSubmission && s.members?.some(m => m.id === id))), 
  [submissions, id]);

  const studentCertificates = useMemo(() => 
    certificates.filter(c => c.studentId === id), 
  [certificates, id]);

  const studentAchievements = useMemo(() => 
    achievements.filter(a => a.studentId === id), 
  [achievements, id]);

  if (!student) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl font-bold">Student Profile Not Found</h2>
      <Link to="/expo" className="mt-4 text-violet-600 font-bold hover:underline">Go to Expo</Link>
    </div>
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addNotification('Portfolio link copied to clipboard!', 'success');
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Dynamic Header / Cover */}
      <div className="relative h-64 bg-gradient-to-r from-violet-600 to-indigo-800">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar: Profile Info */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="glass-card p-8 rounded-[2.5rem] shadow-xl border-white/10 text-center">
              <div className="relative inline-block mb-6">
                <div className="h-40 w-40 rounded-[2.5rem] bg-white dark:bg-slate-800 p-1 shadow-2xl relative z-10 overflow-hidden">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} 
                    alt={student.name}
                    className="w-full h-full object-cover rounded-[2.2rem]"
                  />
                </div>
                {/* Status Dot */}
                <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-800 z-20"></div>
              </div>

              <h1 className="text-3xl font-black tracking-tight mb-2">{student.name}</h1>
              <p className="text-slate-500 font-bold mb-6 flex items-center justify-center gap-2">
                <MapPin size={16} /> {student.school || 'WE School'} • Grade {student.grade || '11'}
              </p>

              <div className="flex justify-center gap-4 mb-8">
                <button className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 hover:text-violet-600 transition-all border border-transparent hover:border-violet-500/30">
                  <Github size={20} />
                </button>
                <button className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 hover:text-blue-600 transition-all border border-transparent hover:border-blue-500/30">
                  <Linkedin size={20} />
                </button>
                <button onClick={handleShare} className="h-12 w-12 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30 hover:scale-110 transition-transform">
                  <Share2 size={20} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 py-6 border-t border-slate-100 dark:border-slate-800">
                <div>
                   <p className="text-2xl font-black text-violet-600">{studentSubmissions.length}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Projects</p>
                </div>
                <div>
                   <p className="text-2xl font-black text-amber-500">{studentCertificates.length}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Awards</p>
                </div>
                <div>
                   <p className="text-2xl font-black text-emerald-500">{studentAchievements.length}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Badges</p>
                </div>
              </div>
            </div>

            {/* Achievements Sidebar */}
            <div className="glass-card p-8 rounded-[2.5rem] shadow-xl border-white/10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Award size={20} className="text-amber-500" />
                Achievements
              </h3>
              <div className="flex flex-wrap gap-4">
                {studentAchievements.length > 0 ? studentAchievements.map((ach) => (
                  <div 
                    key={ach.id} 
                    className={cn(
                      "group relative h-14 w-14 rounded-2xl flex items-center justify-center text-2xl border-2 transition-all hover:scale-110 cursor-help",
                      ach.color === 'blue' ? "bg-blue-50 border-blue-200 text-blue-600" :
                      ach.color === 'green' ? "bg-emerald-50 border-emerald-200 text-emerald-600" :
                      "bg-amber-50 border-amber-200 text-amber-600"
                    )}
                    title={`${ach.badge}: ${ach.description}`}
                  >
                    {ach.icon}
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                       {ach.badge}
                    </div>
                  </div>
                )) : (
                  <p className="text-slate-400 text-sm italic">No special badges earned yet.</p>
                )}
              </div>
            </div>

            {/* Verification Status */}
            <div className="p-6 rounded-[2.5rem] bg-indigo-500 text-white shadow-xl shadow-indigo-500/20">
               <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest opacity-70">Membership</p>
                    <p className="font-bold">Elite Student Portal</p>
                  </div>
               </div>
               <p className="text-xs opacity-80 leading-relaxed">Verified member since 2026. Actively participating in national innovation cycles.</p>
            </div>
          </div>

          {/* Main Content: Projects & Portfolio */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Portfolio Sections */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                  <Grid size={24} className="text-violet-600" />
                  Project Portfolio
                </h2>
                <div className="flex p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="h-8 w-8 rounded-xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-violet-600">
                    <Grid size={16} />
                  </div>
                  <div className="h-8 w-8 rounded-xl flex items-center justify-center text-slate-400">
                    <List size={16} />
                  </div>
                </div>
              </div>

              {studentSubmissions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                  {studentSubmissions.map((project) => (
                    <CompetitionProjectCard 
                      key={project.id} 
                      project={project} 
                      competitionName={competitions.find(c => c.id === project.competitionId)?.name || 'Innovation Submission'}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center glass-card border-dashed">
                  <p className="text-slate-400">No public projects available in this portfolio.</p>
                </div>
              )}
            </div>

            {/* Awards & Certificates */}
            <div className="flex flex-col gap-6 mt-6">
               <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                 <Trophy size={24} className="text-amber-500" />
                 Official Recognitions
               </h2>
               
               <div className="grid grid-cols-1 gap-4">
                 {studentCertificates.length > 0 ? studentCertificates.map((cert) => (
                   <div key={cert.id} className="glass-card p-6 rounded-3xl border-slate-200/50 hover:border-amber-500/30 transition-all group flex items-start gap-6">
                     <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-white shadow-lg shrink-0 group-hover:rotate-6 transition-transform">
                       <Award size={32} />
                     </div>
                     <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                           <h4 className="text-lg font-black">{cert.certificateTitle || cert.achievement}</h4>
                           <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{cert.date}</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{cert.competitionName}</p>
                        <div className="flex items-center gap-4">
                           <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                             <CheckCircle2 size={12} /> VERIFIED
                           </span>
                           <button className="text-[10px] font-black text-violet-600 hover:underline">VIEW CERTIFICATE</button>
                        </div>
                     </div>
                   </div>
                 )) : (
                   <p className="text-slate-400 text-sm italic">No official certificates issued to this portfolio yet.</p>
                 )}
               </div>
            </div>

            {/* Skills & Buzzwords (Fun Section) */}
            <div className="mt-6">
               <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                 <Zap size={18} className="text-emerald-500" />
                 Core Competencies
               </h3>
               <div className="flex flex-wrap gap-2">
                 {['Rapid Prototyping', 'System Design', 'Frontend Engineering', 'AI Ethics', 'Public Speaking', 'Team Leadership', 'Strategic Planning'].map((skill, i) => (
                   <span key={i} className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold shadow-sm">
                     {skill}
                   </span>
                 ))}
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
