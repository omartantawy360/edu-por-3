import React, { createContext, useContext, useState, useEffect } from 'react';
const uuidv4 = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
import { useNotification } from './NotificationContext';

/**
 * ─────────────────────────────────────────────────────────
 *  COMPETITION POSTS  –  demo seed data
 * ─────────────────────────────────────────────────────────
 *  Each post: { id, type, title, description, date, status,
 *               isPinned, registrationStatus, registrationDeadline,
 *               stageStartDate, stageEndDate, winners }
 * ─────────────────────────────────────────────────────────
 */
const generateDemoPosts = () => ({
  c1: [
    {
      id: 'p-c1-1',
      type: 'Introduction',
      title: 'Welcome to the Technology & Innovation Summit 2026',
      description: 'The annual Technology & Innovation Summit is back! This prestigious competition invites the brightest minds from schools across the country to showcase breakthrough ideas in Smart Cities, Health Tech, FinTech, and EdTech. Whether you build an app, a hardware prototype, or a research paper – we want to hear your vision.\n\n**Goals:**\n- Foster technological creativity among high-school students\n- Provide a launchpad for student-led innovation\n- Connect participants with industry mentors and sponsors\n\n**Rules:**\n- Projects must be original work\n- Teams of 1–4 members are accepted\n- All submissions must include a technical report',
      date: '2026-09-01',
      status: 'published',
      isPinned: true,
    },
    {
      id: 'p-c1-2',
      type: 'Registration',
      title: 'Registration is Now Open!',
      description: 'Applications are officially open for the Technology & Innovation Summit 2026. Register your project and secure your spot before the deadline. Early registrants will receive a preparation guide and access to online workshops.\n\nSpots are **limited to 100 participants** — don\'t miss out!',
      date: '2026-09-05',
      status: 'published',
      isPinned: false,
      registrationStatus: 'Open',
      registrationDeadline: '2026-10-01',
    },
    {
      id: 'p-c1-3',
      type: 'Stage',
      title: 'Stage 1 – Project Submission',
      description: 'Participants must submit their full project including:\n- Technical report (PDF, max 10 pages)\n- Project demo video (max 5 minutes)\n- Source code or prototype files\n\nAll submissions reviewed by a panel of 5 expert judges. Top 30 projects advance to Stage 2.',
      date: '2026-10-05',
      status: 'published',
      isPinned: false,
      stageStartDate: '2026-10-05',
      stageEndDate: '2026-10-25',
    },
    {
      id: 'p-c1-4',
      type: 'Stage',
      title: 'Stage 2 – Live Pitch & Demo',
      description: 'The top 30 teams selected in Stage 1 will present their projects live to the judging panel and an audience of industry professionals. Each team gets 10 minutes to pitch + 5 minutes Q&A.\n\nLocation: WE School Innovation Hall\nDress code: Smart casual',
      date: '2026-11-10',
      status: 'published',
      isPinned: false,
      stageStartDate: '2026-11-10',
      stageEndDate: '2026-11-12',
    },
    {
      id: 'p-c1-5',
      type: 'Announcement',
      title: '📢 Schedule Change: Finals Moved to December 15',
      description: 'Due to high demand and venue availability, the final evaluation round has been rescheduled from November 30 to **December 15, 2026**. All qualified teams have been notified via email. Travel reimbursement forms are now available on the portal.\n\nWe apologise for any inconvenience and look forward to an outstanding finals day!',
      date: '2026-11-20',
      status: 'published',
      isPinned: true,
    },
    {
      id: 'p-c1-6',
      type: 'Result',
      title: '🏆 Final Results – Technology & Innovation Summit 2026',
      description: 'After two intense rounds of evaluation, we are thrilled to announce the winners of this year\'s Technology & Innovation Summit. Congratulations to all participants for their outstanding efforts!\n\nCertificates and prize money will be distributed within 14 business days.',
      date: '2026-12-15',
      status: 'published',
      isPinned: true,
      winners: [
        { rank: 1, name: 'Omar Tantawy', teamName: 'Team Nexus', project: 'SmartGrid AI Energy Manager' },
        { rank: 2, name: 'Mohammed Ali', teamName: 'Team Horizon', project: 'HealthPulse Wearable System' },
        { rank: 3, name: 'Ali Hassan', teamName: 'Solo Entry', project: 'EduBot – AI Tutor' },
      ],
    },
  ],
  c2: [
    {
      id: 'p-c2-1',
      type: 'Introduction',
      title: 'Science & Engineering Fair 2026 – Opening Announcement',
      description: 'Welcome to the Science & Engineering Fair, where curiosity meets innovation! This year we celebrate projects across Environmental Science, Mechanical Engineering, BioTech, and Renewable Energy.\n\n**Key Goals:**\n- Encourage scientific thinking and the scientific method\n- Give students real experience in research presentation\n- Connect projects with academic mentors for guidance\n\nAll project abstracts must be submitted for approval before proceeding to the full submission stage.',
      date: '2026-10-01',
      status: 'published',
      isPinned: true,
    },
    {
      id: 'p-c2-2',
      type: 'Registration',
      title: 'Register Your Research Project',
      description: 'Registration for the Science & Engineering Fair is now **open**. Submit your abstract and mentor information to secure a project slot.\n\n- Max 50 projects accepted\n- Individual or team entries (max 3 members)\n- Abstract: 300–500 words\n\nProjects will be reviewed for relevance and feasibility by our academic committee.',
      date: '2026-10-05',
      status: 'published',
      isPinned: false,
      registrationStatus: 'Open',
      registrationDeadline: '2026-11-01',
    },
    {
      id: 'p-c2-3',
      type: 'Stage',
      title: 'Submission Stage – Full Project Upload',
      description: 'Registered participants must upload their complete project package:\n- Research paper (IEEE format, 6–12 pages)\n- Supporting data and datasets\n- Presentation slides (optional but recommended)\n\nAll submissions are reviewed anonymously. Top 15 projects advance to the Finals.',
      date: '2026-11-05',
      status: 'published',
      isPinned: false,
      stageStartDate: '2026-11-05',
      stageEndDate: '2026-11-30',
    },
    {
      id: 'p-c2-4',
      type: 'Stage',
      title: 'Finals – Project Exhibition & Judging',
      description: 'The top 15 projects will be exhibited in our Science Fair hall. Each team will staff a project booth for 3 hours while judges and guests circulate.\n\n**Judging criteria:** Innovation (30%), Scientific Method (30%), Presentation (20%), Impact (20%)\n\nGuests and family members are welcome to attend the exhibition.',
      date: '2026-01-20',
      status: 'published',
      isPinned: false,
      stageStartDate: '2026-01-20',
      stageEndDate: '2026-01-21',
    },
    {
      id: 'p-c2-5',
      type: 'Result',
      title: '🏆 Science & Engineering Fair – Winners Announced!',
      description: 'We are proud to announce the winners of the 2026 Science & Engineering Fair. These projects demonstrated exceptional scientific rigour, creativity, and real-world impact.\n\nThank you to all participants, mentors, and judges for making this year\'s fair extraordinary. Certificates will be issued within 7 days.',
      date: '2026-02-01',
      status: 'published',
      isPinned: true,
      winners: [
        { rank: 1, name: 'Omar Tantawy', teamName: 'Solo Entry', project: 'EcoTracker – Carbon Footprint AI App' },
        { rank: 2, name: 'Mohammed Ali', teamName: 'Team GreenTech', project: 'Smart Irrigation System' },
        { rank: 3, name: 'Layla Hassan', teamName: 'Team BioFuture', project: 'Algae-based Biofuel Research' },
      ],
    },
  ],
});

/**
 * ─────────────────────────────────────────────────────────
 *  COMPETITION CONSTANTS
 * ─────────────────────────────────────────────────────────
 */
export const COMPETITION_PHASES = {
  DRAFT: 'Draft',
  REGISTRATION_OPEN: 'Registration Open',
  REGISTRATION_CLOSED: 'Registration Closed',
  EVALUATION: 'Evaluation',
  PEER_REVIEW: 'Peer Review',
  RESULTS_READY: 'Results Ready',
  RESULTS_PUBLISHED: 'Results Published',
  ARCHIVED: 'Archived'
};

export const RESULTS_VISIBILITY = {
  HIDDEN: 'Hidden',
  INTERNAL: 'Internal',
  PUBLISHED: 'Published'
};

export const LEADERBOARD_STATUS = {
  HIDDEN: 'Hidden',
  LIVE: 'Live',
  FINAL: 'Final'
};

const AppContext = createContext(null);

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = window.localStorage.getItem('edu-theme');
    return saved === 'dark' || saved === 'light' ? saved : 'light';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  // NEW: Demo Mode State
  const [isDemoMode, setIsDemoMode] = useState(false);

  // NEW: Announcements State
  const [announcements, setAnnouncements] = useState([
    { id: 'ann-1', title: 'Virtual Expo is Now Live!', content: 'Explore the winning projects from the Technology Summit and Science Fair in our new Virtual Expo hall.', target: 'All', date: '2026-03-20', type: 'global' },
    { id: 'ann-2', title: 'Final Submission Deadline Reminder', content: 'Reminder for all teams in the Web Applications Challenge: the final code upload deadline is March 15th.', target: 'Competition', competitionId: 'c4', date: '2026-03-10', type: 'critical' },
  ]);

  // Competition Timeline Posts  { [competitionId]: Post[] }
  const [competitionPosts, setCompetitionPosts] = useState({});

  // ── Announcement Helpers ────────────────────────────────
  const addAnnouncement = (data) => {
    const newAnn = {
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...data
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    addNotification({
      title: 'New Announcement',
      message: `Announcement: ${data.title}`,
      type: 'success'
    });
    return newAnn;
  };

  // ── Post CRUD helpers ──────────────────────────────────
  const addPost = (competitionId, postData) => {
    const newPost = {
      id: `p-${competitionId}-${uuidv4().slice(0, 8)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'published',
      isPinned: false,
      ...postData,
    };
    setCompetitionPosts(prev => ({
      ...prev,
      [competitionId]: [...(prev[competitionId] || []), newPost],
    }));
    addNotification({
      title: 'Timeline Updated',
      message: 'New post added to competition timeline',
      type: 'success'
    });
    return newPost;
  };

  const editPost = (competitionId, postId, updatedData) => {
    setCompetitionPosts(prev => ({
      ...prev,
      [competitionId]: (prev[competitionId] || []).map(p =>
        p.id === postId ? { ...p, ...updatedData } : p
      ),
    }));
  };

  const deletePost = (competitionId, postId) => {
    setCompetitionPosts(prev => ({
      ...prev,
      [competitionId]: (prev[competitionId] || []).filter(p => p.id !== postId),
    }));
    addNotification({
      title: 'Post Removed',
      message: 'Post removed from timeline',
      type: 'info'
    });
  };

  const getCompetitionPosts = (competitionId) => {
    const posts = competitionPosts[competitionId] || [];
    // Pinned posts first, then chronological
    return [
      ...posts.filter(p => p.isPinned),
      ...posts.filter(p => !p.isPinned),
    ];
  };

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('edu-theme', next);
        document.documentElement.classList.toggle('dark', next === 'dark');
      }
      return next;
    });
  };

  // Mock Data
  const generateMockStudents = () => {
    const firstNames = ["Omar", "Mohammed", "Ali", "Layla", "Ahmed", "Noor", "Hassan", "Zainab", "Sarah", "Fatima", "Shireen", "Kamal", "Rana", "Yasser", "Dina", "Khalid", "Amina", "Ibrahim", "Aisha", "Saleh"];
    const lastNames = ["Tantawy", "Ali", "Hassan", "Saleh", "Deen", "Ghareeb", "Faraj", "Rashid", "Thamer", "Shemari", "Shibaani", "Enezi", "Dosari", "Qahtani", "Maliki", "Najjar", "Hajri", "Tareqi", "Ruwaili", "Suwalem"];
    
    const projectTitles = [
        "Smart Water Purification System with AI", "Crop Disease Detection using Machine Learning", "Renewable Energy Management System",
        "Blockchain Supply Chain Transparency", "Smart Traffic Management System", "Biodegradable Packaging Solutions",
        "Autonomous Rescue Drone", "Mental Health Analysis using NLP", "Vertical Farming Automation",
        "Low-Cost Prosthetic Limb", "Solar Water Desalination", "Wildfire Detection using AI"
    ];
    const mentors = ["Dr. Omar Tantawy", "Prof. Mohammed Ali", "Dr. Ahmed Sheeba", "Prof. Sarah Najjar", "Dr. Khalid Rashid"];
    
    const competitionsList = ['Technology and Innovation Summit', 'Science and Engineering Fair', 'AI Programming Championship', 'Web Applications Challenge', 'International Robotics Olympiad'];
    const statuses = ['Approved', 'Pending', 'Rejected'];
    const results = ['Passed', 'Failed', '-'];
    
    return Array.from({ length: 20 }, (_, i) => {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[i % lastNames.length];
      const fullName = `${firstName} ${lastName}`;
      
      const comp = competitionsList[Math.floor(Math.random() * competitionsList.length)];
      const stat = statuses[Math.floor(Math.random() * statuses.length)];
      let res = '-';
      if (stat === 'Approved') {
        res = results[Math.floor(Math.random() * results.length)];
      }

      const school = "WE School";
      const project = projectTitles[i % projectTitles.length];
      const mentor = mentors[i % mentors.length];

      const isTeam = i % 5 === 0;
      const type = isTeam ? 'Team' : 'Individual';
      const members = isTeam ? [
        { id: `ST-M1-${i}`, name: firstNames[(i + 1) % firstNames.length] }, 
        { id: `ST-M2-${i}`, name: firstNames[(i + 2) % firstNames.length] }
      ] : null;

      return {
        id: `ST-${(i + 1).toString().padStart(3, '0')}`,
        name: fullName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@weschool.edu`,
        grade: (9 + (i % 4)).toString(),
        clazz: ['A', 'B', 'C'][i % 3],
        school: school,
        competition: comp,
        type: type,
        members: members,
        stage: 'Registration',
        status: stat,
        result: res,
        projectTitle: comp === 'Science and Engineering Fair' || comp === 'International Robotics Olympiad' ? project : null,
        mentor: comp === 'Science and Engineering Fair' || comp === 'International Robotics Olympiad' ? mentor : null,
        abstract: "This project aims to explore the viability of using advanced algorithms to solve daily problems efficiently.",
        feedback: res === 'Failed' ? "Great effort, but the methodology lacks control variables." : res === 'Passed' ? "Excellent work! The presentation was very persuasive." : null
      };
    });
  };

  const [students, setStudents] = useState(generateMockStudents());


  const [competitions, setCompetitions] = useState([
    { 
        id: 'c1', 
        name: 'Technology and Innovation Summit', 
        phase: COMPETITION_PHASES.RESULTS_PUBLISHED,
        stages: [
          { name: 'Stage 1', startDate: '2026-10-05', endDate: '2026-10-25', maxTeams: 100, status: 'Completed' },
          { name: 'Stage 2', startDate: '2026-11-10', endDate: '2026-11-12', maxTeams: 30, status: 'Completed' },
          { name: 'Finals', startDate: '2026-12-15', endDate: '2026-12-15', maxTeams: 10, status: 'Completed' }
        ],
        description: 'Annual competition in technological innovation for high school students.',
        type: 'Internal',
        startDate: '2026-09-01',
        endDate: '2026-12-15',
        maxParticipants: 100,
        categories: ['Smart Cities', 'Health Tech', 'FinTech', 'EdTech'],
        resultsVisibility: RESULTS_VISIBILITY.PUBLISHED,
        leaderboardStatus: LEADERBOARD_STATUS.FINAL
    },
    { 
        id: 'c2', 
        name: 'Science and Engineering Fair', 
        phase: COMPETITION_PHASES.EVALUATION,
        stages: [
          { name: 'Submission', startDate: '2026-11-05', endDate: '2026-11-30', maxTeams: 50, status: 'Completed' },
          { name: 'Finals', startDate: '2026-01-20', endDate: '2026-01-21', maxTeams: 15, status: 'Open' }
        ],
        description: 'Display of innovative science and engineering projects.',
        type: 'Internal',
        startDate: '2026-10-01',
        endDate: '2026-02-20',
        maxParticipants: 50,
        categories: ['Environmental Science', 'Mechanical Engineering', 'BioTech', 'Renewable Energy'],
        resultsVisibility: RESULTS_VISIBILITY.INTERNAL,
        leaderboardStatus: LEADERBOARD_STATUS.LIVE
    },
    { 
        id: 'c3', 
        name: 'AI Programming Championship', 
        phase: COMPETITION_PHASES.REGISTRATION_OPEN,
        stages: [
          { name: 'Preliminaries', startDate: '2026-12-01', endDate: '2026-12-15', maxTeams: 200, status: 'Upcoming' },
          { name: 'Finals', startDate: '2026-01-15', endDate: '2026-01-30', maxTeams: 50, status: 'Upcoming' }
        ],
        description: 'Programming competition specialized in artificial intelligence and machine learning.',
        type: 'Internal',
        startDate: '2026-11-15',
        endDate: '2026-01-30',
        maxParticipants: 200,
        categories: ['Natural Language Processing', 'Computer Vision', 'Predictive Analysis', 'Robotics AI'],
        resultsVisibility: RESULTS_VISIBILITY.HIDDEN,
        leaderboardStatus: LEADERBOARD_STATUS.HIDDEN
    },
    { 
        id: 'c4', 
        name: 'Web Applications Challenge', 
        phase: COMPETITION_PHASES.DRAFT,
        stages: [
          { name: 'Round 1', startDate: '2026-01-10', endDate: '2026-01-30', maxTeams: 32, status: 'Upcoming' },
          { name: 'Round 2', startDate: '2026-02-10', endDate: '2026-02-28', maxTeams: 16, status: 'Upcoming' },
          { name: 'Finals', startDate: '2026-03-10', endDate: '2026-03-15', maxTeams: 8, status: 'Upcoming' }
        ],
        description: 'Competition in web application and static application development.',
        type: 'Internal',
        startDate: '2026-01-10',
        endDate: '2026-03-15',
        maxParticipants: 32,
        categories: [],
        resultsVisibility: RESULTS_VISIBILITY.HIDDEN,
        leaderboardStatus: LEADERBOARD_STATUS.HIDDEN
    },
    { 
        id: 'c5', 
        name: 'International Robotics Olympiad', 
        phase: COMPETITION_PHASES.REGISTRATION_CLOSED,
        stages: [
          { name: 'Local Qualification', startDate: '2026-05-11', endDate: '2026-05-12', maxTeams: 1000, status: 'Upcoming' },
          { name: 'Regional', startDate: '2026-05-13', endDate: '2026-05-14', maxTeams: 100, status: 'Upcoming' },
          { name: 'International Finals', startDate: '2026-05-15', endDate: '2026-05-17', maxTeams: 20, status: 'Upcoming' }
        ], 
        description: 'First international robotics competition.', 
        type: 'Outer',
        startDate: '2026-05-11',
        endDate: '2026-05-17',
        maxParticipants: 1000,
        categories: [],
        resultsVisibility: RESULTS_VISIBILITY.HIDDEN,
        leaderboardStatus: LEADERBOARD_STATUS.HIDDEN
    }
  ]);

  // NEW: Submissions tracking
  const [submissions, setSubmissions] = useState([
    { id: 'sub-001', studentId: 'ST-001', competitionId: 'c2', title: 'Water Purification Project', url: 'https://github.com/ali/water-project', type: 'github', status: 'approved', date: '2026-01-15', feedback: 'Excellent research methodology!' },
    { id: 'sub-002', studentId: 'ST-002', competitionId: 'c3', title: 'Algorithm Optimizer', url: 'https://github.com/omar/algo', type: 'github', status: 'pending', date: '2026-01-20', feedback: null },
    { id: 'sub-003', studentId: 'ST-003', competitionId: 'c2', title: 'Solar Energy Research', url: 'https://docs.google.com/document', type: 'link', status: 'rejected', date: '2026-01-18', feedback: 'Needs more data analysis' },
  ]);

  // NEW: Certificates tracking
  const [certificates, setCertificates] = useState([
    { id: 'cert-001', studentId: 'ST-001', studentName: 'Omar Tantawy', competitionId: 'c2', competitionName: 'Science and Engineering Fair', achievement: 'First Place', date: '2026-02-01', issuedBy: 'Dr. Mohammed Hassan' },
  ]);

  // NEW: Achievements/Badges tracking
  const [achievements, setAchievements] = useState([
    { id: 'ach-001', studentId: 'ST-001', badge: 'First Submission', description: 'Submitted your first project', icon: '🎯', date: '2026-01-15', color: 'blue' },
    { id: 'ach-002', studentId: 'ST-001', badge: 'Team Player', description: 'Collaborated with more than 5 team members', icon: '🤝', date: '2026-01-20', color: 'green' },
  ]);

  // NEW: Scores tracking for E-Judging
  const [scores, setScores] = useState([
    { id: 'score-001', studentId: 'ST-001', competitionId: 'c2', innovation: 9, design: 8, presentation: 10, technical: 9, total: 36 }
  ]);
  
  // NEW: Peer Review management
  const [peerReviews, setPeerReviews] = useState([]);
  const [peerAssignments, setPeerAssignments] = useState([]);

  const { addNotification } = useNotification();

  const updateCompetitionPhase = (id, phase) => {
    setCompetitions(prev => prev.map(c => c.id === id ? { ...c, phase } : c));
    addNotification({
      title: 'Competition Phase Updated',
      message: `The phase for ${competitions.find(c => c.id === id)?.name || id} has been changed to ${phase}.`,
      type: 'info'
    });
  };

  const updateCompetitionVisibility = (id, visibility) => {
    setCompetitions(prev => prev.map(c => c.id === id ? { ...c, resultsVisibility: visibility } : c));
    addNotification({
      title: 'Results Visibility Updated',
      message: `Results visibility for ${competitions.find(c => c.id === id)?.name || id} is now ${visibility}.`,
      type: 'info'
    });
  };

  const updateLeaderboardStatus = (id, status) => {
    setCompetitions(prev => prev.map(c => c.id === id ? { ...c, leaderboardStatus: status } : c));
    addNotification({
      title: 'Leaderboard Status Updated',
      message: `Leaderboard for ${competitions.find(c => c.id === id)?.name || id} is now ${status}.`,
      type: 'info'
    });
  };

  const updateCompetitionStages = (id, stages) => {
    setCompetitions(prev => prev.map(c => c.id === id ? { ...c, stages } : c));
  };

  const addCompetition = (data) => {
      const newCompetition = {
          id: Math.random().toString(36).substr(2, 9),
          description: '',
          type: 'Internal',
          startDate: '',
          endDate: '',
          maxParticipants: 0,
          phase: COMPETITION_PHASES.DRAFT,
          stages: [],
          resultsVisibility: RESULTS_VISIBILITY.HIDDEN,
          leaderboardStatus: LEADERBOARD_STATUS.HIDDEN,
          ...data
      };
      setCompetitions(prev => [...prev, newCompetition]);
      addNotification({
        title: 'Competition Added',
        message: `New competition added: ${data.name}`,
        type: 'success'
      });
  };

  const registerStudent = (data) => {
    const newStudent = {
      id: `ST-${(students.length + 1).toString().padStart(3, '0')}`,
      ...data,
      stage: 'Registration',
      status: 'Pending',
      result: '-',
      projectTitle: null,
      school: 'WE School',
      email: `${data.name.split(' ')[0].toLowerCase()}@school.edu`,
      // Ensure members is structured correctly if it's a team
      members: Array.isArray(data.members) ? data.members : (typeof data.members === 'string' && data.members.trim() ? data.members.split(',').map((name, idx) => ({ id: `new-m-${idx}-${Date.now()}`, name: name.trim() })) : data.members)
    };
    setStudents((prev) => [...prev, newStudent]);
    addNotification({
      title: 'New Registration',
      message: `New student registration: ${data.name}`,
      type: 'info'
    });
    return newStudent;
  };

  const updateStudentStatus = (id, status) => {
    const student = students.find(s => s.id === id);
    setStudents((prev) => prev.map(s => {
        if (s.id === id) {
             return { ...s, status };
        }
        return s;
    }));
    
    // Send notification to student
    if (student) {
      const statusMessage = status === 'Approved' 
        ? `Your registration for ${student.competition} has been approved! 🎉`
        : status === 'Rejected'
        ? `Your registration for ${student.competition} has been rejected. Please contact admin for details.`
        : `Your registration for ${student.competition} is pending review.`;
      
      addNotification({
        title: 'Registration Status Updated',
        message: statusMessage,
        type: status === 'Approved' ? 'success' : status === 'Rejected' ? 'error' : 'info',
        studentId: id
      });
    }
  };

  const updateStudentStage = (id, stage) => {
    const student = students.find(s => s.id === id);
    setStudents((prev) => prev.map(s => s.id === id ? { ...s, stage } : s));
    
    // Notify student of stage change
    if (student) {
      addNotification({
        title: 'Phase Progressed',
        message: `You have progressed to ${stage} stage in ${student.competition}! 🚀`,
        type: 'info',
        studentId: id
      });
    }
  };

  const setStudentResult = (id, result) => {
    const student = students.find(s => s.id === id);
    setStudents((prev) => prev.map(s => s.id === id ? { ...s, result } : s));
    
    // Send notification to student
    if (student) {
      const resultMessage = result === 'Passed'
        ? `Congratulations! You have passed ${student.competition}! 🎉🏆`
        : `Unfortunately, you did not pass ${student.competition}. Keep trying! 💪`;
      
      addNotification({
        title: 'Competition Result',
        message: resultMessage,
        type: result === 'Passed' ? 'success' : 'error',
        studentId: id
      });
    }
  };

  const setStudentFeedback = (id, feedback) => {
      const student = students.find(s => s.id === id);
      setStudents((prev) => prev.map(s => s.id === id ? { ...s, feedback } : s));
      
      // Notify student of new feedback
      if (student) {
        addNotification({
          title: 'New Feedback',
          message: `You have received new feedback for ${student.competition} 💬`,
          type: 'info',
          studentId: id
        });
      }
  };

  // NEW: Submission management functions
  const addSubmission = (submission) => {
    const competition = competitions.find(c => c.id === submission.competitionId);
    
    // Phase Guard: Only allow submissions during active registration or evaluation phases (staging)
    if (competition && 
        (competition.phase === COMPETITION_PHASES.RESULTS_PUBLISHED || 
         competition.phase === COMPETITION_PHASES.ARCHIVED)) {
      addNotification({
        title: 'Submission Failed',
        message: 'The submission window for this competition has closed.',
        type: 'error'
      });
      return { success: false, error: 'Registration closed.' };
    }

    const newSubmission = {
      id: `sub-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      feedback: null,
      ...submission
    };
    setSubmissions(prev => [...prev, newSubmission]);
    addNotification({
      title: 'Submission Received',
      message: `New submission: ${submission.title}`,
      type: 'info'
    });
    return { success: true, submission: newSubmission };
  };

  const updateSubmissionStatus = (id, status, feedback = null) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, status, feedback } : sub
    ));
    addNotification(`Submission ${id} ${status}`, "success");
  };

  const editSubmission = (id, updatedData) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, ...updatedData } : sub
    ));
    addNotification({
      title: 'Submission Updated',
      message: `Submission updated: ${updatedData.title}`,
      type: 'success'
    });
  };

  const getStudentSubmissions = (studentId, teamIds = []) => {
    return submissions.filter(sub => 
      sub.studentId === studentId || (sub.isTeamSubmission && teamIds.includes(sub.teamId))
    );
  };

  const getCompetitionSubmissions = (competitionId) => {
    return submissions.filter(sub => sub.competitionId === competitionId);
  };

  // NEW: Certificate management functions
  const issueCertificate = (certificateData) => {
    const newCertificate = {
      id: `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      issuedBy: 'National Education Portal Admin',
      ...certificateData
    };
    setCertificates(prev => [...prev, newCertificate]);
    addNotification({
      title: 'Certificate Issued',
      message: `Certificate issued: ${certificateData.certificateTitle}`,
      type: 'success'
    });
    return newCertificate;
  };

  const getStudentCertificates = (studentId) => {
    return certificates.filter(cert => cert.studentId === studentId);
  };

  const getCompetitionCertificates = (competitionId) => {
    return certificates.filter(cert => cert.competitionId === competitionId);
  };

  // NEW: Achievement/Badge management functions
  const addAchievement = (achievementData) => {
    const newAchievement = {
      id: `ach-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...achievementData
    };
    setAchievements(prev => [...prev, newAchievement]);
    addNotification({
      title: 'Achievement Awarded',
      message: `Badge earned: ${achievementData.badge}`,
      type: 'success'
    });
  };

  const getStudentAchievements = (studentId) => {
    return achievements.filter(ach => ach.studentId === studentId);
  };

  const removeAchievement = (achievementId) => {
    setAchievements(prev => prev.filter(ach => ach.id !== achievementId));
  };

  // ── Peer Review Helpers ─────────────────────────────────
  const generatePeerAssignments = (competitionId) => {
    const compSubs = submissions.filter(s => s.competitionId === competitionId && s.status === 'approved');
    const studentIds = compSubs.map(s => s.studentId);
    
    if (studentIds.length < 3) return { success: false, error: 'At least 3 submissions required for peer review' };

    const assignments = [];
    studentIds.forEach((id) => {
        // Assign 2 reviews per student
        const others = studentIds.filter(otherId => otherId !== id);
        // Fisher-Yates or simple random
        const shuffled = [...others].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 2);
        
        selected.forEach(targetId => {
            assignments.push({
                id: `pa-${id}-${targetId}-${Date.now()}`,
                competitionId,
                reviewerId: id,
                targetSubmissionId: compSubs.find(s => s.studentId === targetId).id,
                status: 'pending'
            });
        });
    });

    setPeerAssignments(prev => [...prev, ...assignments]);
    updateCompetitionPhase(competitionId, COMPETITION_PHASES.PEER_REVIEW);
    return { success: true };
  };

  const submitPeerReview = (assignmentId, scores, comments) => {
    const assignment = peerAssignments.find(a => a.id === assignmentId);
    if (!assignment) return { success: false, error: 'Assignment not found' };

    const newReview = {
        id: `pr-${Date.now()}`,
        assignmentId,
        reviewerId: assignment.reviewerId,
        targetSubmissionId: assignment.targetSubmissionId,
        scores,
        comments,
        submittedAt: new Date().toISOString()
    };

    setPeerReviews(prev => [...prev, newReview]);
    setPeerAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status: 'completed' } : a));
    
    addNotification({
        title: 'Peer Review Submitted',
        message: 'Your peer review has been recorded. Thank you!',
        type: 'success',
        studentId: assignment.reviewerId
    });

    return { success: true };
  };

  const getMyPeerAssignments = (studentId) => {
    return peerAssignments.filter(a => a.reviewerId === studentId);
  };

  // NEW: Score management functions
  const addScore = (studentId, competitionId, scoreData) => {
    setScores(prev => {
      const existingIdx = prev.findIndex(s => s.studentId === studentId && s.competitionId === competitionId);
      const newScore = {
        id: existingIdx >= 0 ? prev[existingIdx].id : `score-${Date.now()}`,
        studentId,
        competitionId,
        date: new Date().toISOString().split('T')[0],
        ...scoreData
      };
      if (existingIdx >= 0) {
        const newScores = [...prev];
        newScores[existingIdx] = newScore;
        return newScores;
      }
      return [...prev, newScore];
    });
    addNotification({
      title: 'Scores Saved',
      message: 'Scores saved for student successfully.',
      type: 'success'
    });
  };

  const getStudentsBySchool = (schoolName) => {
    return students.filter(s => s.school === schoolName);
  };

  const getStudentScore = (studentId, competitionId) => {
    return scores.find(s => s.studentId === studentId && s.competitionId === competitionId) || null;
  };

  // Returns all students registered for a competition, optionally filtered by stage
  const getCompetitionStudents = (competitionId, stage = null) => {
    return students.filter(s =>
      s.competition === competitions.find(c => c.id === competitionId)?.name &&
      (stage === null || s.stage === stage)
    );
  };

  // Mark many students Passed or Failed at once and send notifications
  const bulkSetResults = (studentIds, result) => {
    setStudents(prev => prev.map(s => {
      if (!studentIds.includes(s.id)) return s;
      const msg = result === 'Passed'
        ? `Congratulations! You have passed ${s.competition}! 🎉🏆`
        : `Unfortunately, you did not pass ${s.competition}. Keep trying! 💪`;
      addNotification({
        title: 'Competition Result',
        message: msg,
        type: result === 'Passed' ? 'success' : 'error',
        studentId: s.id
      });
      return { ...s, result };
    }));
  };

  const finalizeCompetitionResults = (competitionId) => {
    // This is meant to be called after Judge Evaluations are complete
    // Bridge judicial averages into winners
    setSubmissions(prev => prev.map(sub => {
      if (sub.competitionId !== competitionId) return sub;
      
      // Look for a score in the local scores state
      const score = scores.find(sc => sc.studentId === sub.studentId && sc.competitionId === competitionId);
      
      // Logical check for winner: if score exists and total > 30 (arbitrary high bar)
      if (score && score.total >= 30) {
        return { ...sub, isWinner: true, rank: 1 };
      }
      return sub;
    }));

    addNotification({
      title: 'Results Finalized',
      message: 'Winners have been identified based on the top scoring data.',
      type: 'success'
    });
  };

  // Handle Demo Mode Toggle
  const toggleDemoMode = () => {
    setIsDemoMode(prev => {
      const next = !prev;
      if (next) {
        // Populate rich demo data
        setStudents(generateMockStudents());
        setCompetitions([
          { 
            id: 'c1', 
            name: 'Technology and Innovation Summit', 
            phase: 'Results Published',
            stages: [
              { name: 'Stage 1', startDate: '2026-10-05', endDate: '2026-10-25', status: 'Completed' },
              { name: 'Stage 2', startDate: '2026-11-10', endDate: '2026-11-12', status: 'Completed' },
              { name: 'Finals', startDate: '2026-12-15', endDate: '2026-12-15', status: 'Completed' }
            ],
            description: 'Annual competition in technological innovation for high school students.', 
            type: 'Internal', 
            startDate: '2026-09-01', 
            endDate: '2026-12-15', 
            maxParticipants: 100, 
            categories: ['Smart Cities', 'Health Tech', 'FinTech', 'EdTech'],
            resultsVisibility: 'Published',
            leaderboardStatus: 'Final'
          },
          { 
            id: 'c2', 
            name: 'Science and Engineering Fair', 
            phase: 'Evaluation',
            stages: [
              { name: 'Submission', startDate: '2026-11-05', endDate: '2026-11-30', status: 'Completed' },
              { name: 'Finals', startDate: '2026-01-20', endDate: '2026-01-21', status: 'Open' }
            ],
            description: 'Display of innovative science and engineering projects.', 
            type: 'Internal', 
            startDate: '2026-10-01', 
            endDate: '2026-02-20', 
            maxParticipants: 50, 
            categories: ['Environmental Science', 'Mechanical Engineering', 'BioTech', 'Renewable Energy'],
            resultsVisibility: 'Internal',
            leaderboardStatus: 'Live'
          },
          { 
            id: 'c3', 
            name: 'AI Programming Championship', 
            phase: 'Registration Open',
            stages: [
              { name: 'Preliminaries', startDate: '2026-12-01', endDate: '2026-12-15', status: 'Upcoming' },
              { name: 'Finals', startDate: '2026-01-15', endDate: '2026-01-30', status: 'Upcoming' }
            ],
            description: 'Programming competition specialized in artificial intelligence and machine learning.', 
            type: 'Internal', 
            startDate: '2026-11-15', 
            endDate: '2026-01-30', 
            maxParticipants: 200, 
            categories: ['Natural Language Processing', 'Computer Vision', 'Predictive Analysis', 'Robotics AI'],
            resultsVisibility: 'Hidden',
            leaderboardStatus: 'Hidden'
          },
          { 
            id: 'c4', 
            name: 'Web Applications Challenge', 
            phase: 'Draft',
            stages: [
              { name: 'Round 1', startDate: '2026-01-10', endDate: '2026-01-30', status: 'Upcoming' },
              { name: 'Round 2', startDate: '2026-02-10', endDate: '2026-02-28', status: 'Upcoming' },
              { name: 'Finals', startDate: '2026-03-10', endDate: '2026-03-15', status: 'Upcoming' }
            ],
            description: 'Competition in web application development.', 
            type: 'Internal', 
            startDate: '2026-01-10', 
            endDate: '2026-03-15', 
            maxParticipants: 32, 
            categories: [],
            resultsVisibility: 'Hidden',
            leaderboardStatus: 'Hidden'
          },
          { 
            id: 'c5', 
            name: 'International Robotics Olympiad', 
            phase: 'Registration Closed',
            stages: [
              { name: 'Local Qualification', startDate: '2026-05-11', endDate: '2026-05-12', status: 'Upcoming' },
              { name: 'Regional', startDate: '2026-05-13', endDate: '2026-05-14', status: 'Upcoming' },
              { name: 'International Finals', startDate: '2026-05-15', endDate: '2026-05-17', status: 'Upcoming' }
            ],
            description: 'First international robotics competition.', 
            type: 'Outer', 
            startDate: '2026-05-11', 
            endDate: '2026-05-17', 
            maxParticipants: 1000, 
            categories: [],
            resultsVisibility: 'Hidden',
            leaderboardStatus: 'Hidden'
          }
        ]);
        setSubmissions([
          { 
            id: 'sub-demo1', 
            studentId: 'ST-001', 
            competitionId: 'c2', 
            title: 'EcoTracker App', 
            url: 'https://github.com/demo/ecotracker', 
            type: 'github', 
            status: 'approved', 
            date: '2026-02-10', 
            feedback: 'Great execution and practical application.',
            description: 'EcoTracker is a mobile app designed to help users track their carbon footprint in real-time. It features a smart calculator for daily activities, integration with smart home devices, and a community leaderboard to encourage sustainable living.\n\nKey Achievements:\n- First Place in Science Fair 2026\n- Over 1,000 beta users\n- Featured in GreenTech Magazine',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Demo video
            gallery: [
              'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
            ],
            codeSnippet: 'import React from "react";\n\nconst CarbonCalculator = ({ usage }) => {\n  const calculateEmissions = (val) => val * 0.45;\n  return <div>{calculateEmissions(usage)} kg CO2</div>;\n};',
            files: [{name: 'Project_Proposal.pdf'}, {name: 'app_screenshot.png'}],
            tags: ['Climate Tech', 'React Native', 'Firebase'],
            isWinner: true,
            rank: 1
          },
          { 
            id: 'sub-demo2', 
            studentId: 'ST-002', 
            competitionId: 'c2', 
            title: 'Smart Irrigation System', 
            url: 'https://demo.com/irrigation', 
            type: 'link', 
            status: 'approved', 
            date: '2026-02-12', 
            feedback: 'Innovative approach.',
            description: 'Solar-powered irrigation system using soil moisture sensors to optimize water usage in arid regions. The system adjusts watering schedules based on real-time weather forecasts and soil conditions.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            gallery: [
              'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1558449028-s549c7df6fc5?auto=format&fit=crop&w=800&q=80'
            ],
            files: [{name: 'Hardware_Schematics.pdf'}, {name: 'demo_video.mp4'}],
            tags: ['IoT', 'Sustainability', 'Hardware'],
            isWinner: true,
            rank: 2
          },
          { 
            id: 'sub-demo3', 
            studentId: 'ST-003', 
            competitionId: 'c2', 
            title: 'AI Waste Sorter', 
            url: 'https://github.com/demo/wastesort', 
            type: 'github', 
            status: 'pending', 
            date: '2026-02-15', 
            feedback: null,
            description: 'Deep learning model that categorizes waste items into recyclables and non-recyclables using computer vision.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            gallery: [
              'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80'
            ],
            codeSnippet: 'import tensorflow as tf\n\nmodel = tf.keras.models.load_model("sorter_v1.h5")\ndef predict_class(image):\n    return model.predict(image)',
            files: [{name: 'Model_Architecture.png'}],
            tags: ['AI', 'Computer Vision', 'Recycling'],
            isWinner: false
          }
        ]);
        setScores([
          { id: 'score-demo1', studentId: 'ST-001', competitionId: 'c2', innovation: 9, design: 10, presentation: 8, technical: 9, total: 36 },
          { id: 'score-demo2', studentId: 'ST-002', competitionId: 'c2', innovation: 10, design: 7, presentation: 9, technical: 8, total: 34 }
        ]);
        setCertificates([
          { 
            id: 'CERT-WZ92K8X', 
            studentId: 'ST-001', 
            studentName: 'Omar Tantawy', 
            competitionId: 'c2', 
            competitionName: 'Science and Engineering Fair',
            certificateTitle: 'Excellence Award',
            reason: 'Outstanding Research in AI',
            customMessage: 'Your dedication to scientific inquiry and innovative approach to problem-solving has set a new benchmark for excellence and inspired your peers.',
            date: '2026-03-01',
            signatureName: 'Dr. Sarah Mitchell',
            issuedBy: 'National Education Portal Admin'
          },
          { 
            id: 'CERT-B3P5M2L', 
            studentId: 'ST-002', 
            studentName: 'Mohammed Ali', 
            competitionId: 'c2', 
            competitionName: 'Science and Engineering Fair',
            certificateTitle: 'Finalist Participation',
            reason: 'Successful Stage Completion',
            customMessage: 'We recognize your significant contributions and active participation in the Fair, demonstrating high potential in engineering.',
            date: '2026-03-01',
            signatureName: 'Prof. James Chen',
            issuedBy: 'National Education Portal Admin'
          }
        ]);
        setCompetitionPosts(generateDemoPosts());
        setAnnouncements([
          { id: 'ann-demo1', title: 'Virtual Expo is Now Live!', content: 'Explore the winning projects from the Technology Summit and Science Fair in our new Virtual Expo hall.', target: 'All', date: '2026-03-20', type: 'global' },
          { id: 'ann-demo2', title: 'Science Fair Winners Announced', content: 'Congratulations to the top 3 winners of the Science Fair 2026! Certificates have been issued to your profiles.', target: 'Competition', competitionId: 'c2', date: '2026-03-01', type: 'success' },
          { id: 'ann-demo3', title: 'Upcoming Workshop: Web Dev Basics', content: 'Join us next Monday for a specialized workshop on React and Tailwind CSS.', target: 'All', date: '2026-03-25', type: 'info' }
        ]);
        addNotification({
          title: 'Demo Mode Activated',
          message: 'Demo Mode Activated! Mock data loaded across all screens.',
          type: 'success'
        });
      } else {
        // Clear demo data
        setStudents([]);
        setCompetitions([]);
        setSubmissions([]);
        setScores([]);
        setCertificates([]);
        setCompetitionPosts({});
        setAnnouncements([]);
        addNotification({
          title: 'Demo Mode Deactivated',
          message: 'Demo Mode Deactivated. Returning to blank state.',
          type: 'info'
        });
      }
      return next;
    });
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      isDemoMode,
      toggleDemoMode,
      students,
      competitions,
      submissions,
      certificates,
      addCompetition,
      registerStudent,
      updateStudentStatus,
      updateStudentStage,
      setStudentResult,
      setStudentFeedback,
      addSubmission,
      updateSubmissionStatus,
      editSubmission,
      getStudentSubmissions,
      getCompetitionSubmissions,
      issueCertificate,
      getStudentCertificates,
      getCompetitionCertificates,
      achievements,
      addAchievement,
      getStudentAchievements,
      removeAchievement,
      scores,
      addScore,
      getStudentScore,
      getStudentsBySchool,
      competitionPosts,
      addPost,
      editPost,
      deletePost,
      getCompetitionPosts,
      announcements,
      updateCompetitionPhase,
      updateCompetitionVisibility,
      updateLeaderboardStatus,
      updateCompetitionStages,
      getCompetitionStudents,
      bulkSetResults,
      finalizeCompetitionResults,
      peerReviews,
      peerAssignments,
      generatePeerAssignments,
      submitPeerReview,
      getMyPeerAssignments,
    }}>
      {children}
    </AppContext.Provider>
  );
};
