import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Card, CardTitle, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
    Users, Trophy, CheckCircle, XCircle, Calendar, FileText, Globe, Bell, Eye, X, Mail, School, 
    BookOpen, MessageSquare, Send, FileText as FileTextIcon, User, 
    Paperclip, Github, Video, Image as ImageIcon, ExternalLink, FileCode, Search, LayoutList, Megaphone, ArrowRight
} from 'lucide-react';
import { cn } from '../utils/cn';
import CompetitionCard from '../components/ui/CompetitionCard';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const JudgingPanel = ({ student, competition }) => {
    const { getStudentScore, addScore } = useApp();
    const existingScore = competition ? getStudentScore(student.id, competition.id) : null;
    
    // Default or load existing scores
    const [scores, setScores] = useState({
        innovation: existingScore?.innovation || 0,
        design: existingScore?.design || 0,
        presentation: existingScore?.presentation || 0,
        technical: existingScore?.technical || 0
    });
    const [isSaved, setIsSaved] = useState(false);

    if (!competition) return <div className="p-4 text-amber-600 bg-amber-50 rounded-xl">Competition details not found. Please verify the competition name.</div>;

    // Update individual score fields
    const handleScoreChange = (field, val) => {
        let num = parseInt(val) || 0;
        if (num < 0) num = 0;
        if (num > 10) num = 10;
        setScores(prev => ({ ...prev, [field]: num }));
        setIsSaved(false);
    };

    const totalScore = scores.innovation + scores.design + scores.presentation + scores.technical;

    const handleSave = () => {
        addScore(student.id, competition.id, { ...scores, total: totalScore });
        setIsSaved(true);
    };

    return (
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    Evaluation Rubric
                </div>
                <div className="text-xl font-black text-violet-600 dark:text-violet-400">
                    {totalScore} <span className="text-sm font-medium text-slate-400">/ 40</span>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                {[
                    { key: 'innovation', label: 'Innovation' },
                    { key: 'design', label: 'Design' },
                    { key: 'presentation', label: 'Presentation' },
                    { key: 'technical', label: 'Technical Quality' }
                ].map(item => (
                    <div key={item.key} className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{item.label} (10)</label>
                        <input 
                            type="number" 
                            min="0" max="10"
                            value={scores[item.key]}
                            onChange={(e) => handleScoreChange(item.key, e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>
                ))}
            </div>

            <div className="flex justify-end pt-2">
                <Button onClick={handleSave} size="sm" className="gap-2 shadow-sm relative overflow-hidden group" variant={isSaved ? "outline" : "default"}>
                    {isSaved ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <Send className="h-4 w-4" />}
                    {isSaved ? 'Scores Saved' : 'Save Scores'}
                </Button>
            </div>
        </div>
    );
};

const TabButton = ({ id, label, icon: iconProp, activeTab, setActiveTab }) => {
    const Icon = iconProp;
    return (
        <button
            onClick={() => setActiveTab(id)}
            className={cn(
                "flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all w-full md:w-auto min-w-[120px]",
                activeTab === id
                    ? "bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-sm border border-slate-200 dark:border-slate-700"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
        >
            <Icon className={cn("h-4 w-4 shrink-0 transition-colors", activeTab === id ? "text-violet-600 dark:text-violet-400" : "")} />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label === 'Competitions' ? 'Comps' : label}</span>
        </button>
    );
};

const AdminDashboard = () => {
    const { students, competitions, submissions, notifications, removeNotification, updateStudentStatus, updateStudentStage, setStudentResult, setStudentFeedback } = useApp();
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);

    // Feedback State
    const [feedback, setFeedback] = useState('');

    // Confirmation Dialog State
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        type: 'warning'
    });

    // Filter states for Students Tab
    const [filterGrade, setFilterGrade] = useState('');
    const [filterCompetition, setFilterCompetition] = useState('');
    const [filterResult, setFilterResult] = useState('');

    const filteredStudents = students.filter(s => {
        return (
            (!filterGrade || s.grade === filterGrade) &&
            (!filterCompetition || s.competition === filterCompetition) &&
            (!filterResult || (filterResult === 'Passed' && s.result === 'Passed') || (filterResult === 'Failed' && s.result === 'Failed'))
        );
    });

    const stats = [
        { title: 'Total Students', value: students.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { title: 'Competitions', value: competitions.length, icon: Trophy, color: 'text-purple-600', bg: 'bg-purple-100' },
        { title: 'Passed Students', value: students.filter(s => s.result === 'Passed').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { title: 'Failed Students', value: students.filter(s => s.result === 'Failed').length, icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
    ];

    const handleSendFeedback = () => {
        if (!feedback.trim()) return;
        setStudentFeedback(selectedStudent.id, feedback);
        setFeedback('');
        // Close modal or show success? Let's just reset for now and maybe close
        setSelectedStudent(null);
    };

    // Confirmation handlers
    const handleApprove = (student) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Approve Registration',
            message: `Are you sure you want to approve ${student.name}'s registration for ${student.competition}? The student will be notified.`,
            onConfirm: () => updateStudentStatus(student.id, 'Approved'),
            type: 'success'
        });
    };

    const handleReject = (student) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Reject Registration',
            message: `Are you sure you want to reject ${student.name}'s registration for ${student.competition}? The student will be notified.`,
            onConfirm: () => updateStudentStatus(student.id, 'Rejected'),
            type: 'danger'
        });
    };

    const handlePass = (student) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Mark as Passed',
            message: `Are you sure you want to mark ${student.name} as PASSED for ${student.competition}? This action will notify the student.`,
            onConfirm: () => setStudentResult(student.id, 'Passed'),
            type: 'success'
        });
    };

    const handleFail = (student) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Mark as Failed',
            message: `Are you sure you want to mark ${student.name} as FAILED for ${student.competition}? This action will notify the student.`,
            onConfirm: () => setStudentResult(student.id, 'Failed'),
            type: 'danger'
        });
    };


    return (
        <div className="space-y-6 sm:space-y-8 relative">
            {/* Header */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">Admin Dashboard</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage students, competitions, and submissions</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <div className="relative shrink-0">
                            <button
                                className={cn(
                                    "p-2.5 rounded-full relative transition-all duration-200",
                                    showNotifications
                                        ? "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400"
                                        : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700"
                                )}
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <Bell className="h-5 w-5" />
                                {notifications.length > 0 && (
                                    <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                                )}
                            </button>

                            {showNotifications && (
                                <>
                                    <div className="fixed inset-0 z-[9999] bg-black/20 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none" onClick={() => setShowNotifications(false)}></div>
                                    <div className="fixed top-20 left-4 right-4 z-[10000] lg:absolute lg:top-12 lg:right-0 lg:left-auto lg:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2 lg:slide-in-from-top-1 ring-1 ring-black/5">
                                        <div className="p-4 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 font-semibold text-sm text-slate-900 dark:text-slate-100 flex justify-between items-center">
                                            <span>Notifications</span>
                                            {notifications.length > 0 && (
                                                <Badge variant="secondary" className="ml-2 text-xs">
                                                    {notifications.length} New
                                                </Badge>
                                            )}
                                            <button onClick={() => setShowNotifications(false)} className="lg:hidden p-1 hover:bg-slate-200 rounded-full">
                                                <X className="h-4 w-4 text-slate-500" />
                                            </button>
                                        </div>
                                        <div className="max-h-[60vh] lg:max-h-[400px] overflow-y-auto sidebar-scroll">
                                            {notifications.length === 0 ? (
                                                <div className="p-8 text-center flex flex-col items-center gap-3">
                                                    <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                        <Bell className="h-6 w-6 text-slate-400" />
                                                    </div>
                                                    <p className="text-sm text-slate-500">No new notifications</p>
                                                </div>
                                            ) : (
                                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                                    {notifications.map(n => (
                                                        <div key={n.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-start gap-3 group relative">
                                                            <div className="mt-1 h-2 w-2 rounded-full bg-violet-500 shrink-0"></div>
                                                            <div className="flex-1 min-w-0 space-y-1">
                                                                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{n.text}</p>
                                                                <p className="text-xs text-slate-400 dark:text-slate-500">{n.date}</p>
                                                            </div>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); removeNotification(n.id); }}
                                                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all text-slate-400 hover:text-slate-600"
                                                                title="Remove"
                                                            >
                                                                <X className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex p-1.5 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl w-full sm:w-auto self-start gap-1 overflow-x-auto max-w-full">
                    <TabButton id="overview" label="Overview" icon={FileText} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="students" label="Students" icon={Users} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="competitions" label="Competitions" icon={Trophy} activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, i) => (
                            <Card key={i} className="border-0 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={cn("p-3 rounded-xl transition-all duration-300 group-hover:scale-110", stat.bg, stat.color)}>
                                            <stat.icon className="h-6 w-6" />
                                        </div>
                                        <div className={cn("text-xs font-bold px-2 py-1 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400")}>
                                            Total
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">{stat.value}</p>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{stat.title}</p>
                                    </div>
                                </CardContent>
                                <div className={cn("h-1 w-full", stat.color.replace('text-', 'bg-'))}></div>
                            </Card>
                        ))}
                    </div>

                    {/* Quick Actions / New Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                         <Link to="/admin/announcements" className="group">
                             <div className="glass-card p-8 rounded-[2.5rem] border-white/10 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 relative overflow-hidden bg-gradient-to-br from-violet-600 to-indigo-700 text-white">
                                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                                 <div className="relative z-10 flex items-center gap-6">
                                     <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                                         <Megaphone size={32} />
                                     </div>
                                     <div>
                                         <h3 className="text-xl font-bold mb-1 tracking-tight">Broadcast Center</h3>
                                         <p className="text-white/70 text-sm">Send smart announcements to all students.</p>
                                     </div>
                                     <ArrowRight className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                                 </div>
                             </div>
                         </Link>

                         <Link to="/admin/create-competition" className="group">
                             <div className="glass-card p-8 rounded-[2.5rem] border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 relative overflow-hidden bg-white dark:bg-slate-900">
                                 <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                 <div className="relative z-10 flex items-center gap-6">
                                     <div className="h-16 w-16 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600">
                                         <Trophy size={32} />
                                     </div>
                                     <div>
                                         <h3 className="text-xl font-bold mb-1 tracking-tight text-slate-900 dark:text-slate-100">New Competition</h3>
                                         <p className="text-slate-500 text-sm">Launch a new innovation cycle.</p>
                                     </div>
                                     <ArrowRight className="ml-auto text-violet-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                                 </div>
                             </div>
                         </Link>
                    </div>
                </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800 px-6 pt-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="text-lg font-bold">Student Management</CardTitle>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Filter and manage student registrations</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => { setFilterGrade(''); setFilterCompetition(''); setFilterResult(''); }} className="gap-2">
                                    <XCircle className="h-4 w-4" /> Reset Filters
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Competition</label>
                                    <select
                                        className="flex h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                                        value={filterCompetition}
                                        onChange={(e) => setFilterCompetition(e.target.value)}
                                    >
                                        <option value="">All Competitions</option>
                                        {competitions.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Grade</label>
                                    <select
                                        className="flex h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                                        value={filterGrade}
                                        onChange={(e) => setFilterGrade(e.target.value)}
                                    >
                                        <option value="">All Grades</option>
                                        {[9, 10, 11, 12].map(g => <option key={g} value={String(g)}>{g}th Grade</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Result</label>
                                    <select
                                        className="flex h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                                        value={filterResult}
                                        onChange={(e) => setFilterResult(e.target.value)}
                                    >
                                        <option value="">All Results</option>
                                        <option value="Passed">Passed</option>
                                        <option value="Failed">Failed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm text-slate-500 dark:text-slate-400 uppercase text-xs tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                                            <tr>
                                                <th className="px-6 py-4">Student</th>
                                                <th className="px-6 py-4">Competition</th>
                                                <th className="px-6 py-4 hidden md:table-cell">Stage</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 hidden lg:table-cell">Result</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                                            {filteredStudents.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-16 text-center">
                                                        <div className="flex flex-col items-center justify-center gap-2">
                                                            <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                                <Users className="h-5 w-5 text-slate-400" />
                                                            </div>
                                                            <p className="text-slate-500 dark:text-slate-400 font-medium">No students found matching filters</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredStudents.map((student) => {
                                                    const competition = competitions.find(c => c.name === student.competition);
                                                    return (
                                                        <tr key={student.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="font-semibold text-slate-900 dark:text-slate-100">{student.name}</div>
                                                                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity">{student.id}</div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="font-medium text-slate-700 dark:text-slate-300">{student.competition}</div>
                                                            </td>
                                                            <td className="px-6 py-4 hidden md:table-cell">
                                                                {competition && (
                                                                    <select
                                                                        className="rounded-lg border border-slate-200 bg-white text-xs py-1.5 pl-2.5 pr-8 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 cursor-pointer hover:border-violet-300 transition-colors"
                                                                        value={student.stage}
                                                                        onChange={(e) => updateStudentStage(student.id, e.target.value)}
                                                                    >
                                                                        {competition.stages.map(stage => (
                                                                            <option key={stage} value={stage}>{stage}</option>
                                                                        ))}
                                                                        <option value="Registration">Registration</option>
                                                                    </select>
                                                                )}
                                                                {!competition && <span>{student.stage}</span>}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <Badge variant={
                                                                    student.status === 'Approved' ? 'success' :
                                                                        student.status === 'Rejected' ? 'destructive' : 'warning'
                                                                } className="shadow-sm">
                                                                    {student.status}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-6 py-4 hidden lg:table-cell">
                                                                <span className={cn(
                                                                    "font-bold text-xs uppercase tracking-wide px-2 py-1 rounded-md",
                                                                    student.result === 'Passed' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30' :
                                                                        student.result === 'Failed' ? 'bg-red-50 text-red-600 dark:bg-red-900/30' : 'text-slate-400'
                                                                )}>
                                                                    {student.result}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <Button size="sm" variant="secondary" className="h-8 gap-1.5 font-medium shadow-sm" onClick={() => setSelectedStudent(student)}>
                                                                        <Eye className="h-3.5 w-3.5" /> <span className="hidden xl:inline">View</span>
                                                                    </Button>

                                                                    {student.status === 'Pending' && (
                                                                        <>
                                                                            <Button size="sm" className="h-8 w-8 p-0 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700 border border-emerald-200 shadow-sm" onClick={() => handleApprove(student)} title="Approve">
                                                                                <CheckCircle className="h-4 w-4" />
                                                                            </Button>
                                                                            <Button size="sm" className="h-8 w-8 p-0 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 border border-red-200 shadow-sm" onClick={() => handleReject(student)} title="Reject">
                                                                                <XCircle className="h-4 w-4" />
                                                                            </Button>
                                                                        </>
                                                                    )}

                                                                    {student.status === 'Approved' && (
                                                                        <>
                                                                            <Button size="sm" className={cn("h-8 px-3 gap-1", student.result === 'Passed' ? "bg-emerald-100 text-emerald-700 cursor-default" : "text-emerald-600 bg-white border border-emerald-200 hover:bg-emerald-50")} onClick={() => student.result !== 'Passed' && handlePass(student)} title="Mark as Passed">
                                                                                <CheckCircle className="h-3.5 w-3.5" /> <span className="hidden xl:inline">Pass</span>
                                                                            </Button>
                                                                            <Button size="sm" className={cn("h-8 px-3 gap-1", student.result === 'Failed' ? "bg-red-100 text-red-700 cursor-default" : "text-red-600 bg-white border border-red-200 hover:bg-red-50")} onClick={() => student.result !== 'Failed' && handleFail(student)} title="Mark as Failed">
                                                                                <XCircle className="h-3.5 w-3.5" /> <span className="hidden xl:inline">Fail</span>
                                                                            </Button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Competitions Tab */}
            {activeTab === 'competitions' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {competitions.map((comp) => (
                            <div key={comp.id} className="flex flex-col gap-0">
                                <CompetitionCard
                                    competition={comp}
                                    showActions={false}
                                />
                                <Link
                                    to={`/admin/competition/${comp.id}/timeline`}
                                    className="flex items-center justify-center gap-2 py-2.5 rounded-b-2xl -mt-1 border border-t-0 border-slate-200 dark:border-slate-800 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 text-sm font-bold hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors group"
                                >
                                    <LayoutList size={14} className="group-hover:scale-110 transition-transform" />
                                    Manage Timeline
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Student Details Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-2xl bg-white dark:bg-slate-900 shadow-2xl max-h-[90vh] overflow-y-auto border-0 ring-1 ring-white/10">
                        <div className="sticky top-0 z-10 flex items-start justify-between p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                                    <User className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{selectedStudent.name}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="font-mono text-xs">{selectedStudent.id}</Badge>
                                        <Badge variant={
                                            selectedStudent.status === 'Approved' ? 'success' :
                                                selectedStudent.status === 'Rejected' ? 'destructive' : 'warning'
                                        }>
                                            {selectedStudent.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedStudent(null)} className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <CardContent className="p-0 space-y-0">
                            {/* Modal Header/Profile already handled above, but let's make it look better */}
                            <div className="p-6 space-y-6">
                            {/* Personal Info */}
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                <div className="space-y-1.5">
                                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <School className="h-3.5 w-3.5" /> School
                                    </div>
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100 pl-5">
                                        {selectedStudent.school}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <Mail className="h-3.5 w-3.5" /> Email
                                    </div>
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100 pl-5">
                                        {selectedStudent.email}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <BookOpen className="h-3.5 w-3.5" /> Grade / Class
                                    </div>
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100 pl-5">
                                        {selectedStudent.grade}th Grade • Class {selectedStudent.clazz}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <Users className="h-3.5 w-3.5" /> Team
                                    </div>
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100 pl-5">
                                        {Array.isArray(selectedStudent.members) 
                                            ? selectedStudent.members.map(m => m.name).join(', ') 
                                            : (selectedStudent.members || 'Individual Entry')}
                                    </div>
                                </div>
                            </div>

                            {/* Project & Submission Details */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 px-1">
                                    <Trophy className="h-4 w-4 text-violet-500" />
                                    Project Submission
                                </h3>

                                {(() => {
                                    const submission = submissions.find(s => s.studentId === selectedStudent.id);
                                    if (!submission) return (
                                        <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 text-sm italic">
                                            No submission found for this student yet.
                                        </div>
                                    );

                                    return (
                                        <div className="space-y-5">
                                            {/* Report Section */}
                                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{submission.title}</h4>
                                                    <Badge variant="secondary" className="capitalize">{submission.category || 'General'}</Badge>
                                                </div>
                                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                                        {submission.description || "No technical report provided."}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Files Section */}
                                            {submission.files && submission.files.length > 0 && (
                                                <div className="space-y-3">
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                        <Paperclip className="h-3 w-3" /> ATTACHED ASSETS ({submission.files.length})
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {submission.files.map((file, idx) => {
                                                            const fileName = file.name || file;
                                                            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
                                                            const isVideo = /\.(mp4|mov|avi|wmv)$/i.test(fileName);
                                                            const isPdf = /\.pdf$/i.test(fileName);

                                                            return (
                                                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 group hover:border-violet-200 transition-all shadow-sm">
                                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                                        <div className={cn(
                                                                            "p-2 rounded-lg",
                                                                            isImage ? "bg-blue-50 text-blue-500" :
                                                                            isVideo ? "bg-amber-50 text-amber-500" :
                                                                            isPdf ? "bg-red-50 text-red-500" : "bg-slate-50 text-slate-500"
                                                                        )}>
                                                                            {isImage && <ImageIcon size={14} />}
                                                                            {isVideo && <Video size={14} />}
                                                                            {isPdf && <FileTextIcon size={14} />}
                                                                            {!isImage && !isVideo && !isPdf && <FileCode size={14} />}
                                                                        </div>
                                                                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{fileName}</span>
                                                                    </div>
                                                                    <button className="text-slate-400 group-hover:text-violet-500 p-1.5 transition-colors">
                                                                        <ExternalLink size={14} />
                                                                    </button>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Code Preview Section */}
                                            {submission.codeSnippet && (
                                                <div className="space-y-3">
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                        <Github className="h-3 w-3" /> CODE PREVIEW
                                                    </div>
                                                    <div className="relative group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-xl">
                                                        <div className="absolute top-0 left-0 w-full h-8 bg-slate-800/50 flex items-center justify-between px-4 border-b border-slate-700/50">
                                                            <div className="flex gap-1.5">
                                                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                                                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                                                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                                                            </div>
                                                            <span className="text-[10px] font-mono text-slate-400">main{submission.codeExt || '.js'}</span>
                                                        </div>
                                                        <pre className="p-6 pt-12 text-xs font-mono text-slate-300 overflow-x-auto sidebar-scroll leading-relaxed">
                                                            <code>{submission.codeSnippet}</code>
                                                        </pre>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex flex-wrap gap-3 mt-6">
                                                <Link
                                                    to={`/admin/submission/${submission.id}`}
                                                    className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 text-xs font-bold text-white px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-500/20 transition-all active:scale-95"
                                                >
                                                    <Search size={14} /> View Full Details
                                                </Link>
                                                
                                                {submission.url && (
                                                    <a 
                                                        href={submission.url.startsWith('http') ? submission.url : `https://${submission.url}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 active:scale-95"
                                                    >
                                                        {submission.type === 'github' ? <Github size={14} /> : <Globe size={14} />} 
                                                        Launch Live
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Feedback & Messaging */}
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                                        <MessageSquare className="h-4 w-4 text-violet-500" />
                                        Feedback & Messages
                                    </div>
                                </div>
                                <div className="relative">
                                    <textarea
                                        className="w-full min-h-[120px] p-4 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all dark:bg-slate-900 dark:border-slate-700 resize-none shadow-sm"
                                        placeholder={`Write feedback for ${selectedStudent.name}. They will see this on their dashboard.`}
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                    ></textarea>
                                    <div className="absolute bottom-3 right-3">
                                        <Button size="sm" onClick={handleSendFeedback} disabled={!feedback.trim()} className="gap-2 shadow-sm">
                                            <Send className="h-3.5 w-3.5" /> Send
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            </div>
                        </CardContent>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                            <Button variant="outline" onClick={() => setSelectedStudent(null)}>Close Details</Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Confirmation Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                onConfirm={confirmDialog.onConfirm}
                title={confirmDialog.title}
                message={confirmDialog.message}
                type={confirmDialog.type}
                confirmText="Confirm Action"
                cancelText="Cancel"
            />
        </div>
    );
};

export default AdminDashboard;
