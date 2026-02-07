import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeam } from '../context/TeamContext';
import { useAuth } from '../context/AuthContext';
import { Send, FileText, Link as LinkIcon, Download, Users, UserPlus, CheckCircle, XCircle, LogOut, Settings, TrendingUp, MessageCircle, Folder, Plus } from 'lucide-react';

export default function TeamHub() {
    const { teamId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const {
        getTeamById,
        teamMessages,
        teamResources,
        sendMessage,
        addResource,
        getMyTeamRequests,
        approveJoinRequest,
        rejectJoinRequest,
        isTeamLeader,
        leaveTeam
    } = useTeam();

    const team = getTeamById(teamId);
    const messages = teamMessages[teamId] || [];
    const resources = teamResources[teamId] || [];
    const isLeader = isTeamLeader(teamId);
    const allRequests = getMyTeamRequests();
    const teamRequests = allRequests.filter(req => req.teamId === teamId);

    const [newMessage, setNewMessage] = useState('');
    const [showResourceModal, setShowResourceModal] = useState(false);
    const [newResource, setNewResource] = useState({ name: '', type: 'document', url: '' });
    const [activeTab, setActiveTab] = useState('chat'); // 'chat', 'requests', 'settings'

    if (!team) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                    <Users className="text-slate-400" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Team not found</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">
                    This team may have been dissolved or you don't have permission to view it.
                </p>
                <button
                    onClick={() => navigate('/student/teams')}
                    className="mt-6 px-6 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all font-medium shadow-lg shadow-violet-500/20"
                >
                    Browse Teams
                </button>
            </div>
        );
    }

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        sendMessage(teamId, newMessage);
        setNewMessage('');
    };

    const handleAddResource = (e) => {
        e.preventDefault();
        addResource(teamId, newResource);
        setShowResourceModal(false);
        setNewResource({ name: '', type: 'document', url: '' });
    };

    const handleApproveRequest = (requestId) => {
        approveJoinRequest(requestId);
    };

    const handleRejectRequest = (requestId) => {
        rejectJoinRequest(requestId);
    };

    const handleLeaveTeam = () => {
        if (window.confirm('Are you sure you want to leave this team?')) {
            leaveTeam(teamId);
            navigate('/student/teams');
        }
    };

    return (
        <div className="space-y-6 sm:space-y-8 animate-fade-in pb-10">
            {/* Header Card */}
            <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 to-purple-600/5 dark:from-violet-900/20 dark:to-purple-900/20"></div>
                <div className="relative z-10 p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6">
                        <div className="flex items-start gap-5">
                            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-violet-500/30 shrink-0">
                                {team.name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">{team.name}</h1>
                                <p className="text-sm text-violet-600 dark:text-violet-400 font-semibold mt-1 uppercase tracking-wide">{team.competitionName}</p>
                                <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">{team.description}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {!isLeader && (
                                <button
                                    onClick={handleLeaveTeam}
                                    className="flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-all text-sm font-semibold"
                                >
                                    <LogOut size={16} />
                                    Leave Team
                                </button>
                            )}
                            {isLeader && (
                                <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-sm font-semibold">
                                    <Settings size={16} />
                                    Settings
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Team Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                            <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-lg">
                                <Users size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">Members</p>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{team.members.length}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                                <TrendingUp size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">Rank</p>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">#{team.rank || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                <MessageCircle size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">Messages</p>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{messages.length}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                                <Folder size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">Resources</p>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{resources.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="flex items-center gap-1 bg-slate-100/50 dark:bg-slate-900/50 p-1.5 rounded-2xl w-fit border border-slate-200 dark:border-slate-800">
                <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === 'chat'
                        ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                >
                    Chat & Resources
                </button>
                {isLeader && (
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${activeTab === 'requests'
                            ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        Join Requests
                        {teamRequests.length > 0 && (
                            <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                                {teamRequests.length}
                            </span>
                        )}
                    </button>
                )}
            </div>

            {/* Chat & Resources Tab */}
            {activeTab === 'chat' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in relative">
                    {/* Chat Section */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-[600px] overflow-hidden">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
                            <div className="flex items-center gap-2.5">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <h2 className="font-bold text-slate-800 dark:text-slate-100">Team Chat</h2>
                            </div>
                            <span className="text-xs font-medium px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded-lg text-slate-500">Live</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30 dark:bg-slate-950/30">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                                    <MessageCircle size={40} className="text-slate-300 mb-2" />
                                    <p className="text-slate-400 text-sm">No messages yet. Start the conversation!</p>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div key={msg.id} className={`flex flex-col ${msg.senderId === user?.id ? 'items-end' : 'items-start'} animate-fade-up`}>
                                        <div className={`max-w-[80%] rounded-2xl p-3.5 px-5 shadow-sm ${msg.senderId === user?.id
                                                ? 'bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-br-none'
                                                : 'bg-white dark:bg-slate-800 dark:text-slate-100 text-slate-800 border border-slate-100 dark:border-slate-700 rounded-bl-none'
                                            }`}>
                                            <p className="text-sm leading-relaxed">{msg.text}</p>
                                        </div>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 px-1 font-medium">{msg.sender} • {msg.timestamp}</span>
                                    </div>
                                ))
                            )}
                        </div>

                        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                            <div className="flex gap-2 items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-violet-500/50 focus-within:border-violet-500 transition-all">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-2 bg-transparent text-sm focus:outline-none dark:text-slate-100"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="p-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Members & Resources */}
                    <div className="space-y-6">
                        {/* Team Members Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Users size={20} className="text-violet-600" />
                                <h2 className="font-bold text-slate-800 dark:text-slate-100">Team Members</h2>
                            </div>
                            <div className="space-y-4">
                                {team.members.map(member => (
                                    <div key={member.id} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 ring-2 ring-white dark:ring-slate-900">
                                                {member.avatar || member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{member.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{member.role}</p>
                                            </div>
                                        </div>
                                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Resources Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col h-[350px]">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                    <Folder className="text-violet-600" size={18} />
                                    Resources
                                </h2>
                                <button
                                    onClick={() => setShowResourceModal(true)}
                                    className="p-1.5 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 dark:bg-violet-900/20 dark:text-violet-400 dark:hover:bg-violet-900/40 transition-colors"
                                    title="Add Resource"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            {resources.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                                    <Folder className="text-slate-300 mb-2" size={32} />
                                    <p className="text-xs text-slate-500">No resources shared yet</p>
                                </div>
                            ) : (
                                <div className="flex-1 overflow-y-auto space-y-3 pr-1 sidebar-scroll">
                                    {resources.map(res => (
                                        <div key={res.id} className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-violet-200 dark:hover:border-violet-800 bg-slate-50/50 dark:bg-slate-900/50 transition-all group">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-1 p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm text-slate-400 group-hover:text-violet-500 transition-colors">
                                                        {res.type === 'link' ? <LinkIcon size={14} /> : <FileText size={14} />}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-1">{res.name}</p>
                                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Added by {res.uploadedBy}</p>
                                                    </div>
                                                </div>
                                                <button className="text-slate-300 hover:text-violet-600 transition-colors">
                                                    <Download size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Join Requests Tab */}
            {activeTab === 'requests' && isLeader && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 animate-fade-in">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3">
                        <UserPlus className="text-violet-600" size={24} />
                        Pending Requests
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold">
                            {teamRequests.length}
                        </span>
                    </h2>

                    {teamRequests.length === 0 ? (
                        <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <CheckCircle className="text-slate-300 dark:text-slate-600" size={24} />
                            </div>
                            <h3 className="font-semibold text-slate-700 dark:text-slate-200">All caught up!</h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">No pending join requests at the moment.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {teamRequests.map(request => (
                                <div key={request.id} className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-violet-300 dark:hover:border-violet-700 transition-all bg-slate-50/50 dark:bg-slate-900/50">
                                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                                                {request.userAvatar}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-slate-100 text-lg">{request.userName}</p>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 italic">"{request.message}"</p>
                                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                                    Requested on {request.requestDate}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 w-full sm:w-auto">
                                            <button
                                                onClick={() => handleRejectRequest(request.id)}
                                                className="flex-1 sm:flex-none px-4 py-2 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-all font-medium flex items-center justify-center gap-2"
                                            >
                                                <XCircle size={18} />
                                                Decline
                                            </button>
                                            <button
                                                onClick={() => handleApproveRequest(request.id)}
                                                className="flex-1 sm:flex-none px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition-all font-bold flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle size={18} />
                                                Approve
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Add Resource Modal */}
            {showResourceModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-8 shadow-2xl border border-white/20 animate-scale-in">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
                                <Folder size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Add Resource</h3>
                        </div>

                        <form onSubmit={handleAddResource} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Resource Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Project Documentation"
                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                                    value={newResource.name}
                                    onChange={e => setNewResource({ ...newResource, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Type</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['document', 'link', 'image'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setNewResource({ ...newResource, type })}
                                            className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${newResource.type === type
                                                    ? 'bg-violet-50 dark:bg-violet-900/20 border-violet-500 text-violet-700 dark:text-violet-300'
                                                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                }`}
                                        >
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">URL / Path</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="https://..."
                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                                    value={newResource.url}
                                    onChange={e => setNewResource({ ...newResource, url: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setShowResourceModal(false)}
                                    className="flex-1 px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-bold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 font-bold shadow-lg shadow-violet-500/20 transition-all"
                                >
                                    Add Resource
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
