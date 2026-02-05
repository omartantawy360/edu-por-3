import React, { createContext, useContext, useState, useEffect } from 'react';

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
    const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Evan", "Fiona", "George", "Hannah", "Ian", "Jack", "Karen", "Leo", "Mona", "Nathan", "Olivia", "Peter", "Quinn", "Rachel", "Steve", "Tony"];
    const lastNames = ["Johnson", "Smith", "Brown", "Prince", "Wright", "Gallagher", "Miller", "Montana", "Somerhalder", "Daniels", "Page", "Messi", "Lisa", "Drake", "Wilde", "Parker", "Fabray", "Green", "Rogers", "Stark"];
    
    const schools = ["Lincoln High", "Washington Academy", "Roosevelt Prep", "Jefferson High", "Kennedy International"];
    const projectTitles = [
        "Eco-Friendly Water Purification System", "AI-Driven Crop Disease Detection", "Renewable Energy from Algae", 
        "Blockchain for Supply Chain Transparency", "Smart Traffic Management System", "Biodegradable Plastic from Corn Starch",
        "Autonomous Drone for Search and Rescue", "Mental Health Analysis using NLP", "Vertical Farming Automation",
        "Low-Cost Prosthetic Global Arm", "Solar-Powered Water Desalination", "Machine Learning for Early Wildfire Detection"
    ];
    const mentors = ["Dr. Alan Grant", "Prof. Minerva McGonagall", "Dr. Emmett Brown", "Mr. Miyagi", "Ms. Frizzle"];
    
    const competitionsList = ['Math Olympiad', 'Science Fair', 'Coding Cup', 'Debate Championship', 'ISEF'];
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

      const school = schools[i % schools.length];
      const project = projectTitles[i % projectTitles.length];
      const mentor = mentors[i % mentors.length];

      const isTeam = i % 5 === 0;
      const type = isTeam ? 'Team' : 'Individual';
      const members = isTeam ? [`${firstNames[(i + 1) % firstNames.length]}`, `${firstNames[(i + 2) % firstNames.length]}`].join(', ') : null;

      return {
        id: `ST-${(i + 1).toString().padStart(3, '0')}`,
        name: fullName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${school.replace(/\s+/g, '').toLowerCase()}.edu`,
        grade: (9 + (i % 4)).toString(),
        clazz: ['A', 'B', 'C'][i % 3],
        school: school,
        competition: comp,
        type: type,
        members: members,
        stage: 'Registration',
        status: stat,
        result: res,
        projectTitle: comp === 'Science Fair' || comp === 'ISEF' ? project : null,
        mentor: comp === 'Science Fair' || comp === 'ISEF' ? mentor : null,
        abstract: "This project aims to explore the viability of using advanced algorithms to solve daily problems efficiently.",
        feedback: res === 'Failed' ? "Great effort, but the methodology lacks control variables." : res === 'Passed' ? "Excellent work! The presentation was very persuasive." : null
      };
    });
  };

  const [students, setStudents] = useState(generateMockStudents());


  const [competitions, setCompetitions] = useState([
    { 
        id: 'c1', 
        name: 'Math Olympiad', 
        stages: ['Stage 1', 'Stage 2', 'Final'],
        description: 'Annual mathematics competition for high school students.',
        type: 'Internal',
        startDate: '2023-09-01',
        endDate: '2023-12-15',
        maxParticipants: 100
    },
    { 
        id: 'c2', 
        name: 'Science Fair', 
        stages: ['Submission', 'Final'],
        description: 'Showcase of innovative science projects.',
        type: 'Internal',
        startDate: '2023-10-01',
        endDate: '2024-02-20',
        maxParticipants: 50
    },
    { 
        id: 'c3', 
        name: 'Coding Cup', 
        stages: ['Qualifiers', 'Final'],
        description: 'Competitive programming contest.',
        type: 'Internal',
        startDate: '2023-11-15',
        endDate: '2024-01-30',
        maxParticipants: 200
    },
    { 
        id: 'c4', 
        name: 'Debate Championship', 
        stages: ['Round 1', 'Round 2', 'Final'],
        description: 'Inter-school debate tournament.',
        type: 'Internal',
        startDate: '2024-01-10',
        endDate: '2024-03-15',
        maxParticipants: 32
    },
    { 
        id: 'c5', 
        name: 'ISEF', 
        stages: ['Local Qualifier', 'Regional', 'International Final'], 
        description: 'International Science and Engineering Fair - The world\'s largest international pre-college science competition.', 
        type: 'Outer',
        startDate: '2024-05-11',
        endDate: '2024-05-17',
        maxParticipants: 1000
    }
  ]);

  // NEW: Submissions tracking
  const [submissions, setSubmissions] = useState([
    { id: 'sub-001', studentId: 'ST-001', competitionId: 'c2', title: 'Water Purification Project', url: 'https://github.com/alice/water-project', type: 'github', status: 'approved', date: '2024-01-15', feedback: 'Excellent research methodology!' },
    { id: 'sub-002', studentId: 'ST-002', competitionId: 'c3', title: 'Algorithm Optimizer', url: 'https://github.com/bob/algo', type: 'github', status: 'pending', date: '2024-01-20', feedback: null },
    { id: 'sub-003', studentId: 'ST-003', competitionId: 'c2', title: 'Solar Energy Research', url: 'https://docs.google.com/document', type: 'link', status: 'rejected', date: '2024-01-18', feedback: 'Needs more data analysis' },
  ]);

  // NEW: Certificates tracking
  const [certificates, setCertificates] = useState([
    { id: 'cert-001', studentId: 'ST-001', studentName: 'Alice Johnson', competitionId: 'c2', competitionName: 'Science Fair', achievement: 'First Place', date: '2024-02-01', issuedBy: 'Dr. John Smith' },
  ]);

  // NEW: Achievements/Badges tracking
  const [achievements, setAchievements] = useState([
    { id: 'ach-001', studentId: 'ST-001', badge: 'First Submission', description: 'Submitted first project', icon: '🎯', date: '2024-01-15', color: 'blue' },
    { id: 'ach-002', studentId: 'ST-001', badge: 'Team Player', description: 'Collaborated with 5+ team members', icon: '🤝', date: '2024-01-20', color: 'green' },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "New registration guidelines for ISEF 2024 available.", type: "info", date: "2024-02-01", studentId: "ST-001" },
    { id: 2, text: "System maintenance scheduled for this weekend.", type: "warning", date: "2024-01-28" },
    { id: 3, text: 'Welcome to the competition platform!', type: 'info', date: '2024-02-01', studentId: 'ST-001' },
    { id: 4, text: 'Your abstract for Science Fair was reviewed.', type: 'success', date: '2024-02-02', studentId: 'ST-001' },
  ]);

  const addNotification = (text, type = "info", studentId = null) => {
      setNotifications(prev => [{ id: Date.now(), text, type, date: new Date().toISOString().split('T')[0], studentId }, ...prev]);
  };

  const addCompetition = (data) => {
      const newCompetition = {
          id: Math.random().toString(36).substr(2, 9),
          description: '',
          type: 'Internal',
          startDate: '',
          endDate: '',
          maxParticipants: 0,
          ...data
      };
      setCompetitions(prev => [...prev, newCompetition]);
      addNotification(`New competition added: ${data.name}`, "success");
  };

  const registerStudent = (data) => {
    const newStudent = {
      id: `ST-${(students.length + 1).toString().padStart(3, '0')}`,
      ...data,
      stage: 'Registration',
      status: 'Pending',
      result: '-',
      projectTitle: null,
      school: 'Lincoln High',
      email: `${data.name.split(' ')[0].toLowerCase()}@school.edu`
    };
    setStudents((prev) => [...prev, newStudent]);
    addNotification(`New student registration: ${data.name}`, "info");
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
      
      addNotification(statusMessage, status === 'Approved' ? 'success' : status === 'Rejected' ? 'error' : 'info', id);
    }
  };

  const updateStudentStage = (id, stage) => {
    const student = students.find(s => s.id === id);
    setStudents((prev) => prev.map(s => s.id === id ? { ...s, stage } : s));
    
    // Notify student of stage change
    if (student) {
      addNotification(`You have progressed to ${stage} stage in ${student.competition}! 🚀`, 'info', id);
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
      
      addNotification(resultMessage, result === 'Passed' ? 'success' : 'error', id);
    }
  };

  const setStudentFeedback = (id, feedback) => {
      const student = students.find(s => s.id === id);
      setStudents((prev) => prev.map(s => s.id === id ? { ...s, feedback } : s));
      
      // Notify student of new feedback
      if (student) {
        addNotification(`You have received new feedback for ${student.competition} 💬`, 'info', id);
      }
  };

  // NEW: Submission management functions
  const addSubmission = (submission) => {
    const newSubmission = {
      id: `sub-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      feedback: null,
      ...submission
    };
    setSubmissions(prev => [...prev, newSubmission]);
    addNotification(`New submission: ${submission.title}`, "info");
    return newSubmission;
  };

  const updateSubmissionStatus = (id, status, feedback = null) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, status, feedback } : sub
    ));
    addNotification(`Submission ${id} ${status}`, "success");
  };

  const getStudentSubmissions = (studentId) => {
    return submissions.filter(sub => sub.studentId === studentId);
  };

  const getCompetitionSubmissions = (competitionId) => {
    return submissions.filter(sub => sub.competitionId === competitionId);
  };

  // NEW: Certificate management functions
  const issueCertificate = (certificateData) => {
    const newCertificate = {
      id: `cert-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      issuedBy: 'Admin',
      ...certificateData
    };
    setCertificates(prev => [...prev, newCertificate]);
    addNotification(`Certificate issued to ${certificateData.studentName}`, "success");
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
    addNotification(`Achievement awarded to student`, 'success');
  };

  const getStudentAchievements = (studentId) => {
    return achievements.filter(ach => ach.studentId === studentId);
  };

  const removeAchievement = (achievementId) => {
    setAchievements(prev => prev.filter(ach => ach.id !== achievementId));
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      students,
      competitions,
      notifications,
      submissions,
      certificates,
      addCompetition,
      registerStudent,
      updateStudentStatus,
      updateStudentStage,
      setStudentResult,
      addNotification,
      setStudentFeedback,
      addSubmission,
      updateSubmissionStatus,
      getStudentSubmissions,
      getCompetitionSubmissions,
      issueCertificate,
      getStudentCertificates,
      getCompetitionCertificates,
      achievements,
      addAchievement,
      getStudentAchievements,
      removeAchievement
    }}>
      {children}
    </AppContext.Provider>
  );
};
