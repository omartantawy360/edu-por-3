import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Plus, Trash2, Sparkles } from 'lucide-react';

const AddAchievementModal = ({ student, onClose }) => {
    const { addAchievement } = useApp();
    const [formData, setFormData] = useState({
        badge: '',
        description: '',
        icon: '🏆',
        color: 'blue'
    });

    const iconOptions = ['🏆', '🎯', '⭐', '🎖️', '👑', '💎', '🔥', '⚡', '🌟', '🤝', '🎨', '💡'];
    const colorOptions = [
        { name: 'Blue', value: 'blue', class: 'bg-blue-100 text-blue-700 border-blue-200' },
        { name: 'Green', value: 'green', class: 'bg-green-100 text-green-700 border-green-200' },
        { name: 'Purple', value: 'purple', class: 'bg-purple-100 text-purple-700 border-purple-200' },
        { name: 'Orange', value: 'orange', class: 'bg-orange-100 text-orange-700 border-orange-200' },
        { name: 'Pink', value: 'pink', class: 'bg-pink-100 text-pink-700 border-pink-200' },
        { name: 'Yellow', value: 'yellow', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        addAchievement({
            studentId: student.id,
            ...formData
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 bg-white dark:bg-slate-900 z-10 p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary-100 rounded-xl">
                                <Sparkles className="text-primary-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-50">Add Achievement</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Award {student.name} a badge</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Badge Name *</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                            value={formData.badge}
                            onChange={(e) => setFormData({...formData, badge: e.target.value})}
                            placeholder="e.g., First Place Winner"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Description *</label>
                        <textarea
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                            rows="3"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Describe the achievement..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Select Icon *</label>
                        <div className="grid grid-cols-6 gap-2">
                            {iconOptions.map((icon) => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setFormData({...formData, icon})}
                                    className={`p-3 text-2xl rounded-xl border-2 transition-all ${
                                        formData.icon === icon 
                                            ? 'border-primary-500 bg-primary-50 scale-110' 
                                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Badge Color *</label>
                        <div className="grid grid-cols-3 gap-2">
                            {colorOptions.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setFormData({...formData, color: color.value})}
                                    className={`px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all ${
                                        formData.color === color.value 
                                            ? `${color.class} border-current scale-105` 
                                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                    }`}
                                >
                                    {color.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Preview</p>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 ${
                            colorOptions.find(c => c.value === formData.color)?.class || 'bg-blue-100 text-blue-700 border-blue-200'
                        }`}>
                            <span className="text-xl">{formData.icon}</span>
                            <span className="font-semibold">{formData.badge || 'Badge Name'}</span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-500/30 flex items-center gap-2"
                        >
                            <Award size={18} />
                            Award Badge
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAchievementModal;
