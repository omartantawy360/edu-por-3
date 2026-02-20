import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();

    // All messages between students and admins
    const [messages, setMessages] = useState([]);

    // Send a new message
    const sendMessage = (text, recipientId = 'admin') => {
        const newMessage = {
            id: `msg_${Date.now()}`,
            senderId: user?.id || user?.email,
            senderName: user?.name || user?.email,
            senderRole: user?.role || 'student',
            recipientId,
            text,
            timestamp: new Date(),
            read: false
        };
        setMessages(prev => [...prev, newMessage]);
        return newMessage;
    };

    // Mark messages as read
    const markAsRead = (messageIds) => {
        setMessages(prev => prev.map(msg =>
            messageIds.includes(msg.id) ? { ...msg, read: true } : msg
        ));
    };

    // Get conversation with a specific user (for admin viewing student conversations)
    const getConversation = (userId) => {
        return messages.filter(msg =>
            msg.senderId === userId || msg.recipientId === userId
        ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    };

    // Get all conversations grouped by student (for admin)
    const getAllConversations = () => {
        const conversations = {};

        messages.forEach(msg => {
            // Determine the student ID for this message
            const studentId = msg.senderRole === 'student' ? msg.senderId : msg.recipientId;
            const studentName = msg.senderRole === 'student' ? msg.senderName :
                messages.find(m => m.senderId === studentId)?.senderName || 'Unknown';

            if (!conversations[studentId]) {
                conversations[studentId] = {
                    studentId,
                    studentName,
                    messages: [],
                    lastMessage: null,
                    unreadCount: 0
                };
            }

            conversations[studentId].messages.push(msg);

            // Update unread count (messages from student that admin hasn't read)
            if (msg.senderRole === 'student' && !msg.read) {
                conversations[studentId].unreadCount++;
            }
        });

        // Sort messages in each conversation and set last message
        Object.values(conversations).forEach(conv => {
            conv.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            conv.lastMessage = conv.messages[conv.messages.length - 1];
        });

        // Convert to array and sort by most recent message
        return Object.values(conversations).sort((a, b) =>
            new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp)
        );
    };

    // Get user's conversation (for student viewing their chat with admin)
    const getMyConversation = () => {
        if (!user) return [];
        return messages.filter(msg =>
            msg.senderId === user.id || msg.senderId === user.email ||
            msg.recipientId === user.id || msg.recipientId === user.email
        ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    };

    // Get unread count for current user
    const getUnreadCount = () => {
        if (!user) return 0;

        if (user.role === 'admin') {
            // Count all unread messages from students
            return messages.filter(msg =>
                msg.senderRole === 'student' && !msg.read
            ).length;
        } else {
            // Count unread messages from admin to this student
            return messages.filter(msg =>
                msg.senderRole === 'admin' &&
                !msg.read &&
                (msg.recipientId === user.id || msg.recipientId === user.email)
            ).length;
        }
    };

    return (
        <ChatContext.Provider value={{
            messages,
            sendMessage,
            markAsRead,
            getConversation,
            getAllConversations,
            getMyConversation,
            getUnreadCount
        }}>
            {children}
        </ChatContext.Provider>
    );
};
