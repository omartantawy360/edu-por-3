import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Trophy, Calendar, Users, FileText, Sparkles, Plus, Image, Link as LinkIcon, CheckCircle, ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

const CreateCompetition = () => {
    const { addCompetition } = useApp();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'Internal',
        startDate: '',
        endDate: '',
        maxParticipants: '',
        stages: '',
        coverImage: '',
        prize: '',
        requirements: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const stagesArray = formData.stages.split(',').map(s => s.trim()).filter(s => s);

        addCompetition({
            name: formData.name,
            description: formData.description,
            type: formData.type,
            startDate: formData.startDate,
            endDate: formData.endDate,
            maxParticipants: parseInt(formData.maxParticipants) || 0,
            stages: stagesArray,
            coverImage: formData.coverImage,
            prize: formData.prize,
            requirements: formData.requirements
        });

        navigate('/admin');
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin')}
                        className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                            Create Competition
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Launch a new challenge for the student community
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Sparkles size={14} />
                    Admin Mode
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Basic Info Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                                <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
                                    <Trophy size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Basic Information</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Competition Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all placeholder:text-slate-400"
                                        placeholder="e.g. Annual Science Innovation Fair"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description <span className="text-red-500">*</span></label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="5"
                                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all placeholder:text-slate-400 resize-none"
                                        placeholder="Detailed description of the competition..."
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Competition Type</label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                                        >
                                            <option value="Internal">Internal (School only)</option>
                                            <option value="Outer">External (Global/Regional)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Max Participants</label>
                                        <input
                                            type="number"
                                            name="maxParticipants"
                                            value={formData.maxParticipants}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                                            placeholder="e.g. 100"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                                <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <FileText size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Additional Details</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Stages & Rounds <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="stages"
                                        value={formData.stages}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                                        placeholder="Registration, Qualification, Finals"
                                        required
                                    />
                                    <p className="text-xs text-slate-500 mt-1.5 ml-1">Comma separated list of competition stages</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Prize Information</label>
                                    <input
                                        type="text"
                                        name="prize"
                                        value={formData.prize}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                                        placeholder="e.g. $500 Cash Prize + Certificate"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Requirements</label>
                                    <textarea
                                        name="requirements"
                                        value={formData.requirements}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none"
                                        placeholder="Eligibility criteria, required skills, etc."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar settings */}
                    <div className="space-y-8">
                        {/* Timeline Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                                <div className="h-10 w-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                    <Calendar size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Timeline</h2>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Start Date <span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">End Date <span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Media Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                                <div className="h-10 w-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400">
                                    <Image size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Media</h2>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Cover Image URL</label>
                                <input
                                    type="url"
                                    name="coverImage"
                                    value={formData.coverImage}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-sm mb-4"
                                    placeholder="https://"
                                />

                                {formData.coverImage ? (
                                    <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-700 group">
                                        <img src={formData.coverImage} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://placehold.co/600x400/e2e8f0/64748b?text=Invalid+Image'} />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white font-medium text-sm">Preview</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-xl aspect-video bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400">
                                        <Image size={32} className="mb-2 opacity-50" />
                                        <span className="text-xs">Image Preview</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={() => navigate('/admin')}
                        className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        Discard
                    </button>
                    <button
                        type="submit"
                        className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-violet-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Publish Competition
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCompetition;
