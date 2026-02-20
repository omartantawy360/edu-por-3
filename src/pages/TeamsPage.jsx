import React, { useState } from 'react';
import { useTeam } from '../context/TeamContext';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Search, Filter, Plus, Users, Shield, Sparkles } from 'lucide-react';
import TeamCard from '../components/ui/TeamCard';

export default function TeamsPage() {
    const { teams, userTeams, requestToJoinTeam, getUserRequests, isTeamMember, createTeam } = useTeam();
    const { competitions, addNotification } = useApp();
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterCompetition, setFilterCompetition] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTeam, setNewTeam] = useState({ name: '', description: '', competitionId: '' });

    // Filter logic
    const filteredTeams = teams.filter(team => {
        const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            team.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterCompetition === 'all' || team.competitionId === filterCompetition;
        return matchesSearch && matchesFilter && !isTeamMember(team.id);
    });

    const isPending = (teamId) => {
        const requests = getUserRequests();
        return requests.some(r => r.teamId === teamId && r.status === 'pending');
    };

    const handleViewTeam = (team) => {
        navigate(`/teams/${team.id}`);
    };

    const handleRequestToJoin = (team) => {
        // Implementation for join request modal
        setSelectedTeam(team);
        setShowJoinModal(true);
    };

    const [showJoinModal, setShowJoinModal] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [joinMessage, setJoinMessage] = useState('');

    const submitJoinRequest = async () => {
        if (selectedTeam) {
            await requestToJoinTeam(selectedTeam.id, joinMessage);
            setShowJoinModal(false);
            setJoinMessage('');
            addNotification(`Request sent to ${selectedTeam.name}`, 'success');
        }
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        const res = await createTeam(newTeam);
        if (res) {
            setShowCreateModal(false);
            setNewTeam({ name: '', description: '', competitionId: '' });
            addNotification('Team created successfully!', 'success');
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl p-8 sm:p-10">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute -right-10 -bottom-10 opacity-10 transform rotate-12">
                    <Users size={300} />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-cyan-100 mb-3">
                            <Shield size={14} />
                            Collaborate & Conquer
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
                            Find Your Dream Team
                        </h1>
                        <p className="text-indigo-100 max-w-lg text-lg">
                            Connect with like-minded students, form squads, and compete together in various challenges.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 hover:scale-105 transition-all font-bold shadow-lg"
                    >
                        <Plus size={20} />
                        Create New Team
                    </button>
                </div>
            </div>

            {/* Create Team Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-white/20 animate-scale-in">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Create New Team</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Start a new squad and invite others to join.</p>
                        </div>
                        <form onSubmit={handleCreateTeam} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Team Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700"
                                    value={newTeam.name}
                                    onChange={e => setNewTeam({...newTeam, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    required
                                    className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 resize-none"
                                    rows={3}
                                    value={newTeam.description}
                                    onChange={e => setNewTeam({...newTeam, description: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Competition</label>
                                <select
                                    required
                                    className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700"
                                    value={newTeam.competitionId}
                                    onChange={e => setNewTeam({...newTeam, competitionId: e.target.value})}
                                >
                                    <option value="">Select a competition</option>
                                    {competitions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold">Create Team</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* My Teams Section */}
            {userTeams.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Shield className="text-indigo-500" size={20} />
                        My Teams
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userTeams.map(team => (
                            <TeamCard
                                key={team.id}
                                team={team}
                                onAction={handleViewTeam}
                                actionType="view"
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Search and Content */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-16 z-20 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl p-4 -mx-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search teams by name or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
                        <Filter className="text-slate-400 shrink-0" size={18} />
                        <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => setFilterCompetition('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${filterCompetition === 'all' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                All Matches
                            </button>
                            {competitions.map(comp => (
                                <button
                                    key={comp.id}
                                    onClick={() => setFilterCompetition(comp.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${filterCompetition === comp.id ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    {comp.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                            Available Teams <span className="text-slate-400 text-sm font-normal ml-2">{filteredTeams.length} results</span>
                        </h2>
                    </div>

                    {filteredTeams.length === 0 ? (
                        <div className="text-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="text-slate-400" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">No teams found</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-2">
                                Try adjusting your search or filters to find what you're looking for.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTeams.map(team => (
                                <TeamCard
                                    key={team.id}
                                    team={team}
                                    onAction={isTeamMember(team.id) ? handleViewTeam : handleRequestToJoin}
                                    actionType={isTeamMember(team.id) ? 'view' : 'join'}
                                    isPending={isPending(team.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Join Request Modal - Modernized */}
            {showJoinModal && selectedTeam && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-white/20 animate-scale-in">
                        <div className="text-center mb-6">
                            <div className="h-16 w-16 mx-auto bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                                <Shield size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                                Join {selectedTeam.name}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                                Send a request to the team leader explaining why you'd be a great addition.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <textarea
                                value={joinMessage}
                                onChange={(e) => setJoinMessage(e.target.value)}
                                placeholder="I have experience in..."
                                rows={4}
                                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-shadow"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowJoinModal(false);
                                        setSelectedTeam(null);
                                        setJoinMessage('');
                                    }}
                                    className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitJoinRequest}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all font-bold"
                                >
                                    Send Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
