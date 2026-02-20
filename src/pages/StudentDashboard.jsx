import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Trophy, Clock, CheckCircle, Calendar, User, MessageSquare, School, Mail, BookOpen, Bell, X, FileText } from 'lucide-react';
import { cn } from '../utils/cn';
import DeadlineTimer from '../components/ui/DeadlineTimer';

const StudentDashboard = () => {
    const { submissions, notifications, removeNotification, competitions } = useApp();
    const { user } = useAuth();

    // Use logged-in user data
    const profile = {
        name: user?.name || "Student",
        email: user?.email || "",
        grade: user?.grade || "-",
        clazz: user?.clazz || "-",
        school: user?.school || "Student Account"
    };

    // Use submissions from context
    const myRegistrations = submissions || [];

    // Get current student ID
    const studentId = user?._id;

    // Filter notifications for this student or global ones
    const myNotifications = (notifications || []).filter(n => n.studentId === studentId || !n.studentId);

    // Pick the nearest upcoming competition deadline (if any)
    const now = new Date();
    const upcomingCompetitions = (competitions || [])
        .map(c => ({
            ...c,
            deadlineDate: c.endDate ? new Date(c.endDate) : null,
        }))
        .filter(c => c.deadlineDate && c.deadlineDate.getTime() > now.getTime())
        .sort((a, b) => a.deadlineDate.getTime() - b.deadlineDate.getTime());

    const nextCompetition = upcomingCompetitions[0];
    const submissionDeadline = nextCompetition?.endDate;

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
            value: myRegistrations.filter(s => s.status === 'pending').length,
            icon: Clock,
            color: 'text-amber-600',
            bg: 'bg-amber-50'
        },
        {
            label: 'Approved',
            value: myRegistrations.filter(s => s.status === 'approved').length,
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

                        <div className="flex flex-wrap justify-center md:justify-start gap-3 text-xs sm:text-sm pt-2 animate-fade-in delay-100">
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                                <School className="h-3.5 w-3.5" /> {profile.school}
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                                <Mail className="h-3.5 w-3.5" /> {profile.email}
                            </span>
                            <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 text-emerald-100 font-semibold text-xs">
                                Class {profile.clazz} • Grade {profile.grade}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Deadline Timer - Prominent Position */}
            <div className="transform hover:-translate-y-1 transition-transform duration-300">
                <DeadlineTimer
                    title={nextCompetition ? `${nextCompetition.name} Deadline` : 'Next Competition Deadline'}
                    deadline={submissionDeadline}
                />
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
                <div className="lg:col-span-2 space-y-4">
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
                            <a href="#" className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20">
                                Browse Competitions
                            </a>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {myRegistrations.map((reg) => (
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
                                                    reg.status === 'approved' ? 'bg-emerald-500' :
                                                        reg.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'
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
                                                            backgroundColor: reg.status === 'approved' ? '#10b981' : reg.status === 'rejected' ? '#ef4444' : '#f59e0b'
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
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <div className="text-right">
                                                            <Badge className={cn("px-3 py-1 text-sm font-semibold capitalize shadow-sm",
                                                                reg.status === 'approved' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200' :
                                                                    reg.status === 'rejected' ? 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200' :
                                                                        'bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200'
                                                            )}>
                                                                {reg.status}
                                                            </Badge>
                                                            {reg.result && reg.result !== 'Pending' && (
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

                                                {/* Expanded Details Section */}
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
