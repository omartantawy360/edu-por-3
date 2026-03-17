import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Check, X, RotateCcw } from 'lucide-react';

const DEFAULT_RUBRIC = [
    { id: 'innovation', name: 'Innovation', maxScore: 10 },
    { id: 'design', name: 'Design', maxScore: 10 },
    { id: 'presentation', name: 'Presentation', maxScore: 10 },
    { id: 'technical', name: 'Technical Quality', maxScore: 10 },
];

const RubricBuilder = ({ criteria = DEFAULT_RUBRIC, onChange, disabled = false }) => {
    const [newName, setNewName] = useState('');
    const [newMax, setNewMax] = useState(10);
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editMax, setEditMax] = useState(10);

    const handleAdd = () => {
        if (!newName.trim()) return;
        const id = newName.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
        const updated = [...criteria, { id, name: newName.trim(), maxScore: Number(newMax) || 10 }];
        onChange(updated);
        setNewName('');
        setNewMax(10);
    };

    const handleRemove = (id) => {
        onChange(criteria.filter(c => c.id !== id));
    };

    const handleEditStart = (criterion) => {
        setEditId(criterion.id);
        setEditName(criterion.name);
        setEditMax(criterion.maxScore);
    };

    const handleEditSave = () => {
        if (!editName.trim()) return;
        onChange(criteria.map(c =>
            c.id === editId ? { ...c, name: editName.trim(), maxScore: Number(editMax) || 10 } : c
        ));
        setEditId(null);
    };

    const handleReset = () => {
        onChange([...DEFAULT_RUBRIC]);
    };

    const totalMax = criteria.reduce((sum, c) => sum + c.maxScore, 0);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Evaluation Criteria</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Total: {totalMax} points across {criteria.length} criteria</p>
                </div>
                {!disabled && (
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                    >
                        <RotateCcw size={10} /> Reset Default
                    </button>
                )}
            </div>

            {/* Criteria List */}
            <div className="space-y-2">
                {criteria.map((criterion, index) => (
                    <div
                        key={criterion.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50 group"
                    >
                        <span className="h-6 w-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                            {index + 1}
                        </span>

                        {editId === criterion.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="flex-1 px-2 py-1 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    autoFocus
                                />
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] text-slate-400">/</span>
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={editMax}
                                        onChange={(e) => setEditMax(e.target.value)}
                                        className="w-14 px-2 py-1 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-sm font-bold text-center text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    />
                                </div>
                                <button onClick={handleEditSave} className="h-7 w-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 hover:bg-emerald-200 transition-colors">
                                    <Check size={12} />
                                </button>
                                <button onClick={() => setEditId(null)} className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                                    <X size={12} />
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300">{criterion.name}</span>
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-md">
                                    /{criterion.maxScore}
                                </span>
                                {!disabled && (
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEditStart(criterion)} className="h-7 w-7 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-colors">
                                            <Edit3 size={12} />
                                        </button>
                                        <button onClick={() => handleRemove(criterion.id)} className="h-7 w-7 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center text-red-400 transition-colors">
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Add New Criterion */}
            {!disabled && (
                <div className="flex items-center gap-2 p-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Criterion name..."
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400"
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    />
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-400 font-bold">/</span>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={newMax}
                            onChange={(e) => setNewMax(e.target.value)}
                            className="w-14 px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-center text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>
                    <button
                        onClick={handleAdd}
                        disabled={!newName.trim()}
                        className="h-9 w-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default RubricBuilder;
