import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Calendar, Users, Trophy, BookOpen, AlertCircle } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

const Register = () => {
    const { competitions, registerStudent } = useApp();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Check if competition was pre-selected from recommendations
    const preSelectedCompetition = location.state?.selectedCompetition;
    
    const [formData, setFormData] = useState({
        name: '',
        grade: '',
        clazz: '', 
        competition: preSelectedCompetition?.name || competitions[0]?.name || '',
        type: 'Individual',
        members: ''
    });

    const [selectedComp, setSelectedComp] = useState(preSelectedCompetition || competitions[0]);

    useEffect(() => {
        const comp = competitions.find(c => c.name === formData.competition);
        setSelectedComp(comp);
    }, [formData.competition, competitions]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        registerStudent(formData);
        navigate('/student');
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50">Register</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Complete your registration for the competition</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Student Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Full Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="E.g., Muhammad Ahmed"
                                        required
                                    />
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Grade</label>
                                        <div className="relative">
                                            <select
                                                name="grade"
                                                value={formData.grade}
                                                onChange={handleChange}
                                                className="w-full flex h-11 items-center justify-between rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400/50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 transition-all"
                                                required
                                            >
                                                <option value="">Select Grade</option>
                                                {[9, 10, 11, 12].map(g => <option key={g} value={g}>{g}th Grade</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <Input
                                        label="Class"
                                        name="clazz"
                                        value={formData.clazz}
                                        onChange={handleChange}
                                        placeholder="e.g. A"
                                        required
                                    />
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Select Competition</label>
                                        <select
                                            name="competition"
                                            value={formData.competition}
                                            onChange={handleChange}
                                            className="w-full flex h-11 items-center justify-between rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 transition-all"
                                        >
                                            {competitions.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 space-y-4">
                                    <label className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                        <Users className="h-4 w-4" /> Participation Type
                                    </label>
                                    <div className="flex gap-6">
                                        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="type"
                                                value="Individual"
                                                checked={formData.type === 'Individual'}
                                                onChange={handleChange}
                                                className="text-primary-600 focus:ring-primary-500 h-4 w-4"
                                            />
                                            Individual
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="type"
                                                value="Team"
                                                checked={formData.type === 'Team'}
                                                onChange={handleChange}
                                                className="text-primary-600 focus:ring-primary-500 h-4 w-4"
                                            />
                                            Team
                                        </label>
                                    </div>
                                    
                                    {formData.type === 'Team' && (
                                        <div className="animate-in fade-in slide-in-from-top-2">
                                            <Input
                                                label="Team Members"
                                                name="members"
                                                value={formData.members}
                                                onChange={handleChange}
                                                placeholder="Enter full names, separated by commas"
                                                required
                                            />
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                Include all members except yourself.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end pt-2">
                                    <Button type="submit" size="lg" className="w-full md:w-auto">
                                        Complete Registration
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Details Section */}
                <div className="lg:col-span-1">
                    {selectedComp ? (
                        <div className="space-y-4 sm:space-y-6 lg:sticky lg:top-6">
                            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl">
                                <CardContent className="p-6 space-y-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">{selectedComp.type}</Badge>
                                            {selectedComp.type === 'Outer' && <Badge className="bg-blue-500 text-white border-none">Global</Badge>}
                                        </div>
                                        <h2 className="text-2xl font-bold">{selectedComp.name}</h2>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3 text-slate-300">
                                            <BookOpen className="h-5 w-5 mt-0.5 shrink-0" />
                                            <p className="text-sm leading-relaxed">{selectedComp.description || "No description available."}</p>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 text-slate-300">
                                            <Calendar className="h-5 w-5 shrink-0" />
                                            <div className="text-sm">
                                                <p>Start: {selectedComp.startDate || "TBA"}</p>
                                                <p>End: {selectedComp.endDate || "TBA"}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-slate-300">
                                            <Users className="h-5 w-5 shrink-0" />
                                            <p className="text-sm">Max Participants: {selectedComp.maxParticipants || "Unlimited"}</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/10">
                                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Competition Stages</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedComp.stages.map((stage, i) => (
                                                <span key={i} className="px-2 py-1 bg-white/10 rounded text-xs text-white">
                                                    {stage}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800">
                                <CardContent className="p-4 flex gap-3">
                                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                                    <p className="text-sm text-amber-800 dark:text-amber-200">
                                        Please ensure all details are accurate. Team registration requires approval from parents of all members.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <Card className="h-full flex items-center justify-center p-8 text-center text-slate-400 dark:text-slate-500">
                            <div>
                                <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>Select a competition to view details</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Register;
