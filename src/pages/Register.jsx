import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useTeam } from '../context/TeamContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Calendar, Users, Trophy, BookOpen, AlertCircle, X, Plus, Search } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

const Register = () => {
    const { competitions, registerStudent, getStudentsBySchool } = useApp();
    const { createTeam } = useTeam();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get students from the same school for team selection
    const schoolStudents = getStudentsBySchool('WE School').filter(s => s.id !== user?.id);
    
    // Check if competition was pre-selected from recommendations
    const preSelectedCompetition = location.state?.selectedCompetition;
    
    const [formData, setFormData] = useState({
        name: user?.name || '',
        teamName: '',
        grade: '',
        clazz: '', 
        competition: preSelectedCompetition?.name || competitions[0]?.name || '',
        type: 'Individual',
        members: [], // Array of student objects { id, name }
        supervisor: ''
    });

    const [selectedComp, setSelectedComp] = useState(preSelectedCompetition || competitions[0]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Update selectedComp when competition changes
        if (name === 'competition') {
            const comp = competitions.find(c => c.name === value);
            setSelectedComp(comp);
        }
    };

    const handleAddMember = (studentId) => {
        if (!studentId) return;
        const student = schoolStudents.find(s => s.id === studentId);
        if (student && !formData.members.find(m => m.id === studentId)) {
            setFormData(prev => ({
                ...prev,
                members: [...prev.members, { id: student.id, name: student.name }]
            }));
        }
    };

    const removeMember = (id) => {
        setFormData(prev => ({
            ...prev,
            members: prev.members.filter(m => m.id !== id)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        let teamId = null;

        // Ensure team has at least one valid member
        if (formData.type === 'Team') {
            if (formData.members.length === 0) {
                alert("Please add at least one team member.");
                return;
            }

            // Create real team in TeamContext
            const teamResult = createTeam({
                name: formData.teamName || `${formData.name}'s Team`,
                description: `Team for ${formData.competition}`,
                competitionId: selectedComp?.id,
                competitionName: formData.competition,
                members: [
                    { id: user.id, name: user.name, role: 'Team Lead', joinedDate: new Date().toISOString().split('T')[0] },
                    ...formData.members.map(m => ({ ...m, role: 'Member', joinedDate: new Date().toISOString().split('T')[0] }))
                ]
            });
            teamId = teamResult?.id;
        }

        const submitData = {
            ...formData,
            teamId,
            members: formData.type === 'Team' ? formData.members : null
        };

        registerStudent(submitData);
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
                            <CardTitle>Registration Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Registering As"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="E.g., Muhammad Ahmed"
                                        disabled={!!user?.name}
                                        required
                                    />
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">School Grade</label>
                                        <div className="relative">
                                            <select
                                                name="grade"
                                                value={formData.grade}
                                                onChange={handleChange}
                                                className="w-full flex h-11 items-center justify-between rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 transition-all"
                                                required
                                            >
                                                <option value="">Select Grade</option>
                                                {[9, 10, 11, 12].map(g => <option key={g} value={g}>{g}th Grade</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <Input
                                        label="Class / Section"
                                        name="clazz"
                                        value={formData.clazz}
                                        onChange={handleChange}
                                        placeholder="e.g. A"
                                        required
                                    />
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Target Competition</label>
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
                                        <Users className="h-4 w-4 text-primary-600" /> Participation Model
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
                                            Individual Participant
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
                                            Team Entry
                                        </label>
                                    </div>
                                    
                                    {formData.type === 'Team' && (
                                        <div className="animate-in fade-in slide-in-from-top-2 space-y-5 pt-2">
                                            <Input
                                                label="Team Name"
                                                name="teamName"
                                                value={formData.teamName}
                                                onChange={handleChange}
                                                placeholder="e.g. The Innovators"
                                                required={formData.type === 'Team'}
                                            />

                                            <div className="space-y-3">
                                                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Select Team Members (From WE School)</label>
                                                
                                                <div className="flex gap-2">
                                                    <div className="flex-1 relative">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                                                        <select
                                                            className="w-full pl-9 pr-4 h-11 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:bg-slate-900 dark:border-slate-700"
                                                            onChange={(e) => handleAddMember(e.target.value)}
                                                            value=""
                                                        >
                                                            <option value="" disabled>Search students...</option>
                                                            {schoolStudents.map(student => (
                                                                <option key={student.id} value={student.id}>{student.name} ({student.grade}th Grade)</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                
                                                {formData.members.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 pt-2">
                                                        {formData.members.map((member) => (
                                                            <Badge key={member.id} variant="secondary" className="px-3 py-1.5 gap-2 bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                                                                {member.name}
                                                                <X 
                                                                    className="h-3 w-3 cursor-pointer hover:text-red-500" 
                                                                    onClick={() => removeMember(member.id)} 
                                                                />
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    You are already included as the Team Lead.
                                                </p>
                                            </div>

                                            <Input
                                                label="Faculty Supervisor"
                                                name="supervisor"
                                                value={formData.supervisor}
                                                onChange={handleChange}
                                                placeholder="Name of supporting teacher"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end pt-2">
                                    <Button type="submit" size="lg" className="w-full md:w-auto px-10">
                                        Confirm Registration
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
                            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                                <CardContent className="p-6 space-y-6 relative z-10">
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
                                    <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                                        Please ensure all details are accurate. Team registration requires validation from all members.
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
