import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Trophy, Clock, CheckCircle, Calendar, User, MessageSquare, School, Mail, BookOpen, Bell, X, FileText, ArrowRight, ExternalLink, Sparkles, Star, ThumbsUp, ThumbsDown, BarChart3 } from 'lucide-react';
import { cn } from '../utils/cn';
import DeadlineTimer from '../components/ui/DeadlineTimer';
import StudentJourneyTimeline from '../components/ui/StudentJourneyTimeline';
import { Link } from 'react-router-dom';
import { useTeam } from '../context/TeamContext';
import CompetitionPhaseSteps from '../components/ui/CompetitionPhaseSteps';
import PeerReviewPanel from '../components/ui/PeerReviewPanel';
import { Modal } from '../components/ui/Modal';

const StudentDashboard = () => {
    const context = useApp();
    const { 
        students = [], notifications = [], removeNotification = () => {}, competitions = [], 
        getStudentSubmissions = () => [], getStudentCertificates = () => [], scores = [],
        getMyPeerAssignments = () => []
    } = context || {};
    const { user, loading: authLoading } = useAuth();
    const { userTeams } = useTeam();
    const [selectedAssignment, setSelectedAssignment] = React.useState(null);

    if (authLoading) return <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 font-medium text-slate-500">Loading Dashboard...</div>;
    if (!user) return <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 font-medium text-slate-500">Please log in to view your dashboard.</div>;

    // Use logged-in user name from auth context
    const currentUserName = user?.name || "Omar Tantawy";
    const profile = students.find(s => s.name === currentUserName) || {
        name: currentUserName,
        grade: "10",
        clazz: "A",
        school: "WE School",
        email: "omar.tantawy@weschool.edu"
    };

    // Filter registrations for this specific student
    const myRegistrations = students.filter(s => s.name === currentUserName);

    // Get current student ID
    const studentId = myRegistrations[0]?.id || user?.id;

    // Filter notifications for this student or global ones
    const myNotifications = notifications.filter(n => n.studentId === studentId || !n.studentId);

    // Get Science and Engineering Fair deadline
    const scienceAndEngineeringFair = competitions.find(c => c.name === 'Science and Engineering Fair');
    const submissionDeadline = scienceAndEngineeringFair?.endDate;

    const myAssignments = typeof getMyPeerAssignments === 'function' ? getMyPeerAssignments(studentId) : [];
    const pendingAssignments = Array.isArray(myAssignments) ? myAssignments.filter(a => a.status === 'pending') : [];

    const stats = [
        {
            label: 'My Applications',
            value: myRegistrations.length,
            icon: Trophy,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            label: 'Pending',
            value: myRegistrations.filter(s => s.status === 'Pending').length,
            icon: Clock,
            color: 'text-amber-600',
            bg: 'bg-amber-50'
        },
        {
            label: 'Approved',
            value: myRegistrations.filter(s => s.status === 'Approved').length,
            icon: CheckCircle,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-10">
            {/* Header / Welcome Profile */}
            <div className="relative overflow-hidden rounded-3xl border border-white/20 shadow-soft-xl animate-fade-down group">
                {/* Dynamic Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/90 via-purple-600/90 to-indigo-600/90 dark:from-violet-900/90 dark:to-indigo-900/90 z-0"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 mix-blend-overlay"></div>

                {/* Decorative Shapes */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl group-hover:bg-purple-400/30 transition-all duration-700"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 p-8 text-white">
                    <div className="relative">
                        <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-500">
                            <User className="h-12 w-12 sm:h-14 sm:w-14 drop-shadow-lg" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 border-4 border-purple-600 dark:border-purple-900 h-6 w-6 rounded-full"></div>
                    </div>

                    <div className="space-y-2 text-center md:text-left w-full">
                        <div className="space-y-1">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-sm animate-fade-in">
                                Welcome back, {profile.name}!
                            </h1>
                            <p className="text-purple-100 text-sm sm:text-base font-medium max-w-2xl animate-fade-in delay-75">
                                Ready to continue your journey? You have upcoming deadlines to check.
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-3 text-xs sm:text-sm pt-4 animate-fade-in delay-100">
                             <Link 
                                to={`/profile/${studentId}`}
                                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white text-violet-600 font-bold shadow-lg hover:scale-105 transition-all text-sm group/port"
                             >
                                <Sparkles size={16} className="text-amber-500 group-hover/port:rotate-12 transition-transform" />
                                My Public Portfolio
                                <ExternalLink size={14} />
                             </Link>

                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                                <School className="h-3.5 w-3.5" /> {profile.school}
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                                <Mail className="h-3.5 w-3.5" /> {profile.email}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Deadline Timer - Prominent Position */}
            <div className="transform hover:-translate-y-1 transition-transform duration-300">
                <DeadlineTimer title="Science and Engineering Fair Deadline" deadline={submissionDeadline} />
            </div>

            {/* Personal Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-0 shadow-soft hover:shadow-soft-xl transition-all duration-300 hover:-translate-y-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm overflow-hidden group">
                        <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity duration-300 transform group-hover:scale-110 ${stat.color}`}>
                            <stat.icon className="w-24 h-24 -mr-8 -mt-8" />
                        </div>
                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn("p-3 rounded-xl transition-colors duration-300", stat.bg, stat.color)}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <span className={cn("text-xs font-bold px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all")}>
                                    This Year
                                </span>
                            </div>
                            <div>
                                <p className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight group-hover:scale-105 transition-transform origin-left">{stat.value}</p>
                                <p className="text-sm font-medium text-muted-foreground mt-1">{stat.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* PEER REVIEW TASKS (NEW) */}
            {pendingAssignments.length > 0 && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="p-6 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-200/50 dark:border-emerald-900/30 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Star className="h-32 w-32 text-emerald-500 -mr-16 -mt-16" />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 italic uppercase tracking-tight">Peer Review Phase</h2>
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest">Action Required: {pendingAssignments.length} Pending reviews</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pendingAssignments.map(assignment => (
                                    <button
                                        key={assignment.id}
                                        onClick={() => setSelectedAssignment(assignment)}
                                        className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all text-left group/item"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover/item:text-emerald-500 transition-colors">
                                                <FileText size={24} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Assigned Project</p>
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Review Project #{assignment.targetSubmissionId.slice(-4).toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <div className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover/item:bg-emerald-500 group-hover/item:text-white group-hover/item:border-emerald-500 transition-all">
                                            <ArrowRight size={14} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Notifications Section */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <Bell className="h-5 w-5 text-violet-500" />
                            Notifications
                        </h2>
                        {myNotifications.length > 0 && (
                            <Badge variant="secondary" className="bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-300">
                                {myNotifications.length} New
                            </Badge>
                        )}
                    </div>

                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-border shadow-sm p-4 h-full max-h-[500px] overflow-y-auto sidebar-scroll">
                        {myNotifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
                                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-3">
                                    <Bell className="h-6 w-6 text-slate-400" />
                                </div>
                                <p className="text-sm">You're all caught up!</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {myNotifications.slice(0, 5).map((n) => (
                                    <div key={n.id} className={cn(
                                        "relative group p-4 rounded-xl border transition-all duration-300 hover:shadow-md",
                                        n.type === 'success' ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900' :
                                            n.type === 'warning' ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900' :
                                                'bg-white/80 dark:bg-slate-800/80 border-slate-100 dark:border-slate-700'
                                    )}>
                                        <div className="flex gap-3">
                                            <div className={cn(
                                                "mt-1 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 shadow-sm",
                                                n.type === 'success' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400' :
                                                    n.type === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400' :
                                                        'bg-violet-100 text-violet-600 dark:bg-violet-900 dark:text-violet-400'
                                            )}>
                                                {n.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={cn(
                                                    "text-sm font-semibold mb-0.5",
                                                    n.type === 'success' ? 'text-emerald-900 dark:text-emerald-100' :
                                                        n.type === 'warning' ? 'text-amber-900 dark:text-amber-100' :
                                                            'text-slate-900 dark:text-slate-100'
                                                )}>{n.text}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{n.date}</p>
                                            </div>
                                            <button
                                                onClick={() => removeNotification(n.id)}
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-black/5 rounded-full transition-all"
                                                title="Dismiss"
                                            >
                                                <X className="h-3.5 w-3.5 text-slate-400" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* My Competitions List */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* JOURNEY SECTION (NEW) */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-violet-500" />
                            My Journey
                        </h2>
                        <div className="glass-card p-8 rounded-[2rem] border-white/10 shadow-xl overflow-hidden relative">
                             {/* Background Decoration */}
                             <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                             
                             <StudentJourneyTimeline 
                                studentId={studentId}
                                submissions={getStudentSubmissions(studentId)}
                                certificates={getStudentCertificates(studentId)}
                                userTeams={userTeams}
                             />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-amber-500" />
                            My Competitions
                        </h2>

                        {myRegistrations.length === 0 ? (
                            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center bg-slate-50/50 dark:bg-slate-900/50">
                                <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trophy className="h-8 w-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">No competitions yet</h3>
                                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-2 mb-6">You haven't registered for any competitions. Check out the available competitions to get started!</p>
                                <Link 
                                    to="/student/recommendations" 
                                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20"
                                >
                                    Browse Competitions
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {myRegistrations.map((reg) => {
                                    const comp = competitions.find(c => c.name === reg.competition);
                                    return (
                                        <div key={reg.id} className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-violet-200 dark:hover:border-violet-900 transition-all duration-300 overflow-hidden">
                                            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Badge variant="outline" className="bg-white/80 backdrop-blur-sm shadow-sm">{reg.type}</Badge>
                                            </div>

                                            <div className="p-6">
                                                <div className="flex flex-col md:flex-row gap-6">
                                                    {/* Status Indicator Bar */}
                                                    <div className="hidden md:block w-1.5 self-stretch rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                                        <div className={cn(
                                                            "w-full h-full transition-all duration-500",
                                                            reg.status === 'Approved' ? 'bg-emerald-500' :
                                                                reg.status === 'Rejected' ? 'bg-red-500' : 'bg-amber-500'
                                                        )} style={{ height: '100%' }}></div>
                                                    </div>

                                                    <div className="flex-1 space-y-4">
                                                        <div className="flex flex-wrap items-start justify-between gap-4">
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-violet-600 transition-colors">
                                                                        {reg.competition}
                                                                    </h3>
                                                                    <div className="md:hidden h-2.5 w-2.5 rounded-full" style={{
                                                                        backgroundColor: reg.status === 'Approved' ? '#10b981' : reg.status === 'Rejected' ? '#ef4444' : '#f59e0b'
                                                                    }}></div>
                                                                </div>
                                                                <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                                                                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-medium">
                                                                        <Calendar className="h-3.5 w-3.5" />
                                                                        {reg.stage}
                                                                    </span>
                                                                    {reg.projectTitle && (
                                                                        <span className="flex items-center gap-1.5">
                                                                            <BookOpen className="h-3.5 w-3.5" />
                                                                            {reg.projectTitle}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {comp && (
                                                                    <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                                                        <div className="flex items-center justify-between mb-2">
                                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Competition Phase</span>
                                                                            <Badge variant="secondary" className="px-2 py-0.5 text-[10px] uppercase">{comp.phase}</Badge>
                                                                        </div>
                                                                        <CompetitionPhaseSteps currentPhase={comp.phase} />
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center gap-3">
                                                                <div className="text-right">
                                                                    <Badge className={cn("px-3 py-1 text-sm font-semibold capitalize shadow-sm",
                                                                        reg.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200' :
                                                                            reg.status === 'Rejected' ? 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200' :
                                                                                'bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200'
                                                                    )}>
                                                                        {reg.status}
                                                                    </Badge>
                                                                    {reg.result && reg.result !== 'Pending' && reg.result !== '-' && (
                                                                        <div className={cn(
                                                                            "text-xs font-bold mt-1 text-right uppercase tracking-wider",
                                                                            reg.result === 'Passed' ? 'text-emerald-600' : 'text-red-600'
                                                                        )}>
                                                                            {reg.result}
                                                                        </div>
                                                                    )}

                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Results Banner (Published) */}
                                                        {comp?.resultsVisibility === 'Published' && reg.result && reg.result !== '-' && (
                                                            <div className={cn(
                                                                'mt-4 p-4 rounded-2xl border-2 space-y-3',
                                                                reg.result === 'Passed'
                                                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                                                                    : 'bg-red-50   dark:bg-red-900/20   border-red-200   dark:border-red-800'
                                                            )}>
                                                                <div className={cn(
                                                                    'flex items-center gap-2 font-bold text-base',
                                                                    reg.result === 'Passed' ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'
                                                                )}>
                                                                    {reg.result === 'Passed' ? <ThumbsUp size={17} /> : <ThumbsDown size={17} />}
                                                                    {reg.result === 'Passed' ? '🎉 Congratulations! You Passed!' : 'You did not pass this round. Keep going! 💪'}
                                                                </div>
                                                                {(() => {
                                                                    const sc = scores.find(s => s.studentId === reg.id && s.competitionId === comp.id);
                                                                    if (!sc) return null;
                                                                    const cats = [
                                                                        { label: 'Innovation',   val: sc.innovation },
                                                                        { label: 'Design',       val: sc.design },
                                                                        { label: 'Presentation', val: sc.presentation },
                                                                        { label: 'Technical',    val: sc.technical },
                                                                    ];
                                                                    return (
                                                                        <div className='space-y-2 pt-2 border-t border-current/10'>
                                                                            <p className='text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5'>
                                                                                <BarChart3 size={9} /> Score Breakdown
                                                                            </p>
                                                                            {cats.map(c => (
                                                                                <div key={c.label} className='flex items-center gap-2'>
                                                                                    <span className='w-24 text-[11px] text-slate-500 dark:text-slate-400 shrink-0'>{c.label}</span>
                                                                                    <div className='flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden'>
                                                                                        <div className={cn('h-full rounded-full transition-all duration-500', reg.result === 'Passed' ? 'bg-emerald-500' : 'bg-red-400')}
                                                                                            style={{ width: `${(c.val / 10) * 100}%` }} />
                                                                                    </div>
                                                                                    <span className='w-5 text-[11px] font-bold text-slate-700 dark:text-slate-300 text-right'>{c.val}</span>
                                                                                </div>
                                                                            ))}
                                                                            <p className='text-right text-sm font-black text-violet-600 dark:text-violet-400'>Total: {sc.total ?? '—'} / 40</p>
                                                                        </div>
                                                                    );
                                                                })()}
                                                            </div>
                                                        )}

                                                        {/* Abstract + Feedback */}
                                                        {(reg.abstract || reg.feedback) && (
                                                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid gap-4">
                                                                {reg.abstract && (
                                                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                                            <FileText className="h-3 w-3" /> Abstract
                                                                        </h4>
                                                                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">"{reg.abstract}"</p>
                                                                    </div>
                                                                )}

                                                                {reg.feedback && (
                                                                    <div className="bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-100 dark:border-amber-900/50">
                                                                        <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                                            <MessageSquare className="h-3 w-3" /> Latest Feedback
                                                                        </h4>
                                                                        <p className="text-sm text-amber-900 dark:text-amber-100 font-medium">"{reg.feedback}"</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* ── View Timeline CTA ── */}
                                                        {comp && (
                                                            <Link
                                                                to={`/student/competition/${comp.id}`}
                                                                className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-200 transition-colors group/link"
                                                            >
                                                                <ArrowRight size={13} className="group-hover/link:translate-x-0.5 transition-transform" />
                                                                View Competition Timeline
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Peer Review Modal */}
            <Modal
                isOpen={!!selectedAssignment}
                onClose={() => setSelectedAssignment(null)}
                title="Peer Review"
                maxWidth="2xl"
            >
                {selectedAssignment && (
                    <PeerReviewPanel 
                        assignmentId={selectedAssignment.id} 
                        onClose={() => setSelectedAssignment(null)} 
                    />
                )}
            </Modal>
        </div>
    );
};

export default StudentDashboard;
