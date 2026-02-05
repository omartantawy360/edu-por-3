import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Trophy, Calendar, Users, FileText, Sparkles, Plus, Image, Link as LinkIcon } from 'lucide-react';

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
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-3 mb-2">
                    <div className="p-2 sm:p-3 bg-primary-100 rounded-xl shrink-0">
                        <Sparkles className="text-primary-600" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-50">Create New Competition</h1>
                        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">Design an engaging competition for students</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Basic Information Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 sm:p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <Trophy className="text-primary-600" size={20} />
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-50">Basic Information</h2>
                    </div>
                    
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Competition Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                                placeholder="e.g., National Science Fair 2024"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                                placeholder="Describe the competition, its goals, and what makes it special..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Type *</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                                >
                                    <option value="Internal">Internal</option>
                                    <option value="Outer">External</option>
                                </select>
                            </div>

                            <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Max Participants *</label>
                                <input
                                    type="number"
                                    name="maxParticipants"
                                    value={formData.maxParticipants}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                                    placeholder="100"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <Calendar className="text-primary-600" size={20} />
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-50">Timeline</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Start Date *</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">End Date *</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Competition Details Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <FileText className="text-primary-600" size={20} />
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-50">Competition Details</h2>
                    </div>
                    
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                                <div className="flex items-center gap-2">
                                    <Image size={16} />
                                    Cover Image URL
                                </div>
                            </label>
                            <input
                                type="url"
                                name="coverImage"
                                value={formData.coverImage}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                                placeholder="https://example.com/image.jpg"
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Optional: Add a cover image to make your competition stand out</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Prize/Rewards</label>
                            <input
                                type="text"
                                name="prize"
                                value={formData.prize}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                                placeholder="e.g., $1000 cash prize, Certificate, Trophy"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Requirements</label>
                            <textarea
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                                placeholder="List any specific requirements or eligibility criteria..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Stages *</label>
                            <input
                                type="text"
                                name="stages"
                                value={formData.stages}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                                placeholder="e.g., Registration, Submission, Judging, Final"
                                required
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Separate stages with commas</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin')}
                        className="px-6 py-3 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-500/30 flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Create Competition
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCompetition;
