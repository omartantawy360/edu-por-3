import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, MessageSquare, Zap, Lightbulb, Code } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! I'm your EduComp AI Coach. I'm here to help you refine your project, brainstorm ideas, or debug your code. What can we work on today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const authContext = useAuth();
    const { user } = authContext || {};
    const appContext = useApp();
    const { } = appContext || {};

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            // Mocking AI response for now - in a real app, this would call the backend/Anthropic API
            setTimeout(() => {
                const response = getMockResponse(userMsg);
                setMessages(prev => [...prev, { role: 'assistant', content: response }]);
                setIsLoading(false);
            }, 1000);
        } catch (error) {
            console.error("AI Assistant Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
            setIsLoading(false);
        }
    };

    const getMockResponse = (query) => {
        const q = query.toLowerCase();
        if (q.includes('idea') || q.includes('brainstorm')) {
            return "That's a great starting point! To make your project stand out, consider how it solves a specific problem for your target audience. Have you thought about the user journey?";
        }
        if (q.includes('code') || q.includes('debug')) {
            return "I'd be happy to look at your code! Feel free to paste a snippet. Remember to follow clean code principles and comment your logic for the judges.";
        }
        if (q.includes('judge') || q.includes('score')) {
            return "Judges typically look for innovation, technical execution, and presentation. Make sure your video demo clearly shows the problem you're solving!";
        }
        return "That's interesting! Tell me more about your project goals so I can give you more specific advice.";
    };

    if (!user || user.role !== 'student') return null;

    return (
        <div className="fixed bottom-6 right-24 z-[60]">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`group relative h-14 w-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 overflow-hidden ${
                    isOpen 
                        ? 'bg-slate-900 rotate-90' 
                        : 'bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 hover:scale-110 hover:-translate-y-1'
                }`}
            >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                {isOpen ? <X className="text-white" size={24} /> : <Bot className="text-white animate-pulse" size={28} />}
                
                {!isOpen && (
                    <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full animate-bounce" />
                )}
            </button>

            {/* Side Panel */}
            <div className={`fixed top-6 bottom-24 right-6 w-[400px] max-w-[calc(100vw-3rem)] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] border border-slate-200 dark:border-slate-800 transition-all duration-500 flex flex-col overflow-hidden ${
                isOpen ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0 pointer-events-none'
            }`}>
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                <Sparkles className="text-white" size={20} />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-white">Innovation Coach</h3>
                                <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest">Powered by Claude</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Suggestions */}
                <div className="px-6 py-3 bg-emerald-50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/30 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    <div className="flex gap-2">
                        {[
                            { icon: Lightbulb, label: 'Brainstorm Ideas', text: 'Help me brainstorm ideas for a new project' },
                            { icon: Code, label: 'Code Review', text: 'Can you review my code snippet?' },
                            { icon: Zap, label: 'Tech Stack', text: 'What is the best tech stack for a web app?' },
                        ].map((s, i) => (
                            <button
                                key={i}
                                onClick={() => setInput(s.text)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all shadow-sm"
                            >
                                <s.icon size={12} className="text-emerald-500" />
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 sidebar-scroll">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-4 rounded-[1.5rem] text-sm leading-relaxed ${
                                m.role === 'user'
                                    ? 'bg-emerald-500 text-white rounded-tr-none shadow-lg shadow-emerald-500/20'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50'
                            }`}>
                                {m.role === 'assistant' && <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1.5">Coach</div>}
                                {m.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="p-4 rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 rounded-tl-none flex items-center gap-1">
                                <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-bounce" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                    <div className="relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Type your message..."
                            className="w-full pl-4 pr-12 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none max-h-32 transition-all"
                            rows={1}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 top-1.5 h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-500/20"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;
