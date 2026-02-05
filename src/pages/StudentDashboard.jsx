import React from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Trophy, Clock, CheckCircle, Calendar, User, MessageSquare, School, Mail, BookOpen, Bell } from 'lucide-react';
import { cn } from '../utils/cn';
import DeadlineTimer from '../components/ui/DeadlineTimer';

const StudentDashboard = () => {
    const { students, notifications } = useApp();

    // Mock Logged-in User - Dynamic Fetch
    const mockName = "Alice Johnson";
    const profile = students.find(s => s.name === mockName) || {
        name: mockName,
        grade: "10",
        clazz: "A",
        school: "Lincoln High",
        email: "alice.johnson@lincoln.edu"
    };

    // Filter registrations for this specific student
    const myRegistrations = students.filter(s => s.name === mockName);

    // Get current student ID
    const studentId = myRegistrations[0]?.id;

    // Filter notifications for this student or global ones
    const myNotifications = notifications.filter(n => n.studentId === studentId || !n.studentId);

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
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
            {/* Header / Welcome Profile */}
            <div className="flex flex-col md:flex-row items-center md:items-center gap-4 sm:gap-6 bg-card text-card-foreground p-4 sm:p-6 md:p-8 rounded-2xl border border-border shadow-soft text-center md:text-left">
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-lg">
                    <User className="h-10 sm:h-12 w-10 sm:w-12" />
                </div>
                <div className="space-y-1 w-full md:w-auto">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Welcome back, {profile.name}!</h1>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center md:justify-start gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <span className="flex items-center justify-center sm:justify-start gap-1.5"><School className="h-4 w-4" /> {profile.school}</span>
                        <span className="hidden sm:flex items-center gap-1.5"><Mail className="h-4 w-4" /> {profile.email}</span>
                        <span className="px-3 py-1.5 bg-primary/10 rounded-xl text-primary font-semibold text-xs">Class {profile.clazz} • Grade {profile.grade}</span>
                    </div>
                </div>
            </div>

            {/* Deadline Timer - Prominent Position */}
            <DeadlineTimer title="Science Fair Submission Deadline" />

            {/* Personal Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-border card-hover">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-muted-foreground">{stat.label}</p>
                                <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                            </div>
                            <div className={cn("p-4 rounded-2xl", stat.bg, stat.color)}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Notifications Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Recent Notifications
                </h2>
                
                {myNotifications.length === 0 ? (
                    <Card className="bg-muted border-dashed">
                        <CardContent className="py-8 text-center text-muted-foreground text-sm">
                            No notifications to show.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {myNotifications.slice(0, 3).map((n) => (
                            <div key={n.id} className={cn(
                                "flex items-start gap-3 p-4 rounded-xl border transition-all",
                                n.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-100 dark:border-emerald-800' :
                                n.type === 'warning' ? 'bg-amber-50 dark:bg-amber-950 border-amber-100 dark:border-amber-800' :
                                'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                            )}>
                                <div className={cn(
                                    "p-2 rounded-lg shrink-0",
                                    n.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                                    n.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                                    'bg-primary-100 text-primary-600'
                                )}>
                                    {n.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                                </div>
                                <div className="flex-1">
                                    <p className={cn(
                                        "text-sm font-medium",
                                        n.type === 'success' ? 'text-emerald-900 dark:text-emerald-100' :
                                        n.type === 'warning' ? 'text-amber-900 dark:text-amber-100' :
                                        'text-slate-900 dark:text-slate-100'
                                    )}>{n.text}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{n.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* My Competitions List */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground">My Competitions</h2>
                
                {myRegistrations.length === 0 ? (
                    <Card className="bg-muted border-dashed">
                        <CardContent className="py-12 text-center text-muted-foreground">
                            <Trophy className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                            <p>You haven't registered for any competitions yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6">
                        {myRegistrations.map((reg) => (
                            <Card key={reg.id} className="card-hover group overflow-hidden">
                                <CardContent className="p-0">
                                    {/* Project Header */}
                                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-primary-600 transition-colors">
                                                    {reg.competition}
                                                </h3>
                                                <Badge variant="outline" className="text-xs">
                                                    {reg.type}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    Current Stage: <span className="font-semibold text-slate-700 dark:text-slate-300 ml-1">{reg.stage}</span>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="text-right mr-2">
                                                <div className="text-xs text-slate-500">Result</div>
                                                 <span className={cn(
                                                    "font-bold",
                                                    reg.result === 'Passed' ? 'text-emerald-600' :
                                                    reg.result === 'Failed' ? 'text-red-600' : 'text-slate-400'
                                                )}>
                                                    {reg.result}
                                                </span>
                                            </div>
                                            <Badge className="h-8 px-3 text-sm" variant={
                                                reg.status === 'Approved' ? 'success' :
                                                reg.status === 'Rejected' ? 'destructive' : 'warning'
                                            }>
                                                {reg.status}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 space-y-4">
                                        {/* Project Info */}
                                        {reg.projectTitle && (
                                            <div className="flex gap-4">
                                                <div className="mt-1"><BookOpen className="h-5 w-5 text-primary-500" /></div>
                                                <div className="space-y-1">
                                                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Project: {reg.projectTitle}</h4>
                                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{reg.abstract}</p>
                                                    {reg.mentor && <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Mentor: {reg.mentor}</p>}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Feedback Info */}
                                        {reg.feedback && (
                                            <div className="flex gap-4 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-100 dark:border-amber-800">
                                                <div className="mt-1"><MessageSquare className="h-5 w-5 text-amber-500 dark:text-amber-400" /></div>
                                                <div className="space-y-1">
                                                    <h4 className="font-semibold text-amber-900 dark:text-amber-100 text-sm">Judge Feedback</h4>
                                                    <p className="text-sm text-amber-800 dark:text-amber-200 italic">"{reg.feedback}"</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {!reg.projectTitle && !reg.feedback && (
                                            <div className="text-sm text-slate-400 dark:text-slate-500 italic pl-9">No additional details available for this entry.</div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
