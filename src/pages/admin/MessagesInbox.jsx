import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { MessageCircle, Send, Search, Inbox, Mail, MailOpen } from 'lucide-react';
import MessageBubble from '../../components/chat/MessageBubble';

export default function MessagesInbox() {
    const { user } = useAuth();
    const { getAllConversations, sendMessage, markAsRead, getUnreadCount } = useChat();
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef(null);

    const conversations = getAllConversations();
    const unreadCount = getUnreadCount();

    const filteredConversations = conversations.filter(conv =>
        conv.studentName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (selectedConversation) {
            scrollToBottom();
            // Mark messages in this conversation as read
            const unreadIds = selectedConversation.messages
                .filter(m => !m.read && m.senderRole === 'student')
                .map(m => m.id);
            if (unreadIds.length > 0) {
                markAsRead(unreadIds);
            }
        }
    }, [selectedConversation?.messages.length]);

    const handleSend = (e) => {
        e.preventDefault();
        if (messageText.trim() && selectedConversation) {
            sendMessage(messageText.trim(), selectedConversation.studentId);
            setMessageText('');
            setTimeout(scrollToBottom, 100);
        }
    };

    const handleSelectConversation = (conv) => {
        setSelectedConversation(conv);
    };

    return (
        <div className="h-[calc(100vh-120px)] flex gap-4">
            {/* Conversations List */}
            <div className="w-80 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-3">
                        <MessageCircle className="text-violet-600" size={20} />
                        Messages
                        {unreadCount > 0 && (
                            <span className="h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                                {unreadCount}
                            </span>
                        )}
                    </h2>
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>
                </div>

                {/* Conversations */}
                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-6">
                            <Inbox className="text-slate-300 dark:text-slate-700 mb-3" size={48} />
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                {searchQuery ? 'No conversations found' : 'No messages yet'}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200 dark:divide-slate-800">
                            {filteredConversations.map((conv) => (
                                <button
                                    key={conv.studentId}
                                    onClick={() => handleSelectConversation(conv)}
                                    className={`w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all ${selectedConversation?.studentId === conv.studentId
                                            ? 'bg-violet-50 dark:bg-violet-900/20 border-l-4 border-violet-600'
                                            : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                                            {conv.studentName.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">
                                                    {conv.studentName}
                                                </p>
                                                {conv.unreadCount > 0 && (
                                                    <span className="h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold shrink-0">
                                                        {conv.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                                {conv.lastMessage.text}
                                            </p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                                {new Date(conv.lastMessage.timestamp).toLocaleTimeString('en-US', {
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Message View */}
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col">
                {!selectedConversation ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <Mail className="text-slate-300 dark:text-slate-700 mb-4" size={64} />
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            Select a conversation
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            Choose a conversation from the list to view messages
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Conversation Header */}
                        <div className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-4 rounded-t-xl">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                                    {selectedConversation.studentName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-semibold">{selectedConversation.studentName}</h3>
                                    <p className="text-sm text-white/80">Student</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
                            {selectedConversation.messages.map((msg) => (
                                <MessageBubble
                                    key={msg.id}
                                    message={msg}
                                    isOwn={msg.senderRole === 'admin'}
                                />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-6 border-t border-slate-200 dark:border-slate-800">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    placeholder="Type your reply..."
                                    className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!messageText.trim()}
                                    className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
