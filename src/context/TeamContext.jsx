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

    // All available teams in the platform
    const [teams, setTeams] = useState([
        {
            id: 'team-001',
            name: 'The Innovators',
            description: 'Focused on sustainable technology solutions',
            competitionId: 'c2',
            competitionName: 'Science and Engineering Fair',
            leaderId: 'ST-001',
            leaderName: 'Omar Tantawy',
            members: [
                { id: 'ST-001', name: 'Omar Tantawy', role: 'Team Lead', avatar: 'OT', joinedDate: '2026-01-01' },
                { id: 'ST-002', name: 'Muhammad Shibaani', role: 'Member', avatar: 'MS', joinedDate: '2026-01-02' },
                { id: 'ST-003', name: 'Ali Hassan', role: 'Member', avatar: 'AH', joinedDate: '2026-01-03' },
            ],
            score: 1250,
            rank: 3,
            achievements: ['First Project', 'Team Player'],
            createdDate: '2026-01-01'
        },
        {
            id: 'team-002',
            name: 'Code Ninjas',
            description: 'AI and Machine Learning enthusiasts',
            competitionId: 'c3',
            competitionName: 'AI Programming Championship',
            leaderId: 'ST-004',
            leaderName: 'Layla Saleh',
            members: [
                { id: 'ST-004', name: 'Layla Saleh', role: 'Team Lead', avatar: 'LS', joinedDate: '2026-01-05' },
                { id: 'ST-005', name: 'Ahmed Deen', role: 'Member', avatar: 'AD', joinedDate: '2026-01-06' },
            ],
            score: 980,
            rank: 5,
            achievements: ['Quick Start'],
            createdDate: '2026-01-05'
        },
        {
            id: 'team-003',
            name: 'Web Wizards',
            description: 'Full-stack web development team',
            competitionId: 'c4',
            competitionName: 'Web Applications Challenge',
            leaderId: 'ST-007',
            leaderName: 'Hassan Ghareeb',
            members: [
                { id: 'ST-007', name: 'Hassan Ghareeb', role: 'Team Lead', avatar: 'HG', joinedDate: '2026-01-10' },
                { id: 'ST-008', name: 'Zainab Faraj', role: 'Member', avatar: 'ZF', joinedDate: '2026-01-11' },
                { id: 'ST-009', name: 'Sarah Rashid', role: 'Member', avatar: 'SR', joinedDate: '2026-01-12' },
                { id: 'ST-010', name: 'Fatima Thamer', role: 'Member', avatar: 'FT', joinedDate: '2026-01-13' },
            ],
            score: 1450,
            rank: 1,
            achievements: ['Top Performers', 'Team Spirit', 'Fast Learners'],
            createdDate: '2026-01-10'
        },
        {
            id: 'team-004',
            name: 'Robo Masters',
            description: 'Robotics and automation specialists',
            competitionId: 'c5',
            competitionName: 'International Robotics Olympiad',
            leaderId: 'ST-011',
            leaderName: 'Shireen Shemari',
            members: [
                { id: 'ST-011', name: 'Shireen Shemari', role: 'Team Lead', avatar: 'SS', joinedDate: '2026-01-15' },
                { id: 'ST-012', name: 'Kamal Shibaani', role: 'Member', avatar: 'KS', joinedDate: '2026-01-16' },
                { id: 'ST-013', name: 'Rana Enezi', role: 'Member', avatar: 'RE', joinedDate: '2026-01-17' },
            ],
            score: 1100,
            rank: 4,
            achievements: ['Innovation Award'],
            createdDate: '2026-01-15'
        },
    ]);

    // Join requests tracking
    const [joinRequests, setJoinRequests] = useState([
        {
            id: 'req-001',
            teamId: 'team-001',
            teamName: 'The Innovators',
            userId: 'ST-015',
            userName: 'Yasser Dosari',
            userAvatar: 'YD',
            message: 'I have experience in water purification systems and would love to contribute!',
            status: 'pending',
            requestDate: '2026-02-05'
        },
        {
            id: 'req-002',
            teamId: 'team-003',
            teamName: 'Web Wizards',
            userId: 'ST-016',
            userName: 'Dina Qahtani',
            userAvatar: 'DQ',
            message: 'Skilled in React and Node.js. Looking forward to collaborating!',
            status: 'pending',
            requestDate: '2026-02-06'
        },
    ]);

    // Team messages by team ID
    const [teamMessages, setTeamMessages] = useState({
        'team-001': [
            { id: 1, sender: 'Omar Tantawy', senderId: 'ST-001', text: 'Hello, are we done with the presentation slides?', timestamp: '10:30 AM' },
            { id: 2, sender: 'Muhammad Shibaani', senderId: 'ST-002', text: 'Almost, we just need to add the financial projections.', timestamp: '10:32 AM' },
        ],
        'team-002': [
            { id: 1, sender: 'Layla Saleh', senderId: 'ST-004', text: 'Let\'s review the machine learning model tomorrow.', timestamp: '09:15 AM' },
        ],
        'team-003': [
            { id: 1, sender: 'Hassan Ghareeb', senderId: 'ST-007', text: 'Great progress on the frontend everyone!', timestamp: '14:20 PM' },
        ],
        'team-004': [
            { id: 1, sender: 'Shireen Shemari', senderId: 'ST-011', text: 'Robot testing scheduled for next week.', timestamp: '11:00 AM' },
        ],
    });

    // Team resources by team ID
    const [teamResources, setTeamResources] = useState({
        'team-001': [
            { id: 1, name: 'Project Proposal.pdf', type: 'document', url: '#', uploadedBy: 'Omar Tantawy', date: '2026-01-05' },
            { id: 2, name: 'Market Research Links', type: 'link', url: '#', uploadedBy: 'Ali Hassan', date: '2026-01-06' },
        ],
        'team-002': [
            { id: 1, name: 'AI Model Training Data', type: 'document', url: '#', uploadedBy: 'Layla Saleh', date: '2026-01-07' },
        ],
        'team-003': [
            { id: 1, name: 'UI Design Mockups', type: 'image', url: '#', uploadedBy: 'Hassan Ghareeb', date: '2026-01-12' },
            { id: 2, name: 'API Documentation', type: 'link', url: '#', uploadedBy: 'Zainab Faraj', date: '2026-01-13' },
        ],
        'team-004': [
            { id: 1, name: 'Robot Schematics', type: 'document', url: '#', uploadedBy: 'Shireen Shemari', date: '2026-01-16' },
        ],
    });

    // Get teams user is a member of
    const getUserTeams = () => {
        if (!user) return [];
        return teams.filter(team =>
            team.members.some(member => member.id === user.id)
        );
    };

    // Get a specific team by ID
    const getTeamById = (teamId) => {
        return teams.find(team => team.id === teamId);
    };

    // Check if user is a member of a team
    const isTeamMember = (teamId) => {
        if (!user) return false;
        const team = getTeamById(teamId);
        return team ? team.members.some(member => member.id === user.id) : false;
    };

    // Check if user is team leader
    const isTeamLeader = (teamId) => {
        if (!user) return false;
        const team = getTeamById(teamId);
        return team ? team.leaderId === user.id : false;
    };

    // Request to join a team
    const requestToJoinTeam = (teamId, message = '') => {
        if (!user) return;

        const team = getTeamById(teamId);
        if (!team) return;

        // Check if already a member
        if (isTeamMember(teamId)) {
            alert('You are already a member of this team!');
            return;
        }

        // Check if already requested
        const existingRequest = joinRequests.find(
            req => req.teamId === teamId && req.userId === user.id && req.status === 'pending'
        );
        if (existingRequest) {
            alert('You have already sent a request to this team!');
            return;
        }

        const newRequest = {
            id: `req-${Date.now()}`,
            teamId: team.id,
            teamName: team.name,
            userId: user.id,
            userName: user.name,
            userAvatar: user.name.split(' ').map(n => n[0]).join(''),
            message: message,
            status: 'pending',
            requestDate: new Date().toISOString().split('T')[0]
        };

        setJoinRequests(prev => [...prev, newRequest]);
        return newRequest;
    };

    // Approve join request
    const approveJoinRequest = (requestId) => {
        const request = joinRequests.find(req => req.id === requestId);
        if (!request) return;

        // Add user to team
        setTeams(prev => prev.map(team => {
            if (team.id === request.teamId) {
                return {
                    ...team,
                    members: [
                        ...team.members,
                        {
                            id: request.userId,
                            name: request.userName,
                            role: 'Member',
                            avatar: request.userAvatar,
                            joinedDate: new Date().toISOString().split('T')[0]
                        }
                    ]
                };
            }
            return team;
        }));

        // Update request status
        setJoinRequests(prev => prev.map(req =>
            req.id === requestId ? { ...req, status: 'approved' } : req
        ));
    };

    // Reject join request
    const rejectJoinRequest = (requestId) => {
        setJoinRequests(prev => prev.map(req =>
            req.id === requestId ? { ...req, status: 'rejected' } : req
        ));
    };

    // Create a new team
    const createTeam = (teamData) => {
        if (!user) return;

        const newTeam = {
            id: `team-${Date.now()}`,
            leaderId: user.id,
            leaderName: user.name,
            members: [
                {
                    id: user.id,
                    name: user.name,
                    role: 'Team Lead',
                    avatar: user.name.split(' ').map(n => n[0]).join(''),
                    joinedDate: new Date().toISOString().split('T')[0]
                }
            ],
            score: 0,
            rank: teams.length + 1,
            achievements: [],
            createdDate: new Date().toISOString().split('T')[0],
            ...teamData
        };

        setTeams(prev => [...prev, newTeam]);
        setTeamMessages(prev => ({ ...prev, [newTeam.id]: [] }));
        setTeamResources(prev => ({ ...prev, [newTeam.id]: [] }));

        return newTeam;
    };

    // Leave a team
    const leaveTeam = (teamId) => {
        if (!user) return;

        const team = getTeamById(teamId);
        if (!team) return;

        // Don't allow leader to leave
        if (team.leaderId === user.id) {
            alert('Team leaders cannot leave the team. Please transfer leadership first.');
            return;
        }

        setTeams(prev => prev.map(t => {
            if (t.id === teamId) {
                return {
                    ...t,
                    members: t.members.filter(member => member.id !== user.id)
                };
            }
            return t;
        }));
    };

    // Send message to a team
    const sendMessage = (teamId, text) => {
        if (!user) return;

        const newMessage = {
            id: Date.now(),
            sender: user.name,
            senderId: user.id,
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setTeamMessages(prev => ({
            ...prev,
            [teamId]: [...(prev[teamId] || []), newMessage]
        }));
    };

    // Add resource to a team
    const addResource = (teamId, resource) => {
        if (!user) return;

        const newResource = {
            id: Date.now(),
            uploadedBy: user.name,
            date: new Date().toISOString().split('T')[0],
            ...resource
        };

        setTeamResources(prev => ({
            ...prev,
            [teamId]: [...(prev[teamId] || []), newResource]
        }));
    };

    // Get pending requests for teams user leads
    const getMyTeamRequests = () => {
        if (!user) return [];
        const myTeams = teams.filter(team => team.leaderId === user.id);
        const myTeamIds = myTeams.map(team => team.id);
        return joinRequests.filter(req =>
            myTeamIds.includes(req.teamId) && req.status === 'pending'
        );
    };

    // Get user's pending requests
    const getUserRequests = () => {
        if (!user) return [];
        return joinRequests.filter(req =>
            req.userId === user.id && req.status === 'pending'
        );
    };

    return (
        <TeamContext.Provider value={{
            // Team data
            teams,
            userTeams: getUserTeams(),

            // Team operations
            getTeamById,
            isTeamMember,
            isTeamLeader,
            createTeam,
            leaveTeam,

            // Join requests
            joinRequests,
            requestToJoinTeam,
            approveJoinRequest,
            rejectJoinRequest,
            getMyTeamRequests,
            getUserRequests,

            // Messages and resources
            teamMessages,
            teamResources,
            sendMessage,
            addResource,
        }}>
            {children}
        </TeamContext.Provider>
    );
};
