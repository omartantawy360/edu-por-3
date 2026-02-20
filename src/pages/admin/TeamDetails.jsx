import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeam } from '../../context/TeamContext';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Users, Crown, Mail, Calendar, Trophy, MessageSquare, FileText, Settings, UserMinus, UserPlus, Shield, TrendingUp, Award, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import api from '../../services/api';

export default function TeamDetails() {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        getTeamById,
        teamMessages,
        teamResources,
        approveJoinRequest,
        rejectJoinRequest,
        joinRequests,
        fetchTeamMessages,
        fetchTeamResources
    } = useTeam();

    const { addNotification } = useApp();
    const [activeTab, setActiveTab] = useState('overview');
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        type: 'warning'
    });

    const team = getTeamById(teamId);
    const messages = teamMessages[teamId] || [];
    const resources = teamResources[teamId] || [];
    const teamRequests = joinRequests.filter(r => r.teamId === teamId && r.status === 'pending');

    useEffect(() => {
        if (teamId) {
            fetchTeamMessages(teamId);
            fetchTeamResources(teamId);
        }
    }, [teamId]);

    if (!team) {
        return (
            <div className="text-center py-12">
                <Shield className="mx-auto text-slate-300 dark:text-slate-700" size={64} />
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-4">Team Not Found</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">The team you're looking for doesn't exist.</p>
                <button
                    onClick={() => navigate('/admin/teams')}
                    className="mt-6 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all"
                >
                    Back to Teams
                </button>
            </div>
        );
    }

    const handleRemoveMember = (memberId, memberName) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Remove Member',
            message: `Are you sure you want to remove ${memberName} from the team?`,
            onConfirm: async () => {
                try {
                    await api.delete(`/teams/${teamId}/members/${memberId}`);
                    addNotification(`${memberName} removed from team`, "info");
                    // Refresh or update local state
                    window.location.reload(); // Quick way for now
                } catch (err) {
                    addNotification("Failed to remove member", "error");
                }
            },
            type: 'danger'
        });
    };

    const handleChangeLeader = (memberId, memberName) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Transfer Leadership',
            message: `Are you sure you want to transfer leadership to ${memberName}?`,
            onConfirm: async () => {
                try {
                    await api.put(`/teams/${teamId}/leader`, { newLeaderId: memberId });
                    addNotification(`Leadership transferred to ${memberName}`, "success");
                    window.location.reload();
                } catch (err) {
                    addNotification("Failed to transfer leadership", "error");
                }
            },
            type: 'warning'
        });
    };

    const getGradient = () => {
        const gradients = [
            'from-violet-500 to-purple-600',
            'from-blue-500 to-cyan-600',
            'from-pink-500 to-rose-600',
            'from-orange-500 to-red-600',
            'from-green-500 to-emerald-600'
        ];
        const index = parseInt(team.id.replace('t', '')) % gradients.length;
        return gradients[index];
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <button
                    onClick={() => navigate('/admin/teams')}
                    className="flex items-center gap-2 text-violet-600 dark:text-violet-400 hover:underline mb-4"
                >
                    <ArrowLeft size={18} />
                    Back to Teams
                </button>

                <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl p-6 text-white">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`h-16 w-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold`}>
                                {team.name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{team.name}</h1>
                                <p className="text-white/80 mt-1">{team.description}</p>
                                <p className="text-sm text-white/70 mt-2">{team.competitionName}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => addNotification('Team settings will be available in the next update.', 'info')}
                            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                        >
                            <Settings size={20} />
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <Users className="mb-2" size={20} />
                            <p className="text-2xl font-bold">{team.members.length}</p>
                            <p className="text-sm text-white/70">Members</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <Trophy className="mb-2" size={20} />
                            <p className="text-2xl font-bold">#{team.rank}</p>
                            <p className="text-sm text-white/70">Rank</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <TrendingUp className="mb-2" size={20} />
                            <p className="text-2xl font-bold">{team.score}</p>
                            <p className="text-sm text-white/70">Score</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <MessageSquare className="mb-2" size={20} />
                            <p className="text-2xl font-bold">{messages.length}</p>
                            <p className="text-sm text-white/70">Messages</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 font-medium text-sm transition-all ${activeTab === 'overview'
                            ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-600'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('members')}
                    className={`px-4 py-2 font-medium text-sm transition-all ${activeTab === 'members'
                            ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-600'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                >
                    Members ({team.members.length})
                </button>
                <button
                    onClick={() => setActiveTab('requests')}
                    className={`px-4 py-2 font-medium text-sm transition-all relative ${activeTab === 'requests'
                            ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-600'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                >
                    Join Requests
                    {teamRequests.length > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                            {teamRequests.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('activity')}
                    className={`px-4 py-2 font-medium text-sm transition-all ${activeTab === 'activity'
                            ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-600'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                >
                    Activity
                </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Team Info */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Team Information</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm text-slate-500 dark:text-slate-400">Team Leader</label>
                                <p className="font-medium text-slate-800 dark:text-slate-100">{team.leaderName}</p>
                            </div>
                            <div>
                                <label className="text-sm text-slate-500 dark:text-slate-400">Competition</label>
                                <p className="font-medium text-slate-800 dark:text-slate-100">{team.competitionName}</p>
                            </div>
                            <div>
                                <label className="text-sm text-slate-500 dark:text-slate-400">Created</label>
                                <p className="font-medium text-slate-800 dark:text-slate-100">
                                    {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Achievements */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Achievements</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {team.achievements && team.achievements.map((achievement, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white mb-2">
                                        <Award size={24} />
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">{achievement}</p>
                                </div>
                            ))}
                            {(!team.achievements || team.achievements.length === 0) && (
                                <p className="col-span-3 text-center text-slate-500 dark:text-slate-400 py-4">No achievements yet</p>
                            )}
                        </div>
                    </div>

                    {/* Resources */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Shared Resources</h3>
                        <div className="space-y-2">
                            {resources.length === 0 ? (
                                <p className="text-slate-500 dark:text-slate-400 text-sm py-4">No resources shared yet</p>
                            ) : (
                                resources.map((resource, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-800 rounded-lg">
                                        <FileText className="text-violet-600 dark:text-violet-400" size={20} />
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-800 dark:text-slate-100 text-sm">{resource.title}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{resource.type}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Recent Messages</h3>
                        <div className="space-y-3">
                            {messages.slice(-5).map((msg, idx) => (
                                <div key={idx} className="flex gap-3">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                        {msg.sender.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{msg.sender}</p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            {messages.length === 0 && (
                                <p className="text-slate-500 dark:text-slate-400 text-sm py-4">No messages yet</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Team Members ({team.members.length})</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {team.members.map((member, idx) => (
                            <div key={idx} className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-violet-300 dark:hover:border-violet-700 transition-all">
                                <div className="flex items-start gap-3">
                                    <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${getGradient()} flex items-center justify-center text-white font-bold`}>
                                        {member.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-slate-800 dark:text-slate-100">{member.name}</p>
                                            {member.name === team.leaderName && (
                                                <Crown className="text-yellow-500" size={16} />
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{member.role || 'Member'}</p>

                                        {/* Admin Actions */}
                                        <div className="flex gap-2 mt-3">
                                            {member.name !== team.leaderName && (
                                                <>
                                                    <button
                                                        onClick={() => handleChangeLeader(member.id, member.name)}
                                                        className="flex items-center gap-1 px-2 py-1 text-xs bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-all"
                                                    >
                                                        <Crown size={12} />
                                                        Make Leader
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveMember(member.id, member.name)}
                                                        className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                                                    >
                                                        <UserMinus size={12} />
                                                        Remove
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Join Requests Tab */}
            {activeTab === 'requests' && (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
                        Join Requests ({teamRequests.length})
                    </h3>
                    {teamRequests.length === 0 ? (
                        <div className="text-center py-12">
                            <UserPlus className="mx-auto text-slate-300 dark:text-slate-700" size={48} />
                            <p className="text-slate-500 dark:text-slate-400 mt-4">No pending join requests</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {teamRequests.map(request => (
                                <div key={request.id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                {request.userAvatar}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800 dark:text-slate-100">{request.userName}</p>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{request.message}</p>
                                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                                                    Requested on {request.requestDate}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => approveJoinRequest(request.id)}
                                                className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-sm font-medium"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => rejectJoinRequest(request.id)}
                                                className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-medium"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Team Activity</h3>
                    <div className="space-y-4">
                        <div className="flex gap-3 p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                            <MessageSquare className="text-violet-600 dark:text-violet-400" size={20} />
                            <div>
                                <p className="font-medium text-slate-800 dark:text-slate-100">{messages.length} messages sent</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Team communication activity</p>
                            </div>
                        </div>
                        <div className="flex gap-3 p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                            <FileText className="text-blue-600 dark:text-blue-400" size={20} />
                            <div>
                                <p className="font-medium text-slate-800 dark:text-slate-100">{resources.length} resources shared</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Documents and files</p>
                            </div>
                        </div>
                        <div className="flex gap-3 p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                            <Users className="text-green-600 dark:text-green-400" size={20} />
                            <div>
                                <p className="font-medium text-slate-800 dark:text-slate-100">{team.members.length} active members</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Current team size</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Confirmation Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                onConfirm={confirmDialog.onConfirm}
                title={confirmDialog.title}
                message={confirmDialog.message}
                type={confirmDialog.type}
                confirmText="Confirm Action"
                cancelText="Cancel"
            />
        </div>
    );
}
