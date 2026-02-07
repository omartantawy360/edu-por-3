import React from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function MessageBubble({ message, isOwn }) {
    const bubbleClass = isOwn
        ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white ml-auto'
        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100';

    const formatTime = (timestamp) => {
        try {
            return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
        } catch {
            return 'just now';
        }
    };

    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${bubbleClass}`}>
                {!isOwn && (
                    <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-1">
                        {message.senderName}
                    </p>
                )}
                <p className="text-sm break-words whitespace-pre-wrap">{message.text}</p>
                <p className={`text-xs mt-1.5 ${isOwn ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}`}>
                    {formatTime(message.timestamp)}
                </p>
            </div>
        </div>
    );
}
