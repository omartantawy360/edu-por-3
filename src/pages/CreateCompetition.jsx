import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
    Trophy, Calendar, Users, FileText, Sparkles, Plus, Image,
    CheckCircle, ChevronLeft, X, ChevronRight, BookOpen,
    ClipboardList, Layers, Eye
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

// ── Shared input styles ─────────────────────────────────────
const inputCls = 'w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all placeholder:text-slate-400';

// ── Step indicator ──────────────────────────────────────────
const StepIndicator = ({ step, currentStep }) => {
    const isDone = currentStep > step;
    const isActive = currentStep === step;
    return (
        <div className={cn(
            'flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold shrink-0 transition-all',
            isDone ? 'bg-emerald-500 text-white' :
                isActive ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30' :
                    'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
        )}>
            {isDone ? <CheckCircle size={16} /> : step}
        </div>
    );
};

const EMPTY_STAGE = { title: '', description: '', startDate: '', endDate: '' };

const CreateCompetition = () => {
    const { addCompetition, addPost } = useApp();
    const navigate = useNavigate();

    // ── Wizard step ─────────────────────────────────────────
    const [currentStep, setCurrentStep] = useState(1);

    // ── Step 1: Basic Info ──────────────────────────────────
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'Internal',
        startDate: '',
        endDate: '',
        maxParticipants: '',
        coverImage: '',
        prize: '',
        requirements: '',
    });
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');

    // ── Step 2: Auto-generated posts preview ───────────────
    const [introGoals, setIntroGoals] = useState('');
    const [introRules, setIntroRules] = useState('');
    const [regDeadline, setRegDeadline] = useState('');
    const [regStatus, setRegStatus] = useState('Open');

    // ── Step 3: Stages ──────────────────────────────────────
    const [stages, setStages] = useState([{ ...EMPTY_STAGE }]);

    // ── Handlers ────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddCategory = () => {
        if (newCategory.trim() && !categories.includes(newCategory.trim())) {
            setCategories([...categories, newCategory.trim()]);
            setNewCategory('');
        }
    };

    const handleRemoveCategory = (cat) => setCategories(categories.filter(c => c !== cat));

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); }
    };

    const addStage = () => setStages(prev => [...prev, { ...EMPTY_STAGE }]);
    const removeStage = (i) => setStages(prev => prev.filter((_, idx) => idx !== i));
    const updateStage = (i, field, value) => setStages(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));

    const canProceedStep1 = formData.name.trim() && formData.description.trim() && formData.startDate && formData.endDate;

    const handlePublish = () => {
        // Create competition
        const stagesLabels = stages.filter(s => s.title.trim()).map(s => s.title);
        const competition = {
            name: formData.name,
            description: formData.description,
            type: formData.type,
            startDate: formData.startDate,
            endDate: formData.endDate,
            maxParticipants: parseInt(formData.maxParticipants) || 0,
            stages: stagesLabels,
            categories,
            coverImage: formData.coverImage,
            prize: formData.prize,
            requirements: formData.requirements,
        };

        // addCompetition returns void — we need the id ourselves
        const tempId = Math.random().toString(36).substr(2, 9);
        addCompetition({ ...competition, id: tempId });

        // Auto-generate posts
        // 1. Introduction Post
        const introDesc = [
            formData.description,
            introGoals.trim() ? `\n\n**Goals:**\n${introGoals.trim().split('\n').map(l => `- ${l}`).join('\n')}` : '',
            introRules.trim() ? `\n\n**Rules:**\n${introRules.trim().split('\n').map(l => `- ${l}`).join('\n')}` : '',
        ].join('');

        addPost(tempId, {
            type: 'Introduction',
            title: `Welcome to ${formData.name}`,
            description: introDesc,
            date: formData.startDate || new Date().toISOString().split('T')[0],
            status: 'published',
            isPinned: true,
        });

        // 2. Registration Post
        addPost(tempId, {
            type: 'Registration',
            title: 'Registration is Now Open!',
            description: `Registration for **${formData.name}** is now open. Submit your application before the deadline to secure your spot.${formData.maxParticipants ? `\n\nSpots are **limited to ${formData.maxParticipants} participants**.` : ''}`,
            date: formData.startDate || new Date().toISOString().split('T')[0],
            status: 'published',
            isPinned: false,
            registrationStatus: regStatus,
            registrationDeadline: regDeadline || formData.startDate,
        });

        // 3. Stage posts
        stages.filter(s => s.title.trim()).forEach((stage) => {
            addPost(tempId, {
                type: 'Stage',
                title: stage.title,
                description: stage.description || `This stage runs from ${stage.startDate || 'TBD'} to ${stage.endDate || 'TBD'}.`,
                date: stage.startDate || formData.startDate || new Date().toISOString().split('T')[0],
                status: 'published',
                isPinned: false,
                stageStartDate: stage.startDate,
                stageEndDate: stage.endDate,
            });
        });

        navigate(`/admin/competition/${tempId}/timeline`);
    };

    const steps = [
        { number: 1, label: 'Basic Info', icon: Trophy },
        { number: 2, label: 'Intro & Registration', icon: BookOpen },
        { number: 3, label: 'Stages', icon: Layers },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin')}
                        className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50">
                            Create Competition
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Build a competition with a full timeline in 3 steps
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Sparkles size={14} />
                    Admin Mode
                </div>
            </div>

            {/* Step progress indicator */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                <div className="flex items-center justify-between relative">
                    {/* Progress line */}
                    <div className="absolute left-0 right-0 top-4 h-0.5 bg-slate-200 dark:bg-slate-700 mx-8 z-0" />
                    <div
                        className="absolute left-0 top-4 h-0.5 bg-violet-500 mx-8 z-0 transition-all duration-500"
                        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    />
                    {steps.map((step) => (
                        <div key={step.number} className="flex flex-col items-center gap-2 z-10 min-w-0">
                            <StepIndicator step={step.number} currentStep={currentStep} />
                            <span className={cn(
                                'text-xs font-bold text-center hidden sm:block',
                                currentStep === step.number ? 'text-violet-600 dark:text-violet-400' :
                                    currentStep > step.number ? 'text-emerald-600 dark:text-emerald-400' :
                                        'text-slate-400'
                            )}>
                                {step.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── STEP 1: Basic Info ─────────────────────────────── */}
            {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: Main info */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                                    <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
                                        <Trophy size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Basic Information</h2>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Competition Name <span className="text-red-500">*</span></label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputCls} placeholder="e.g. Annual Science Innovation Fair" required />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description <span className="text-red-500">*</span></label>
                                        <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className={inputCls + ' resize-none'} placeholder="Detailed description of the competition..." required />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Type</label>
                                            <select name="type" value={formData.type} onChange={handleChange} className={inputCls}>
                                                <option value="Internal">Internal (School only)</option>
                                                <option value="Outer">External (Global/Regional)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Max Participants</label>
                                            <input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} className={inputCls} placeholder="e.g. 100" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Prize</label>
                                            <input type="text" name="prize" value={formData.prize} onChange={handleChange} className={inputCls} placeholder="e.g. $500 + Certificate" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Requirements</label>
                                            <input type="text" name="requirements" value={formData.requirements} onChange={handleChange} className={inputCls} placeholder="e.g. Grade 10–12" />
                                        </div>
                                    </div>

                                    {/* Categories */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Categories</label>
                                        <div className="flex gap-2 mb-2">
                                            <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} onKeyDown={handleKeyPress} className={inputCls + ' flex-1'} placeholder="Add a category (e.g. AI, Robotics)" />
                                            <Button type="button" onClick={handleAddCategory} className="px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white shrink-0">
                                                <Plus size={20} />
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.map((cat, idx) => (
                                                <div key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 rounded-lg text-xs font-bold border border-violet-100 dark:border-violet-800/50">
                                                    {cat}
                                                    <button type="button" onClick={() => handleRemoveCategory(cat)} className="hover:text-red-500 transition-colors">
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Timeline + Media */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                                    <div className="h-10 w-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                                        <Calendar size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Timeline</h2>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Start Date <span className="text-red-500">*</span></label>
                                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className={inputCls} required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">End Date <span className="text-red-500">*</span></label>
                                        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className={inputCls} required />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                                    <div className="h-10 w-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600">
                                        <Image size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Cover Image</h2>
                                </div>
                                <input type="url" name="coverImage" value={formData.coverImage} onChange={handleChange} className={inputCls + ' text-sm'} placeholder="https://" />
                                {formData.coverImage ? (
                                    <div className="mt-3 rounded-xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-700">
                                        <img src={formData.coverImage} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://placehold.co/600x400/e2e8f0/64748b?text=Invalid+Image'} />
                                    </div>
                                ) : (
                                    <div className="mt-3 rounded-xl aspect-video bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400">
                                        <Image size={28} className="mb-1.5 opacity-40" />
                                        <span className="text-xs">Image Preview</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── STEP 2: Introduction + Registration Posts ─────── */}
            {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                    {/* Auto-generate info banner */}
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800">
                        <Sparkles size={18} className="text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-violet-800 dark:text-violet-200">Auto-generated posts</p>
                            <p className="text-xs text-violet-600 dark:text-violet-400 mt-0.5">These two posts will be automatically created when you publish. Fill in any extra details below.</p>
                        </div>
                    </div>

                    {/* Introduction Post preview */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-blue-200 dark:border-blue-800 shadow-sm space-y-4">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-2xl">📘</span>
                            <div>
                                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Introduction Post</p>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100">Welcome to {formData.name || 'your competition'}</h3>
                            </div>
                            <span className="ml-auto text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">Auto</span>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Goals (one per line, optional)</label>
                            <textarea
                                value={introGoals}
                                onChange={e => setIntroGoals(e.target.value)}
                                rows={3}
                                className={inputCls + ' resize-none text-sm'}
                                placeholder={'Foster innovation\nConnect students with mentors\nShowcase best projects'}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Rules (one per line, optional)</label>
                            <textarea
                                value={introRules}
                                onChange={e => setIntroRules(e.target.value)}
                                rows={3}
                                className={inputCls + ' resize-none text-sm'}
                                placeholder={'Projects must be original\nTeams of 1-4 members\nSubmit technical report'}
                            />
                        </div>
                    </div>

                    {/* Registration Post preview */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-emerald-200 dark:border-emerald-800 shadow-sm space-y-4">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-2xl">📝</span>
                            <div>
                                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Registration Post</p>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100">Registration is Now Open!</h3>
                            </div>
                            <span className="ml-auto text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">Auto</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Registration Status</label>
                                <select value={regStatus} onChange={e => setRegStatus(e.target.value)} className={inputCls + ' text-sm'}>
                                    <option value="Open">Open</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Registration Deadline</label>
                                <input type="date" value={regDeadline} onChange={e => setRegDeadline(e.target.value)} className={inputCls + ' text-sm'} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── STEP 3: Stages ───────────────────────────────── */}
            {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800">
                        <Layers size={18} className="text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-violet-800 dark:text-violet-200">Stage Posts</p>
                            <p className="text-xs text-violet-600 dark:text-violet-400 mt-0.5">Each stage below will become a 🧩 Stage post in your competition timeline.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {stages.map((stage, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-violet-100 dark:border-violet-900/50 p-5 shadow-sm space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">🧩</span>
                                        <span className="text-sm font-bold text-violet-700 dark:text-violet-300">Stage {i + 1}</span>
                                    </div>
                                    {stages.length > 1 && (
                                        <button
                                            onClick={() => removeStage(i)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Stage Title <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={stage.title}
                                        onChange={e => updateStage(i, 'title', e.target.value)}
                                        className={inputCls + ' text-sm'}
                                        placeholder={`e.g. Round ${i + 1}, Finals, Submission Phase`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                                    <textarea
                                        value={stage.description}
                                        onChange={e => updateStage(i, 'description', e.target.value)}
                                        rows={2}
                                        className={inputCls + ' resize-none text-sm'}
                                        placeholder="What happens in this stage?"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Start Date</label>
                                        <input type="date" value={stage.startDate} onChange={e => updateStage(i, 'startDate', e.target.value)} className={inputCls + ' text-sm'} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">End Date</label>
                                        <input type="date" value={stage.endDate} onChange={e => updateStage(i, 'endDate', e.target.value)} className={inputCls + ' text-sm'} />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={addStage}
                            className="w-full py-3 rounded-2xl border-2 border-dashed border-violet-300 dark:border-violet-700 text-violet-600 dark:text-violet-400 font-bold text-sm hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={16} /> Add Another Stage
                        </button>
                    </div>
                </div>
            )}

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
                <button
                    onClick={() => currentStep > 1 ? setCurrentStep(s => s - 1) : navigate('/admin')}
                    className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    {currentStep > 1 ? '← Back' : 'Discard'}
                </button>

                <div className="flex items-center gap-3">
                    {currentStep < 3 ? (
                        <button
                            onClick={() => setCurrentStep(s => s + 1)}
                            disabled={currentStep === 1 && !canProceedStep1}
                            className={cn(
                                'px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all',
                                (currentStep === 1 && !canProceedStep1)
                                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-lg hover:shadow-violet-500/25 hover:scale-[1.02] active:scale-[0.98]'
                            )}
                        >
                            Next Step <ChevronRight size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={handlePublish}
                            className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-violet-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                        >
                            <Eye size={18} />
                            Publish & View Timeline
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateCompetition;
