import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useTeam } from '../../context/TeamContext';
import { Link } from 'react-router-dom';
import { 
    CheckCircle, Clock, XCircle, Github, ExternalLink, Plus, Filter, FileText, Send, UploadCloud, 
    Edit2, X, Paperclip, FileText as FilePdf, FileCode, Search, Video, Image as ImageIcon 
} from 'lucide-react';
import { Badge } from './Badge';

const SubmissionTracker = () => {
    const { competitions, students, addSubmission, getStudentSubmissions, editSubmission } = useApp();
    const { user } = useAuth();
    const { userTeams } = useTeam();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [filterCompetition, setFilterCompetition] = useState('all');
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '', // Technical Report
        category: '',
        url: '',
        type: 'pdf', // default submission type
        competitionId: '',
        includeCode: false,
        codeEntryMethod: 'write', // 'upload' or 'write'
        codeSnippet: '',
        codeExt: '.js'
    });

    const submissionTypes = [
        { id: 'pdf', label: 'PDF Document', icon: FilePdf, color: 'red' },
        { id: 'image', label: 'Images / Gallery', icon: ImageIcon, color: 'blue' },
        { id: 'video', label: 'Video Presentation', icon: Video, color: 'purple' },
        { id: 'code', label: 'Source Code / Project', icon: Github, color: 'amber' },
    ];

    const activeType = submissionTypes.find(t => t.id === formData.type) || submissionTypes[0];
    const ActiveIcon = activeType.icon;

    const codeExtensions = ['.js', '.jsx', '.py', '.c', '.cpp', '.java', '.html', '.css'];

    const fileTypes = {
        pdf: { icon: FilePdf, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
        image: { icon: ImageIcon, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        video: { icon: Video, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        code: { icon: FileCode, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        other: { icon: Paperclip, color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-900/20' }
    };

    const getFileType = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        if (['pdf'].includes(ext)) return 'pdf';
        if (['png', 'jpg', 'jpeg', 'svg', 'webp'].includes(ext)) return 'image';
        if (['mp4', 'mov', 'avi', 'webm'].includes(ext)) return 'video';
        if (['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'c', 'cpp', 'html', 'css', 'json'].includes(ext)) return 'code';
        return 'other';
    };

    // Find all records for the current student (to catch new registrations)
    const myRegistrations = students.filter(s => 
        s.id === (user?.id || 'ST-001') || 
        (user?.name && s.name === user.name)
    );
    const myCompetitionNames = myRegistrations.map(r => r.competition);
    
    // Check if the student is in a team for the selected competition
    const teamForComp = userTeams.find(t => t.competitionId === formData.competitionId);
    
    const currentStudentId = user?.id || 'ST-001';
    const studentTeamIds = userTeams.map(team => team.id);
    const studentSubmissions = getStudentSubmissions(currentStudentId, studentTeamIds);

    const filteredSubmissions = studentSubmissions.filter(sub => {
        if (filterCompetition === 'all') return true;
        return sub.competitionId === filterCompetition;
    });

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...selectedFiles]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(prev => [...prev, ...droppedFiles]);
    };
    const removeFile = (index) => setFiles(prev => prev.filter((_, i) => i !== index));

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const submissionData = {
            ...formData,
            studentId: currentStudentId,
            isTeamSubmission: !!teamForComp,
            teamId: teamForComp ? teamForComp.id : null,
            teamName: teamForComp ? teamForComp.name : null,
            files: files.map(f => f.name ? f.name : f)
        };

        if (editingId) {
            editSubmission(editingId, submissionData);
        } else {
            addSubmission(submissionData);
        }
        resetForm();
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', category: '', url: '', type: 'pdf', competitionId: '', includeCode: false, codeEntryMethod: 'write', codeSnippet: '', codeExt: '.js' });
        setFiles([]);
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (submission) => {
        setFormData({
            title: submission.title || '',
            description: submission.description || '',
            category: submission.category || '',
            url: submission.url || '',
            type: submission.type || 'pdf',
            competitionId: submission.competitionId || '',
            includeCode: submission.includeCode || false,
            codeEntryMethod: submission.codeEntryMethod || 'write',
            codeSnippet: submission.codeSnippet || '',
            codeExt: submission.codeExt || '.js'
        });
        setFiles(submission.files || []);
        setEditingId(submission.id);
        setShowForm(true);
        // Scroll to form if needed
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getCompetitionName = (competitionId) => {
        const comp = competitions.find(c => c.id === competitionId);
        return comp?.name || 'Unknown';
    };


    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50';
            case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-900/50';
            case 'rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-900/50';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-50 flex items-center gap-2">
                        <FileText className="text-violet-600" size={20} />
                        Submission Tracker
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage and track your project submissions</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            className="pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none dark:bg-slate-800 dark:text-slate-200 bg-slate-50 appearance-none min-w-[180px]"
                            value={filterCompetition}
                            onChange={(e) => setFilterCompetition(e.target.value)}
                        >
                            <option value="all">All Competitions</option>
                            {competitions.map(comp => (
                                <option key={comp.id} value={comp.id}>{comp.name}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={() => {
                            if (showForm) {
                                resetForm();
                            } else {
                                setShowForm(true);
                            }
                        }}
                        className={`px-4 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm ${showForm
                                ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                                : 'bg-violet-600 text-white hover:bg-violet-700 hover:shadow-violet-500/25'
                            }`}
                    >
                        {showForm ? <XCircle size={16} /> : <Plus size={16} />}
                        {showForm ? 'Cancel' : 'New Submission'}
                    </button>
                </div>
            </div>

            {/* Add Submission Form */}
            {showForm && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-violet-100 dark:border-slate-800 p-6 md:p-8 animate-fade-in-down relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">
                        {editingId ? 'Edit Project Submission' : (
                            teamForComp 
                                ? `Submit for Team: ${teamForComp.name}` 
                                : 'Submit Your Project'
                        )}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Competition</label>
                                <select
                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium"
                                    value={formData.competitionId}
                                    onChange={(e) => setFormData({ ...formData, competitionId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Competition</option>
                                    {competitions
                                        .filter(comp => {
                                            // Allow any competition where the student has a registration record (Pending or Approved)
                                            return myCompetitionNames.includes(comp.name);
                                        })
                                        .map(comp => (
                                            <option key={comp.id} value={comp.id}>{comp.name}</option>
                                        ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Primary Category</label>
                                <select
                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                    disabled={!formData.competitionId}
                                >
                                    <option value="">Select Category</option>
                                    {formData.competitionId && competitions.find(c => c.id === formData.competitionId)?.categories?.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Project Title</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all placeholder:text-slate-400 font-medium"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. EcoTracker App"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Submission Type</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {submissionTypes.map((type) => {
                                    const isActive = formData.type === type.id;
                                    const colors = {
                                        red: isActive ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 ring-red-500/20' : 'hover:border-red-200 text-slate-500',
                                        blue: isActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 ring-blue-500/20' : 'hover:border-blue-200 text-slate-500',
                                        purple: isActive ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 ring-purple-500/20' : 'hover:border-purple-200 text-slate-500',
                                        amber: isActive ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 ring-amber-500/20' : 'hover:border-amber-200 text-slate-500',
                                    };

                                    return (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => {
                                                setFormData({ 
                                                    ...formData, 
                                                    type: type.id,
                                                    includeCode: type.id === 'code' ? true : formData.includeCode
                                                });
                                            }}
                                            className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl border-2 transition-all group ${colors[type.color]} ${isActive ? 'ring-4 shadow-md scale-[1.02]' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
                                        >
                                            <div className={`p-2 rounded-xl transition-colors ${isActive ? (
                                                type.color === 'red' ? 'bg-red-500 text-white' :
                                                type.color === 'blue' ? 'bg-blue-500 text-white' :
                                                type.color === 'purple' ? 'bg-purple-500 text-white' :
                                                'bg-amber-500 text-white'
                                            ) : 'bg-slate-50 dark:bg-slate-800 group-hover:bg-slate-100'}`}>
                                                <type.icon size={20} />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider">{type.id}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Technical Report</label>
                            <textarea
                                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all placeholder:text-slate-400 min-h-[140px] resize-y shadow-inner leading-relaxed text-sm"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Structure your report: 
1. Introduction
2. Methodology
3. Results & Impact..."
                                required
                            />
                        </div>

                        {formData.type !== 'code' && (
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Project Files</label>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Real Input</span>
                                </div>
                                <div 
                                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${isDragging ? `border-${activeType.color}-500 bg-${activeType.color}-50/50 dark:bg-${activeType.color}-900/20` : `border-slate-200 dark:border-slate-800 hover:border-${activeType.color}-300 dark:hover:border-${activeType.color}-700 bg-slate-50/30 dark:bg-slate-900/30`}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById('project-file-input').click()}
                                >
                                    <input 
                                        id="project-file-input"
                                        type="file" 
                                        multiple 
                                        className="hidden" 
                                        onChange={handleFileChange}
                                    />
                                    <div className="flex flex-col items-center gap-2">
                                        <div className={`h-10 w-10 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-${activeType.color}-600`}>
                                            <ActiveIcon size={20} />
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium capitalize">
                                            Click to <span className={`text-${activeType.color}-600 dark:text-${activeType.color}-400 hover:underline`}>browse</span> {formData.type} files
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            {formData.type === 'pdf' ? 'PDF Documents' : 
                                            formData.type === 'image' ? 'JPG, PNG, WebP Images' :
                                            formData.type === 'video' ? 'MP4, MOV, WebM Videos' :
                                            'Select .zip, .c, .py, or .js files'} (Max 50MB)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {files.length > 0 && (
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {files.map((file, idx) => {
                                    const typeMatch = getFileType(file.name || file);
                                    const config = fileTypes[typeMatch];
                                    return (
                                        <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 ${config.bg} transition-all animate-in zoom-in-95`}>
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className={`p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm ${config.color}`}>
                                                    <config.icon size={16} />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{file.name || file}</span>
                                                    <span className="text-[10px] text-slate-400 uppercase font-medium">{typeMatch}</span>
                                                </div>
                                            </div>
                                            <button type="button" onClick={() => removeFile(idx)} className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Code Toggle & Sub-options - Conditional */}
                        {/* Code submission section - Always show upload, toggle for editor */}
                        {formData.type === 'code' && (
                            <div className="space-y-4">
                                {/* Always visible Code File Upload Area */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Project Files</label>
                                        <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Code Archive</span>
                                    </div>
                                    <div 
                                        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${isDragging ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-900/20' : 'border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 bg-amber-50/10 dark:bg-slate-900/30'}`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() => document.getElementById('project-file-input-code').click()}
                                    >
                                        <input 
                                            id="project-file-input-code"
                                            type="file" 
                                            multiple 
                                            className="hidden" 
                                            onChange={handleFileChange}
                                        />
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="h-10 w-10 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-amber-600">
                                                <FileCode size={20} />
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium capitalize">
                                                Click to <span className="text-amber-600 dark:text-amber-400 hover:underline">browse</span> project files
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                Select .zip, .c, .py, or .js files (Max 50MB)
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Toggleable In-Browser Editor */}
                                <div className="p-1 dark:bg-slate-950 border border-amber-200 dark:border-amber-900/40 rounded-2xl overflow-hidden shadow-sm bg-amber-50/5">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, includeCode: !formData.includeCode })}
                                        className={`w-full flex items-center justify-between p-4 transition-all rounded-xl ${formData.includeCode ? 'bg-white dark:bg-slate-900 shadow-sm' : 'hover:bg-amber-100/10'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg transition-all ${formData.includeCode ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                                                <Github size={18} />
                                            </div>
                                            <div className="text-left">
                                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Interactive Code Snippet</h4>
                                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Quick Editor Access</p>
                                            </div>
                                        </div>
                                        <div className={`w-10 h-6 rounded-full transition-all relative ${formData.includeCode ? 'bg-amber-500 shadow-inner' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${formData.includeCode ? 'left-5' : 'left-1'}`}></div>
                                        </div>
                                    </button>

                                    {formData.includeCode && (
                                        <div className="p-4 pt-0 space-y-4 animate-in slide-in-from-top-2">
                                                <div className="space-y-3 pt-4">
                                                    <div className="flex items-center justify-between px-1">
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex gap-1.5">
                                                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/30 border border-red-500/20"></div>
                                                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/30 border border-amber-500/20"></div>
                                                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/30 border border-emerald-500/20"></div>
                                                            </div>
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Editor</label>
                                                        </div>
                                                        <select
                                                            value={formData.codeExt}
                                                            onChange={(e) => setFormData({ ...formData, codeExt: e.target.value })}
                                                            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold px-2 py-1 outline-none text-slate-600 dark:text-slate-400 focus:ring-1 focus:ring-amber-500/30 transition-all cursor-pointer"
                                                        >
                                                            {codeExtensions.map(ext => (
                                                                <option key={ext} value={ext}>{ext.toUpperCase()}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-[#0d1117]">
                                                        {/* Gutter background - themed overflow fix */}
                                                        <div className="absolute left-0 top-0 bottom-0 w-10 bg-slate-50 dark:bg-[#161b22] border-r border-slate-200 dark:border-white/5 pointer-events-none z-10" />
                                                        
                                                        {/* Line digits scroll-synced */}
                                                        <div className="absolute left-0 top-0 bottom-0 w-10 overflow-hidden pointer-events-none z-20">
                                                            <div 
                                                                id="line-counter-sync"
                                                                className="flex flex-col items-center pt-4 text-[10px] font-mono text-slate-400 dark:text-slate-500 select-none opacity-60"
                                                            >
                                                                {formData.codeSnippet.split('\n').map((_, i) => (
                                                                    <div key={i} className="leading-6 h-6 flex items-center justify-center w-full font-bold">{i + 1}</div>
                                                                ))}
                                                                {/* Visual padding for the bottom */}
                                                                {Array.from({ length: 5 }).map((_, i) => (
                                                                    <div key={`extra-${i}`} className="leading-6 h-6"></div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <textarea
                                                            className="w-full pl-14 pr-4 py-4 bg-transparent border-none text-slate-700 dark:text-slate-300 focus:ring-0 focus:outline-none transition-all font-mono text-xs min-h-[240px] leading-6 sidebar-scroll whitespace-pre resize-none scroll-smooth"
                                                            value={formData.codeSnippet}
                                                            onChange={(e) => setFormData({ ...formData, codeSnippet: e.target.value })}
                                                            placeholder={`// Write your ${formData.codeExt} code here...`}
                                                            spellCheck="false"
                                                            onScroll={(e) => {
                                                                const sync = document.getElementById('line-counter-sync');
                                                                if (sync) sync.style.transform = `translateY(-${e.target.scrollTop}px)`;
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Primary Project Link (Optional)</label>
                            <div className="relative">
                                <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="url"
                                    className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all placeholder:text-slate-400 text-sm"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    placeholder="https://github.com/username/repo or https://demo.com"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="px-8 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-violet-500/25 transition-all flex items-center gap-2"
                            >
                                <Send size={18} />
                                {editingId 
                                    ? 'Update Project' 
                                    : (teamForComp ? `Submit for ${teamForComp.name}` : 'Submit Project')
                                }
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Submissions List */}
            <div className="space-y-4">
                {filteredSubmissions.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                            <FileText size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No submissions found</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                            {filterCompetition !== 'all'
                                ? "You haven't submitted anything for this competition yet."
                                : "You haven't submitted any projects yet. Get started by clicking 'Add Submission'!"}
                        </p>
                    </div>
                ) : (
                    filteredSubmissions.map((submission) => (
                        <div
                            key={submission.id}
                            className={`group p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-md ${getStatusColor(submission.status).replace('bg-', 'border-').split(' ')[0] === 'border-slate-200' ? 'border-slate-200 dark:border-slate-700 hover:border-violet-300' : ''} relative overflow-hidden`}
                        >
                            <div className={`absolute top-0 right-0 w-1 h-full ${submission.status === 'approved' ? 'bg-emerald-500' :
                                    submission.status === 'pending' ? 'bg-amber-500' :
                                        submission.status === 'rejected' ? 'bg-red-500' : 'bg-slate-300'
                                }`}></div>

                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate">{submission.title}</h3>
                                        <div className="flex gap-2">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(submission.status)}`}>
                                                {submission.status}
                                            </span>
                                            {submission.isTeamSubmission && (
                                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-900/50">
                                                    Team ({submission.teamName || 'Team Project'})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-3 flex items-center gap-2">
                                        <span className="truncate max-w-[200px]">{getCompetitionName(submission.competitionId)}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                        <span>{submission.date}</span>
                                    </p>

                                    <div className="flex items-center gap-4">
                                        <Link
                                            to={`/student/submission/${submission.id}`}
                                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 transition-colors"
                                        >
                                            <Search size={16} />
                                            View Details
                                        </Link>

                                        {submission.url && (
                                            <a
                                                href={submission.url.startsWith('http') ? submission.url : `https://${submission.url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-violet-600 transition-colors"
                                            >
                                                {submission.type === 'github' ? <Github size={16} /> : <ExternalLink size={16} />}
                                                Live Project
                                            </a>
                                        )}
                                    </div>

                                        {submission.status === 'pending' && (
                                            <div className="flex items-center gap-2 lg:ml-auto">
                                                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                                <button 
                                                    onClick={() => handleEdit(submission)}
                                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                                                >
                                                    <Edit2 size={14} />
                                                    Edit
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            {submission.feedback && (
                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl p-4 border border-emerald-100/50 dark:border-emerald-900/20">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <p className="font-bold text-emerald-800 dark:text-emerald-400 text-[10px] uppercase tracking-wider">Official Feedback</p>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 italic text-sm leading-relaxed">"{submission.feedback}"</p>
                                    </div>
                                </div>
                            )}

                            {/* Technical Report & File Grid */}
                            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {submission.description && (
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Technical Report</label>
                                        <div className="bg-slate-50/50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-slate-800/50">
                                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">{submission.description}</p>
                                        </div>
                                    </div>
                                )}
                                
                                {submission.files && submission.files.length > 0 && (
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Attached Files ({submission.files.length})</label>
                                        <div className="flex flex-wrap gap-2">
                                            {submission.files.map((file, idx) => {
                                                const type = getFileType(file.name || file);
                                                const config = fileTypes[type];
                                                return (
                                                    <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm max-w-full overflow-hidden">
                                                        <config.icon size={12} className={config.color} />
                                                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate max-w-[120px]">{file.name || file}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Code Preview Helper (Static for now) */}
                            {submission.codeSnippet && (
                                <div className="mt-4 bg-slate-900 rounded-xl p-4 overflow-hidden border border-slate-800">
                                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-1.5">
                                                <div className="h-2.5 w-2.5 rounded-full bg-red-500/80"></div>
                                                <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80"></div>
                                                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80"></div>
                                            </div>
                                            <span className="text-[10px] font-mono text-slate-500 ml-2">main{submission.codeExt || '.js'}</span>
                                        </div>
                                    </div>
                                    <pre className="text-xs font-mono text-slate-300 overflow-x-auto">
                                        {submission.codeSnippet}
                                    </pre>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SubmissionTracker;
