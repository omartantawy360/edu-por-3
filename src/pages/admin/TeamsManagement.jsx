import React, { useState } from 'react';
import { useTeam } from '../../context/TeamContext';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Filter, Plus, UserPlus, CheckCircle, XCircle, Edit, Trash2, Shield, TrendingUp, AlertCircle } from 'lucide-react';

export default function TeamsManagement() {
    const { teams, joinRequests, approveJoinRequest, rejectJoinRequest, createTeam } = useTeam();
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterCompetition, setFilterCompetition] = useState('all');
    const [activeTab, setActiveTab] = useState('teams'); // 'teams', 'requests'
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTeam, setNewTeam] = useState({
        name: '',
        description: '',
        competitionId: '',
        competitionName: ''
    });

    const pendingRequests = joinRequests.filter(req => req.status === 'pending');

    // Filter teams
    const filteredTeams = teams.filter(team => {
        const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            team.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterCompetition === 'all' || team.competitionId === filterCompetition;
        return matchesSearch && matchesFilter;
    });

    const competitions = [
        { id: 'c1', name: 'Technology and Innovation Summit' },
        { id: 'c2', name: 'Science and Engineering Fair' },
        { id: 'c3', name: 'AI Programming Championship' },
        { id: 'c4', name: 'Web Applications Challenge' },
        { id: 'c5', name: 'International Robotics Olympiad' }
    ];

    const handleApproveRequest = (requestId) => {
        approveJoinRequest(requestId);
    };

    const handleRejectRequest = (requestId) => {
        rejectJoinRequest(requestId);
    };

    const handleCreateTeam = (e) => {
        e.preventDefault();
        const competition = competitions.find(c => c.id === newTeam.competitionId);
        createTeam({
            ...newTeam,
            competitionName: competition?.name || ''
        });
        setShowCreateModal(false);
        setNewTeam({ name: '', description: '', competitionId: '', competitionName: '' });
        alert('Team created successfully!');
    };

    const getTeamStatusColor = (team) => {
        if (team.members.length >= 5) return 'text-green-600 dark:text-green-400';
        if (team.members.length >= 3) return 'text-blue-600 dark:text-blue-400';
        return 'text-yellow-600 dark:text-yellow-400';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-50">Teams Management</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage all teams and join requests across competitions
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                >
                    <Plus size={18} />
                    Create Team
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Total Teams</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{teams.length}</p>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                            <Users className="text-violet-600 dark:text-violet-400" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Pending Requests</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{pendingRequests.length}</p>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                            <UserPlus className="text-orange-600 dark:text-orange-400" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Total Members</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                {teams.reduce((sum, team) => sum + team.members.length, 0)}
                            </p>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Shield className="text-blue-600 dark:text-blue-400" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Avg Team Size</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                {(teams.reduce((sum, team) => sum + team.members.length, 0) / teams.length).toFixed(1)}
                            </p>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
                <button
                    onClick={() => setActiveTab('teams')}
                    className={`px-4 py-2 font-medium text-sm transition-all ${activeTab === 'teams'
                            ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-600'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                >
                    All Teams ({filteredTeams.length})
                </button>
                <button
                    onClick={() => setActiveTab('requests')}
                    className={`px-4 py-2 font-medium text-sm transition-all relative ${activeTab === 'requests'
                            ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-600'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                >
                    Join Requests
                    {pendingRequests.length > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                            {pendingRequests.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Teams Tab */}
            {activeTab === 'teams' && (
                <>
                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search teams..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                        </div>
                        <div className="sm:w-64 relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <select
                                value={filterCompetition}
                                onChange={(e) => setFilterCompetition(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none"
                            >
                                <option value="all">All Competitions</option>
                                {competitions.map(comp => (
                                    <option key={comp.id} value={comp.id}>{comp.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Teams Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Team</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Competition</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Leader</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Members</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Rank</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Score</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {filteredTeams.map(team => (
                                        <tr key={team.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                        {team.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-800 dark:text-slate-100">{team.name}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">{team.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">{team.competitionName}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-800 dark:text-slate-100">{team.leaderName}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Users size={16} className={getTeamStatusColor(team)} />
                                                    <span className={`text-sm font-medium ${getTeamStatusColor(team)}`}>
                                                        {team.members.length}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-800 dark:text-slate-100">#{team.rank}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{team.score}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => navigate(`/admin/teams/${team.id}`)}
                                                        className="p-2 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-all"
                                                        title="View Details"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => alert('Delete team feature coming soon!')}
                                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                        title="Delete Team"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Join Requests Tab */}
            {activeTab === 'requests' && (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
                        Pending Join Requests ({pendingRequests.length})
                    </h2>
                    {pendingRequests.length === 0 ? (
                        <div className="text-center py-12">
                            <AlertCircle className="mx-auto text-slate-300 dark:text-slate-700" size={48} />
                            <p className="text-slate-500 dark:text-slate-400 mt-4">No pending join requests</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pendingRequests.map(request => (
                                <div key={request.id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-violet-300 dark:hover:border-violet-700 transition-all">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                {request.userAvatar}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-slate-800 dark:text-slate-100">{request.userName}</p>
                                                    <span className="text-sm text-slate-500 dark:text-slate-400">→</span>
                                                    <p className="text-sm font-medium text-violet-600 dark:text-violet-400">{request.teamName}</p>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{request.message}</p>
                                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Requested on {request.requestDate}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleApproveRequest(request.id)}
                                                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                                                title="Approve"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleRejectRequest(request.id)}
                                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                                                title="Reject"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Create Team Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-2xl">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Create New Team</h3>
                        <form onSubmit={handleCreateTeam} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Team Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newTeam.name}
                                    onChange={e => setNewTeam({ ...newTeam, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                    placeholder="Enter team name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Description</label>
                                <textarea
                                    required
                                    value={newTeam.description}
                                    onChange={e => setNewTeam({ ...newTeam, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                                    placeholder="Describe the team's focus"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Competition</label>
                                <select
                                    required
                                    value={newTeam.competitionId}
                                    onChange={e => setNewTeam({ ...newTeam, competitionId: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                >
                                    <option value="">Select a competition</option>
                                    {competitions.map(comp => (
                                        <option key={comp.id} value={comp.id}>{comp.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                                >
                                    Create Team
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
