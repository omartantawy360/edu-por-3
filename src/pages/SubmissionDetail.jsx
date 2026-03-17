import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
    ChevronLeft, Trophy, User, Calendar, ExternalLink, Github, 
    FileText, Paperclip, Video, Image as ImageIcon, FileCode, Clock,
    CheckCircle, XCircle, Globe, Shield, MessageSquare
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { cn } from '../utils/cn';

const SubmissionDetail = () => {
    const { submissionId } = useParams();
    const navigate = useNavigate();
    const { submissions, students, competitions } = useApp();

    const submission = submissions.find(s => s.id === submissionId);
    const student = submission ? students.find(s => s.id === submission.studentId) : null;
    const competition = submission ? competitions.find(c => c.id === submission.competitionId) : null;

    if (!submission) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                    <FileText size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">Submission Not Found</h2>
                <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
            </div>
        );
    }

    const isImage = (name) => /\.(jpg|jpeg|png|gif|webp)$/i.test(name);
    const isVideo = (name) => /\.(mp4|mov|avi|wmv)$/i.test(name);
    const isPdf = (name) => /\.pdf$/i.test(name);

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Navigation Header */}
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors group"
                >
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-all">
                        <ChevronLeft size={16} />
                    </div>
                    Back to Submissions
                </button>
                <Badge variant={
                    submission.status === 'approved' ? 'success' : 
                    submission.status === 'pending' ? 'warning' : 'destructive'
                } className="px-4 py-1.5 text-xs font-black uppercase tracking-widest shadow-lg">
                    {submission.status}
                </Badge>
            </div>

            {/* Main Project Header */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-violet-600/20 to-transparent pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none"></div>
                
                <div className="relative p-10 md:p-14 flex flex-col md:flex-row gap-10 items-start md:items-center">
                    <div className="h-24 w-24 md:h-32 md:w-32 rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white shadow-2xl relative">
                        <Trophy size={48} className="absolute inset-0 m-auto animate-pulse-slow opacity-20 scale-150 rotate-12" />
                        <Trophy size={48} className="relative z-10" />
                    </div>
                    
                    <div className="flex-1 space-y-4">
                        <div className="space-y-1">
                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">{submission.title}</h1>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-400 font-medium">
                                <div className="flex items-center gap-2">
                                    <User size={16} className="text-violet-400" />
                                    <span>{student?.name || 'Unknown Student'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe size={16} className="text-emerald-400" />
                                    <span>{competition?.name || 'General Competition'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-amber-400" />
                                    <span>{submission.date}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                            <Badge variant="outline" className="bg-white/5 border-white/10 text-slate-300 py-1.5 px-3">
                                {submission.category || 'General'}
                            </Badge>
                            {submission.type === 'github' && (
                                <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20 py-1.5 px-3">
                                    <Github size={12} className="mr-1.5 inline" /> GitHub Project
                                </Badge>
                            )}
                        </div>
                    </div>

                    {submission.url && (
                        <a 
                            href={submission.url.startsWith('http') ? submission.url : `https://${submission.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full md:w-auto px-8 py-4 bg-white text-slate-900 rounded-2xl font-black hover:bg-slate-100 transition-all flex items-center justify-center gap-3 shadow-xl hover:-translate-y-1 active:translate-y-0"
                        >
                            <ExternalLink size={20} />
                            Launch Live
                        </a>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Technical Report Card */}
                    <Card className="rounded-[2.5rem] border-slate-200 dark:border-slate-800 overflow-hidden shadow-soft">
                        <div className="p-8 md:p-10 space-y-8">
                            <div className="flex items-center gap-3 px-1">
                                <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                                    <FileText size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 uppercase tracking-tighter">Technical Report</h3>
                            </div>
                            
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <p className="text-base text-slate-600 dark:text-slate-300 leading-[1.8] whitespace-pre-wrap font-medium">
                                    {submission.description || "No detailed report provided for this project."}
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Source Code Section */}
                    {submission.codeSnippet && (
                        <div className="space-y-4">
                             <div className="flex items-center justify-between px-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-slate-900 text-white">
                                        <FileCode size={20} />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-slate-50 uppercase tracking-tighter">Integrated Code</h3>
                                </div>
                                <Badge variant="secondary" className="font-mono text-[10px]">{submission.codeExt?.toUpperCase() || 'JAVASCRIPT'}</Badge>
                            </div>
                            
                            <div className="relative group overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-[#0d1117] shadow-2xl">
                                <div className="absolute top-0 left-0 w-full h-10 bg-black/20 flex items-center justify-between px-6 border-b border-white/5">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/60 shadow-[0_0_8px_rgba(239,68,68,0.3)]"></div>
                                        <div className="w-3 h-3 rounded-full bg-amber-500/60 shadow-[0_0_8px_rgba(245,158,11,0.3)]"></div>
                                        <div className="w-3 h-3 rounded-full bg-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-500 font-bold tracking-widest">main{submission.codeExt || '.js'}</span>
                                </div>
                                <pre className="p-8 pt-16 text-xs md:text-sm font-mono text-slate-300 overflow-x-auto sidebar-scroll leading-relaxed">
                                    <code>{submission.codeSnippet}</code>
                                </pre>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Assets & Feedback */}
                <div className="space-y-8">
                    {/* Assets List */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 px-1">
                            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                <Paperclip size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 uppercase tracking-tighter">Project Assets</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                            {submission.files && submission.files.length > 0 ? (
                                submission.files.map((file, idx) => {
                                    const fileName = file.name || file;
                                    const image = isImage(fileName);
                                    const video = isVideo(fileName);
                                    const pdf = isPdf(fileName);
                                    
                                    return (
                                        <div key={idx} className="group flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-violet-300 dark:hover:border-violet-700 transition-all cursor-pointer">
                                            <div className="flex items-center gap-4 overflow-hidden">
                                                <div className={cn(
                                                    "p-3 rounded-xl transition-colors shrink-0",
                                                    image ? "bg-blue-50 text-blue-500 dark:bg-blue-900/20" :
                                                    video ? "bg-amber-50 text-amber-500 dark:bg-amber-900/20" :
                                                    pdf ? "bg-red-50 text-red-500 dark:bg-red-900/20" : 
                                                    "bg-slate-50 text-slate-500 dark:bg-slate-800"
                                                )}>
                                                    {image ? <ImageIcon size={20} /> : video ? <Video size={20} /> : pdf ? <FileText size={20} /> : <FileCode size={20} />}
                                                </div>
                                                <div className="truncate">
                                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{fileName}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold opacity-70">
                                                        {image ? 'Image' : video ? 'Video' : pdf ? 'Document' : 'File'} Asset
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-violet-500 group-hover:text-white transition-all">
                                                <ExternalLink size={14} />
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-sm italic">
                                    No external files attached.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Feedback Section */}
                    {submission.feedback && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 px-1">
                                <div className="p-2.5 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400">
                                    <MessageSquare size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 uppercase tracking-tighter">Judge Feedback</h3>
                            </div>
                            
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 p-6 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/20 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                                    <CheckCircle size={64} className="text-emerald-600" />
                                </div>
                                <p className="text-sm text-emerald-900/80 dark:text-emerald-300/80 leading-relaxed italic font-medium relative z-10">
                                    "{submission.feedback}"
                                </p>
                                <div className="mt-4 flex items-center gap-2 relative z-10">
                                    <Shield size={14} className="text-emerald-600" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700/60 dark:text-emerald-500/60">Verified Decision</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubmissionDetail;
