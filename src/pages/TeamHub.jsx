import React, { useState } from 'react';
import { useTeam } from '../context/TeamContext';
import { Send, FileText, Link as LinkIcon, Download, Users } from 'lucide-react';

export default function TeamHub() {
    const { team, messages, resources, sendMessage, addResource } = useTeam();
    const [newMessage, setNewMessage] = useState('');
    const [showResourceModal, setShowResourceModal] = useState(false);
    const [newResource, setNewResource] = useState({ name: '', type: 'document', url: '' });

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        sendMessage(newMessage);
        setNewMessage('');
    };

    const handleAddResource = (e) => {
        e.preventDefault();
        addResource(newResource);
        setShowResourceModal(false);
        setNewResource({ name: '', type: 'document', url: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-50">Team Collaboration Hub</h1>
                    <p className="text-slate-500 dark:text-slate-400">Team: <span className="font-semibold text-primary-600">{team.name}</span></p>
                </div>
                <div className="flex lg:hidden -space-x-2">
                    {team.members.map(member => (
                        <div key={member.id} className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center border-2 border-white text-xs font-bold text-primary-700" title={member.name}>
                            {member.avatar}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chat Section */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-[500px]">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Team Chat</h2>
                        <span className="text-xs text-slate-400 dark:text-slate-500">Live</span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col ${msg.sender === 'Me' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[80%] rounded-lg p-3 ${msg.sender === 'Me' ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{msg.sender} • {msg.timestamp}</span>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                        />
                        <button type="submit" className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                            <Send size={18} />
                        </button>
                    </form>
                </div>

                {/* Right Column: Members & Resources */}
                <div className="space-y-6">
                    
                    {/* Team Members Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Users size={20} className="text-primary-600" />
                            <h2 className="font-semibold text-slate-800 dark:text-slate-100">Team Members</h2>
                        </div>
                        <div className="space-y-3">
                            {team.members.map(member => (
                                <div key={member.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700">
                                            {member.avatar}
                                        </div>
                                        <div>
                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{member.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{member.role}</p>
                                        </div>
                                    </div>
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Resources Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 flex flex-col h-[300px]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold text-slate-800 dark:text-slate-100">Shared Resources</h2>
                            <button 
                                onClick={() => setShowResourceModal(true)}
                                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                            >
                                + Add New
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3">
                            {resources.map(res => (
                                <div key={res.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-primary-100 transition-all group">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 text-slate-400 group-hover:text-primary-500">
                                                {res.type === 'link' ? <LinkIcon size={16} /> : <FileText size={16} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-100 line-clamp-1">{res.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">By {res.uploadedBy}</p>
                                            </div>
                                        </div>
                                        <button className="text-slate-300 hover:text-primary-600">
                                            <Download size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Add Resource Modal */}
            {showResourceModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Add Resource</h3>
                        <form onSubmit={handleAddResource} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Resource Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                                    value={newResource.name}
                                    onChange={e => setNewResource({...newResource, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Type</label>
                                <select 
                                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                                    value={newResource.type}
                                    onChange={e => setNewResource({...newResource, type: e.target.value})}
                                >
                                    <option value="document">Document</option>
                                    <option value="link">Link</option>
                                    <option value="image">Image</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">URL / Path</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                                    value={newResource.url}
                                    onChange={e => setNewResource({...newResource, url: e.target.value})}
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button 
                                    type="button"
                                    onClick={() => setShowResourceModal(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
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
