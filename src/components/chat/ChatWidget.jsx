import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import MessageBubble from './MessageBubble';

export default function ChatWidget() {
    const { user } = useAuth();
    const { getMyConversation, sendMessage, getUnreadCount, markAsRead } = useChat();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messageText, setMessageText] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const messages = getMyConversation();
    const unreadCount = getUnreadCount();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen && !isMinimized) {
            scrollToBottom();
            // Mark all messages as read when chat is opened
            const unreadIds = messages.filter(m => !m.read && m.senderRole === 'admin').map(m => m.id);
            if (unreadIds.length > 0) {
                markAsRead(unreadIds);
            }
        }
    }, [isOpen, isMinimized, messages.length]);

    const handleSend = (e) => {
        e.preventDefault();
        if (messageText.trim()) {
            sendMessage(messageText.trim());
            setMessageText('');
            setTimeout(scrollToBottom, 100);
        }
    };

    const handleOpen = () => {
        setIsOpen(true);
        setIsMinimized(false);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    if (!isOpen) {
        return (
            <button
                onClick={handleOpen}
                className="fixed bottom-6 right-6 h-14 w-14 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 hover:scale-110"
            >
                <MessageCircle size={24} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-6 w-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 transition-all duration-300 ${isMinimized ? 'h-14' : 'h-[500px]'
            } w-[380px] flex flex-col`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-4 py-3 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <MessageCircle size={20} />
                    <div>
                        <h3 className="font-semibold text-sm">Chat with Admin</h3>
                        <p className="text-xs text-white/80">We're here to help!</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-1.5 hover:bg-white/20 rounded-lg transition-all"
                    >
                        <Minimize2 size={16} />
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 hover:bg-white/20 rounded-lg transition-all"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-950">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <MessageCircle className="text-slate-300 dark:text-slate-700 mb-3" size={48} />
                                <p className="text-slate-600 dark:text-slate-400 text-sm">
                                    No messages yet. Start a conversation!
                                </p>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg) => (
                                    <MessageBubble
                                        key={msg.id}
                                        message={msg}
                                        isOwn={msg.senderId === user?.id || msg.senderId === user?.email}
                                    />
                                ))}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-4 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                            />
                            <button
                                type="submit"
                                disabled={!messageText.trim()}
                                className="px-4 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}
