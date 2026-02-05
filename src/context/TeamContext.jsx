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
        projectTitle: 'Eco-Friendly Water Purification System',
        members: [
            { id: 'u1', name: 'Omar Tantawy', role: 'Team Lead', avatar: 'OT' },
            { id: 'u2', name: 'Muhammad Shibaani', role: 'Member', avatar: 'MS' },
            { id: 'u3', name: 'Ali Hassan', role: 'Member', avatar: 'AH' },
        ],
        score: 1250,
        rank: 3
    });

    // Mock Chat Messages
    const [messages, setMessages] = useState([
        { id: 1, sender: 'Omar Tantawy', text: 'Hello, are we done with the presentation slides?', timestamp: '10:30 AM' },
        { id: 2, sender: 'Muhammad Shibaani', text: 'Almost, we just need to add the financial projections.', timestamp: '10:32 AM' },
    ]);

    // Mock Resources
    const [resources, setResources] = useState([
        { id: 1, name: 'Project Proposal.pdf', type: 'document', url: '#', uploadedBy: 'Omar Tantawy', date: '2026-10-05' },
        { id: 2, name: 'Market Research Links', type: 'link', url: '#', uploadedBy: 'Ali Hassan', date: '2026-10-06' },
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
