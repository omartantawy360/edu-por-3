import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

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
    // All available teams in the platform
    const [teams, setTeams] = useState([]);
    const [joinRequests, setJoinRequests] = useState([]);
    const [teamMessages, setTeamMessages] = useState({});
    const [teamResources, setTeamResources] = useState({});

    // Fetch Teams
    const fetchTeams = async () => {
        try {
            const res = await api.get('/teams');
            const mappedTeams = res.data.map(t => ({
                id: t._id,
                name: t.name,
                description: t.description,
                competitionId: t.competition?._id,
                competitionName: t.competition?.title,
                leaderId: t.leader?._id,
                leaderName: t.leader?.name,
                members: (t.members || []).filter(m => m).map(m => ({
                    id: m._id,
                    name: m.name,
                    role: m._id === t.leader?._id ? 'Team Lead' : 'Member',
                    avatar: (m.name || 'U').split(' ').map(n => n[0]).join(''),
                    joinedDate: '2026-01-01' // Mock date as backend doesn't track join date in members array yet
                })),
                score: t.score,
                rank: t.rank || 0,
                achievements: t.achievements,
                createdDate: new Date(t.createdAt).toISOString().split('T')[0]
            }));
            setTeams(mappedTeams);
        } catch (error) {
            console.error("Failed to fetch teams", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchTeams();
        }
    }, [user]);

    // Fetch requests for teams I lead
    useEffect(() => {
        const fetchAllRequests = async () => {
             if (!user || teams.length === 0) return;
             
             const myLeadingTeams = teams.filter(t => t.leaderId === user.id);
             let allReqs = [];
             
             for (const team of myLeadingTeams) {
                 try {
                     const res = await api.get(`/teams/${team.id}/requests`);
                     // Map if needed, but backend already maps mostly
                     // Backend returns: id, teamId, userId, userName, userAvatar, message, status, requestDate
                     allReqs = [...allReqs, ...res.data];
                 } catch (err) {
                     console.error(`Failed to fetch requests for team ${team.id}`, err);
                 }
             }
             setJoinRequests(allReqs);
        };
        
        fetchAllRequests();
    }, [user, teams]);

    const fetchTeamMessages = async (teamId) => {
        try {
            const res = await api.get(`/teams/${teamId}/messages`);
            const mappedMessages = res.data.map(m => ({
                id: m._id,
                sender: m.sender.name,
                senderId: m.sender._id,
                text: m.text,
                timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
            setTeamMessages(prev => ({ ...prev, [teamId]: mappedMessages }));
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    };

    const fetchTeamResources = async (teamId) => {
        try {
            const res = await api.get(`/teams/${teamId}/resources`);
             const mappedResources = res.data.map(r => ({
                id: r._id,
                name: r.name,
                type: r.type,
                url: r.url,
                uploadedBy: r.uploadedBy.name,
                date: new Date(r.createdAt).toISOString().split('T')[0]
            }));
            setTeamResources(prev => ({ ...prev, [teamId]: mappedResources }));
        } catch (error) {
            console.error("Failed to fetch resources", error);
        }
    };

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
    // Request to join a team
    const requestToJoinTeam = async (teamId, message = '') => {
        if (!user) return;
        try {
            const res = await api.post(`/teams/${teamId}/join`, { message });
            // For now, let's just log. UI should handle notification.
            console.log('Join request sent!');
        } catch (error) {
             console.error("Join request failed", error);
        }
    };

    // Approve join request
    const approveJoinRequest = async (requestId) => {
        try {
            await api.put(`/teams/0/requests/${requestId}/approve`); // teamId is not needed for the route I defined, but I used /:id/requests/:requestId. 
            // Wait, my route is router.put('/:id/requests/:requestId/approve')
            // I need the team ID.
            // The requestId is global unique in Mongo, but my route structure requires teamId.
            // I should find the request in state to get teamId.
            const req = joinRequests.find(r => r.id === requestId);
            if (!req) return;
            
            await api.put(`/teams/${req.teamId}/requests/${requestId}/approve`);
            
            // Optimistic update
            setJoinRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'approved' } : r));
            // Also update members in teams state?
            // Ideally we re-fetch teams to get the new member list
            fetchTeams();
        } catch (error) {
            console.error("Failed to approve request", error);
        }
    };

    // Reject join request
    const rejectJoinRequest = async (requestId) => {
        try {
           const req = joinRequests.find(r => r.id === requestId);
           if (!req) return;
           
           await api.put(`/teams/${req.teamId}/requests/${requestId}/reject`);
           setJoinRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r));
        } catch (error) {
            console.error("Failed to reject request", error);
        }
    };

    // Create a new team
    // Create a new team
    const createTeam = async (teamData) => {
        if (!user) return;
        try {
            const res = await api.post('/teams', teamData);
            const newTeam = res.data;
            // Map to match frontend structure before adding to state
            const mappedNewTeam = {
                id: newTeam._id,
                name: newTeam.name,
                description: newTeam.description,
                competitionId: newTeam.competition,
                competitionName: teamData.competitionName,
                // Leader is current user
                leaderId: user.id,
                leaderName: user.name,
                members: [{
                    id: user.id,
                    name: user.name,
                    role: 'Team Lead',
                    avatar: user.name.charAt(0),
                    joinedDate: new Date().toISOString().split('T')[0]
                }],
                score: 0,
                rank: 0,
                achievements: [],
                createdDate: new Date().toISOString().split('T')[0]
            };
            setTeams(prev => [...prev, mappedNewTeam]);
            setTeamMessages(prev => ({ ...prev, [newTeam._id]: [] }));
            setTeamResources(prev => ({ ...prev, [newTeam._id]: [] }));
            return mappedNewTeam;
        } catch (error) {
            console.error("Create team failed", error);
        }
    };

    // Leave a team
    const leaveTeam = (teamId) => {
        if (!user) return;

        const team = getTeamById(teamId);
        if (!team) return;

        // Don't allow leader to leave
        if (team.leaderId === user.id) {
            console.warn('Team leaders cannot leave the team. Please transfer leadership first.');
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
    // Send message to a team
    const sendMessage = async (teamId, text) => {
        if (!user) return;
        try {
            const res = await api.post(`/teams/${teamId}/messages`, { text });
            const newMessage = {
                id: res.data._id,
                sender: user.name,
                senderId: user.id,
                text: res.data.text,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setTeamMessages(prev => ({
                ...prev,
                [teamId]: [...(prev[teamId] || []), newMessage]
            }));
        } catch (error) {
            console.error("Send message failed", error);
        }
    };

    // Add resource to a team
    // Add resource to a team
    const addResource = async (teamId, resource) => {
        if (!user) return;
        try {
            const res = await api.post(`/teams/${teamId}/resources`, resource);
            const newResource = {
                id: res.data._id,
                uploadedBy: user.name,
                date: new Date().toISOString().split('T')[0],
                name: res.data.name,
                type: res.data.type,
                url: res.data.url
            };

            setTeamResources(prev => ({
                ...prev,
                [teamId]: [...(prev[teamId] || []), newResource]
            }));
        } catch (error) {
            console.error("Add resource failed", error);
        }
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
            fetchTeams,

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
            fetchTeamMessages,
            fetchTeamResources
        }}>
            {children}
        </TeamContext.Provider>
    );
};
