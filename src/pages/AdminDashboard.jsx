import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardTitle, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Users, Trophy, CheckCircle, XCircle, Calendar, FileText, Globe, Bell, Eye, X, Mail, School, BookOpen, MessageSquare, Send } from 'lucide-react';
import { cn } from '../utils/cn';
import CompetitionCard from '../components/ui/CompetitionCard';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const AdminDashboard = () => {
    const { students, competitions, notifications, updateStudentStatus, updateStudentStage, setStudentResult, setStudentFeedback } = useApp();
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
        onConfirm: () => {},
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

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={cn(
                "flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all w-full",
                activeTab === id 
                    ? "bg-white text-primary-700 shadow-sm border border-slate-200" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            )}
        >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label === 'Competitions' ? 'Comps' : label}</span>
        </button>
    );

    return (
        <div className="space-y-6 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center justify-between md:justify-start">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Admin Dashboard</h1>
                    {/* Mobile Notification Bell moved here for better access or keep it in the main bar? 
                        Let's keep the user's design but center things. 
                        Actually, typical mobile design: Title on left, actions on right?
                        Or stacked. The previous design stacked.
                    */}
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-4">
                         {/* Notifications */}
                                <div className="relative shrink-0">
                            <button 
                                className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative"
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <Bell className="h-5 w-5" />
                                {notifications.length > 0 && (
                                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                                )}
                            </button>
                            
                            {showNotifications && (
                                <>
                                    <div className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none" onClick={() => setShowNotifications(false)}></div>
                                    <div className="fixed top-20 left-4 right-4 z-[100] lg:absolute lg:top-auto lg:left-auto lg:right-0 lg:mt-2 lg:w-80 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2 lg:slide-in-from-top-1">
                                        <div className="p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 font-medium text-sm text-slate-700 dark:text-slate-200 flex justify-between items-center">
                                            Notifications
                                            <button onClick={() => setShowNotifications(false)} className="lg:hidden p-1 hover:bg-slate-200 rounded">
                                                <X className="h-4 w-4 text-slate-500" />
                                            </button>
                                        </div>
                                        <div className="max-h-[60vh] lg:max-h-64 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-4 text-center text-xs text-slate-500">No new notifications</div>
                                            ) : (
                                                notifications.map(n => (
                                                    <div key={n.id} className="p-3 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                                        <p className="text-sm text-slate-800 dark:text-slate-100">{n.text}</p>
                                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{n.date}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex p-1 bg-slate-100/80 rounded-lg w-full sm:w-auto grid grid-cols-3 sm:flex">
                            <TabButton id="overview" label="Overview" icon={FileText} />
                            <TabButton id="students" label="Students" icon={Users} />
                            <TabButton id="competitions" label="Competitions" icon={Trophy} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                         {stats.map((stat, i) => (
                            <Card key={i}>
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                                        <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-2">{stat.value}</p>
                                    </div>
                                    <div className={cn("p-3 rounded-full", stat.bg, stat.color)}>
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <Card>
                        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Filter Students</CardTitle>
                                <Button variant="ghost" size="sm" onClick={() => { setFilterGrade(''); setFilterCompetition(''); setFilterResult(''); }}>Reset</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <select
                                className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                                value={filterCompetition}
                                onChange={(e) => setFilterCompetition(e.target.value)}
                            >
                                <option value="">All Competitions</option>
                                {competitions.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                            <select
                                className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                                value={filterGrade}
                                onChange={(e) => setFilterGrade(e.target.value)}
                            >
                                <option value="">All Grades</option>
                                {[9, 10, 11, 12].map(g => <option key={g} value={String(g)}>{g}th Grade</option>)}
                            </select>
                            <select
                                className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                                value={filterResult}
                                onChange={(e) => setFilterResult(e.target.value)}
                            >
                                <option value="">All Results</option>
                                <option value="Passed">Passed</option>
                                <option value="Failed">Failed</option>
                            </select>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 uppercase border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">ID & Name</th>
                                        <th className="px-6 py-3 font-semibold">Competition</th>
                                        <th className="px-6 py-3 font-semibold hidden md:table-cell">Stage</th>
                                        <th className="px-6 py-3 font-semibold">Status</th>
                                        <th className="px-6 py-3 font-semibold hidden lg:table-cell">Result</th>
                                        <th className="px-6 py-3 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                                    {filteredStudents.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                                                No students found matching filters
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredStudents.map((student) => {
                                            const competition = competitions.find(c => c.name === student.competition);
                                            return (
                                                <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-50">
                                                        <div>{student.name}</div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{student.id}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{student.competition}</td>
                                                    <td className="px-6 py-4 hidden md:table-cell">
                                                        {competition && (
                                                            <select
                                                                className="rounded border border-slate-200 bg-white text-xs py-1 pl-2 pr-6 focus:ring-1 focus:ring-primary-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
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
                                                        }>
                                                            {student.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 hidden lg:table-cell">
                                                        <span className={cn(
                                                            "font-medium",
                                                            student.result === 'Passed' ? 'text-emerald-600' :
                                                            student.result === 'Failed' ? 'text-red-600' : 'text-slate-400'
                                                        )}>
                                                            {student.result}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-1.5 min-w-[100px]">
                                                            <Button size="sm" variant="secondary" className="h-7 w-full text-xs" onClick={() => setSelectedStudent(student)}>
                                                                <Eye className="h-3 w-3 mr-1" /> View
                                                            </Button>
                                                            {student.status === 'Pending' && (
                                                                <div className="flex gap-1">
                                                                    <Button size="sm" variant="ghost" className="h-7 px-2 flex-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={() => handleApprove(student)}>Approve</Button>
                                                                    <Button size="sm" variant="ghost" className="h-7 px-2 flex-1 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleReject(student)}>Reject</Button>
                                                                </div>
                                                            )}
                                                            {student.status === 'Approved' && (
                                                                <div className="flex gap-1">
                                                                    <Button size="sm" variant="ghost" className="h-7 px-2 flex-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={() => handlePass(student)}>Pass</Button>
                                                                    <Button size="sm" variant="ghost" className="h-7 px-2 flex-1 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleFail(student)}>Fail</Button>
                                                                </div>
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
                    </Card>
                </div>
            )}

            {/* Competitions Tab */}
            {activeTab === 'competitions' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {competitions.map((comp) => (
                            <CompetitionCard
                                key={comp.id}
                                competition={comp}
                                showActions={false}
                            />
                        ))}
                    </div>
                </div>
            )}
            
            {/* Student Details Modal */}
            {selectedStudent && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-start justify-between p-6 border-b border-slate-100">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{selectedStudent.name}</h2>
                                <p className="text-sm text-slate-500 font-mono mt-1">{selectedStudent.id}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedStudent(null)}>
                                 <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <CardContent className="p-6 space-y-6">
                            {/* Personal Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="text-xs font-medium text-slate-500 uppercase">School</div>
                                    <div className="flex items-center gap-2 text-sm text-slate-900">
                                        <School className="h-4 w-4 text-slate-400" />
                                        {selectedStudent.school}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs font-medium text-slate-500 uppercase">Email</div>
                                    <div className="flex items-center gap-2 text-sm text-slate-900">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                        {selectedStudent.email}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs font-medium text-slate-500 uppercase">Grade / Class</div>
                                    <div className="text-sm text-slate-900">{selectedStudent.grade}th Grade • Class {selectedStudent.clazz}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs font-medium text-slate-500 uppercase">Status</div>
                                    <Badge variant={
                                        selectedStudent.status === 'Approved' ? 'success' :
                                        selectedStudent.status === 'Rejected' ? 'destructive' : 'warning'
                                    }>
                                        {selectedStudent.status}
                                    </Badge>
                                </div>
                            </div>
                            
                            {/* Team Info */}
                            {selectedStudent.members && (
                                <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                                    <div className="text-xs font-medium text-blue-600 uppercase mb-2">Team Members</div>
                                    <p className="text-sm text-slate-700">{selectedStudent.members}</p>
                                </div>
                            )}

                            {/* Project Details */}
                            {selectedStudent.projectTitle ? (
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                                    <div className="flex items-center gap-2 text-primary-700 font-semibold">
                                        <BookOpen className="h-4 w-4" />
                                        Project Details
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-900">{selectedStudent.projectTitle}</div>
                                        {selectedStudent.mentor && <div className="text-xs text-slate-500 mt-1">Mentor: {selectedStudent.mentor}</div>}
                                    </div>
                                    {selectedStudent.abstract && (
                                        <div className="text-sm text-slate-600 italic">"{selectedStudent.abstract}"</div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-6 bg-slate-50 rounded-lg text-slate-500 text-sm">
                                    No project details available for this competition type.
                                </div>
                            )}
                            
                            {/* Feedback & Messaging */}
                            <div className="pt-4 border-t border-slate-100 space-y-3">
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                    <MessageSquare className="h-4 w-4" /> Message / Feedback
                                </div>
                                <textarea
                                    className="w-full min-h-[100px] p-3 rounded-md border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Write feedback or send a message to the student..."
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                ></textarea>
                                <div className="flex justify-end">
                                    <Button size="sm" onClick={handleSendFeedback} disabled={!feedback.trim()}>
                                        <Send className="h-3.5 w-3.5 mr-2" /> Send Message
                                    </Button>
                                </div>
                            </div>

                            {/* Actions Footer */}
                             <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <Button variant="secondary" onClick={() => setSelectedStudent(null)}>Close</Button>
                            </div>
                        </CardContent>
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
                confirmText="Confirm"
                cancelText="Cancel"
            />
        </div>
    );
};

export default AdminDashboard;
