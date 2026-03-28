import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
// ... (rest of imports)
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
import CompetitionPhaseSteps from '../components/ui/CompetitionPhaseSteps';
import { useTeam } from '../context/TeamContext';
import { COMPETITION_PHASES, RESULTS_VISIBILITY, LEADERBOARD_STATUS } from '../context/AppContext';
import CompetitionWizard from '../components/admin/CompetitionWizard';
import AdminAnalytics from '../components/admin/AdminAnalytics';

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
    const { 
        students, competitions, submissions, 
        updateStudentStatus, updateStudentStage, setStudentResult, setStudentFeedback,
        updateCompetitionPhase, updateCompetitionVisibility, updateLeaderboardStatus,
        generatePeerAssignments
    } = useApp();
    const { teams } = useTeam();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedStudent, setSelectedStudent] = useState(null);

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


    const handleSendFeedback = () => {
        if (!feedback.trim()) return;
        setStudentFeedback(selectedStudent.id, feedback);
        setFeedback('');
        // Close modal or show success? Let's just reset for now and maybe close
        setSelectedStudent(null);
    };

    const handleApprove = (id) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Approve Registration?',
            message: 'This will allow the student/team to participate in the competition.',
            type: 'warning',
            onConfirm: () => {
                updateStudentStatus(id, 'Approved');
                setConfirmDialog(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleReject = (id) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Reject Registration?',
            message: 'Are you sure you want to reject this registration?',
            type: 'destructive',
            onConfirm: () => {
                updateStudentStatus(id, 'Rejected');
                setConfirmDialog(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handlePass = (id) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Mark as Passed?',
            message: 'This student/team has successfully completed this stage.',
            type: 'warning',
            onConfirm: () => {
                setStudentResult(id, 'Passed');
                setConfirmDialog(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleFail = (id) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Mark as Failed?',
            message: 'Are you sure you want to mark this entry as failed?',
            type: 'destructive',
            onConfirm: () => {
                setStudentResult(id, 'Failed');
                setConfirmDialog(prev => ({ ...prev, isOpen: false }));
            }
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
                        {/* Summary cards or header actions can go here if needed */}
                    </div>
                </div>

                <div className="flex p-1.5 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl w-full sm:w-auto self-start gap-1 overflow-x-auto max-w-full">
                    <TabButton id="overview" label="Overview" icon={FileText} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="directory" label="Directory" icon={Users} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="competitions" label="Competitions" icon={Trophy} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="manage" label="Manage" icon={LayoutList} activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <AdminAnalytics />
                </div>
            )}

            {/* Directory Tab (Read-only searchable list) */}
            {activeTab === 'directory' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800 px-6 pt-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="text-lg font-bold">Records Directory</CardTitle>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Global lookup for all registered students and teams</p>
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
                                                                        value={typeof student.stage === 'string' ? student.stage : (student.stage?.name || '')}
                                                                        onChange={(e) => updateStudentStage(student.id, e.target.value)}
                                                                    >
                                                                        {(competition.stages || []).map(stage => {
                                                                            const sName = typeof stage === 'string' ? stage : (stage.name || 'Unnamed Stage');
                                                                            return <option key={sName} value={sName}>{sName}</option>;
                                                                        })}
                                                                        <option value="Registration">Registration</option>
                                                                    </select>
                                                                )}
                                                                {(!competition || !student.stage) && (
                                                                    <span>{typeof student.stage === 'string' ? student.stage : (student.stage?.name || '-')}</span>
                                                                )}
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
                                                                <div className="flex items-center justify-end gap-2 text-right">
                                                                    <div className="flex items-center gap-1">
                                                                        {student.status === 'Pending' && (
                                                                            <>
                                                                                <Button size="xs" variant="ghost" className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full" onClick={() => handleApprove(student.id)}>
                                                                                    <CheckCircle className="h-4 w-4" />
                                                                                </Button>
                                                                                <Button size="xs" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full" onClick={() => handleReject(student.id)}>
                                                                                    <XCircle className="h-4 w-4" />
                                                                                </Button>
                                                                            </>
                                                                        )}
                                                                        {student.status === 'Approved' && !student.result && (
                                                                            <>
                                                                                <Button size="xs" variant="ghost" className="h-8 px-2 text-[10px] font-black text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={() => handlePass(student.id)}>
                                                                                    PASS
                                                                                </Button>
                                                                                <Button size="xs" variant="ghost" className="h-8 px-2 text-[10px] font-black text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleFail(student.id)}>
                                                                                    FAIL
                                                                                </Button>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                    <Button size="sm" variant="outline" className="h-8 gap-1.5 font-bold shadow-sm border-slate-200" onClick={() => setSelectedStudent(student)}>
                                                                        <Eye className="h-3.5 w-3.5" /> View Details
                                                                    </Button>
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
                    <div className="space-y-8">
                        {competitions.map((comp) => {
                            const compTeams = teams.filter(t => t.competitionId === comp.id);
                            const pendingTeams = compTeams.filter(t => t.status === 'Pending');
                            const acceptedTeams = compTeams.filter(t => t.status === 'Accepted');
                            
                            return (
                                <Card key={comp.id} className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-lg">
                                    <div className="flex flex-col lg:flex-row">
                                        <div className="lg:w-1/3 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800">
                                            <CompetitionCard
                                                competition={comp}
                                                showActions={false}
                                            />
                                        </div>
                                        <div className="flex-1 p-6 space-y-6 bg-slate-50/30 dark:bg-slate-900/10">
                                            {/* Phase Indicator */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between px-2">
                                                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Competition Workflow</h4>
                                                    <Badge variant="secondary" className="capitalize">{comp.phase}</Badge>
                                                </div>
                                                <CompetitionPhaseSteps currentPhase={comp.phase} />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Teams</p>
                                                    <div className="flex items-end justify-between">
                                                        <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{compTeams.length}</span>
                                                        <span className="text-xs text-emerald-500 font-bold">{acceptedTeams.length} Accepted</span>
                                                    </div>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phase Actions</p>
                                                    <div className="flex gap-2">
                                                        <Button 
                                                            size="xs" 
                                                            variant="default" 
                                                            className="h-8 text-[10px] font-bold px-3"
                                                            onClick={() => {
                                                                const phases = Object.values(COMPETITION_PHASES);
                                                                const currentIdx = phases.indexOf(comp.phase);
                                                                if (currentIdx < phases.length - 1) {
                                                                    updateCompetitionPhase(comp.id, phases[currentIdx + 1]);
                                                                }
                                                            }}
                                                        >
                                                            Move to Next
                                                        </Button>
                                                        {comp.phase === COMPETITION_PHASES.RESULTS_READY && (
                                                            <Button 
                                                                size="xs" 
                                                                className="h-8 text-[10px] font-bold px-3 bg-emerald-600 hover:bg-emerald-700"
                                                                onClick={() => {
                                                                    updateCompetitionPhase(comp.id, COMPETITION_PHASES.RESULTS_PUBLISHED);
                                                                    updateCompetitionVisibility(comp.id, RESULTS_VISIBILITY.PUBLISHED);
                                                                    updateLeaderboardStatus(comp.id, LEADERBOARD_STATUS.FINAL);
                                                                }}
                                                            >
                                                                Publish Results
                                                            </Button>
                                                        )}
                                                        {comp.phase === COMPETITION_PHASES.EVALUATION && (
                                                            <Button 
                                                                size="xs" 
                                                                className="h-8 text-[10px] font-bold px-3 bg-indigo-600 hover:bg-indigo-700"
                                                                onClick={() => {
                                                                    setConfirmDialog({
                                                                        isOpen: true,
                                                                        title: 'Initiate Peer Review?',
                                                                        message: 'This will randomly assign teams to review each other. This action is irreversible for this phase.',
                                                                        type: 'warning',
                                                                        onConfirm: () => {
                                                                            const res = generatePeerAssignments(comp.id);
                                                                            if (res.success) {
                                                                                setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                                                                            } else {
                                                                                alert(res.error);
                                                                            }
                                                                        }
                                                                    });
                                                                }}
                                                            >
                                                                Initiate Peer Review
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Team Control</p>
                                                    <Link to={`/admin/teams?competition=${comp.id}`} className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 mt-2">
                                                        Manage {pendingTeams.length} Pending <ArrowRight size={12} />
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className="flex gap-4 pt-2">
                                                <Link
                                                    to={`/admin/competition/${comp.id}/timeline`}
                                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
                                                >
                                                    <LayoutList size={14} />
                                                    Timeline Manager
                                                </Link>
                                                <Button 
                                                    variant="secondary" 
                                                    className="flex-1 rounded-2xl text-xs font-bold py-3"
                                                    onClick={() => navigate(`/admin/submissions?competition=${comp.id}`)}
                                                >
                                                    <FileTextIcon size={14} /> Submissions
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
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

            {/* Manage / Competition Wizard Tab */}
            {activeTab === 'manage' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <CompetitionWizard />
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
