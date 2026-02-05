import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const TeamContext = createContext(null);

export const useTeam = () => {
    const context = useContext(TeamContext);
    if (!context) {
        throw new Error('useTeam must be used within a TeamProvider');
    }
    return context;
};

export const TeamProvider = ({ children }) => {
    const { user } = useAuth();

    // Mock Team Data
    const [team, setTeam] = useState({
        id: 'team-001',
        name: 'The Innovators',
        projectTitle: 'Eco-Friendly Water Purification',
        members: [
            { id: 'u1', name: 'Alice Johnson', role: 'Leader', avatar: 'AJ' },
            { id: 'u2', name: 'Bob Smith', role: 'Member', avatar: 'BS' },
            { id: 'u3', name: 'Charlie Brown', role: 'Member', avatar: 'CB' },
        ],
        score: 1250,
        rank: 3
    });

    // Mock Chat Messages
    const [messages, setMessages] = useState([
        { id: 1, sender: 'Alice Johnson', text: 'Hey team, did we finalize the slide deck?', timestamp: '10:30 AM' },
        { id: 2, sender: 'Bob Smith', text: 'Almost, just need to add the financial projections.', timestamp: '10:32 AM' },
    ]);

    // Mock Resources
    const [resources, setResources] = useState([
        { id: 1, name: 'Project Proposal.pdf', type: 'document', url: '#', uploadedBy: 'Alice Johnson', date: '2023-10-05' },
        { id: 2, name: 'Market Research Links', type: 'link', url: '#', uploadedBy: 'Charlie Brown', date: '2023-10-06' },
    ]);

    const sendMessage = (text) => {
        const newMessage = {
            id: Date.now(),
            sender: user ? user.name : 'Me', // Fallback if user context is delayed
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const addResource = (resource) => {
        const newResource = {
            id: Date.now(),
            uploadedBy: user ? user.name : 'Me',
            date: new Date().toISOString().split('T')[0],
            ...resource
        };
        setResources(prev => [...prev, newResource]);
    };

    return (
        <TeamContext.Provider value={{
            team,
            messages,
            resources,
            sendMessage,
            addResource
        }}>
            {children}
        </TeamContext.Provider>
    );
};
