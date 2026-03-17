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

  // NEW: Demo Mode State
  const [isDemoMode, setIsDemoMode] = useState(false);

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
        stages: ['Stage 1', 'Stage 2', 'Finals'],
        description: 'Annual competition in technological innovation for high school students.',
        type: 'Internal',
        startDate: '2026-09-01',
        endDate: '2026-12-15',
        maxParticipants: 100,
        categories: ['Smart Cities', 'Health Tech', 'FinTech', 'EdTech']
    },
    { 
        id: 'c2', 
        name: 'Science and Engineering Fair', 
        stages: ['Submission', 'Finals'],
        description: 'Display of innovative science and engineering projects.',
        type: 'Internal',
        startDate: '2026-10-01',
        endDate: '2026-02-20',
        maxParticipants: 50,
        categories: ['Environmental Science', 'Mechanical Engineering', 'BioTech', 'Renewable Energy']
    },
    { 
        id: 'c3', 
        name: 'AI Programming Championship', 
        stages: ['Preliminaries', 'Finals'],
        description: 'Programming competition specialized in artificial intelligence and machine learning.',
        type: 'Internal',
        startDate: '2026-11-15',
        endDate: '2026-01-30',
        maxParticipants: 200,
        categories: ['Natural Language Processing', 'Computer Vision', 'Predictive Analysis', 'Robotics AI']
    },
    { 
        id: 'c4', 
        name: 'Web Applications Challenge', 
        stages: ['Round 1', 'Round 2', 'Finals'],
        description: 'Competition in web application and static application development.',
        type: 'Internal',
        startDate: '2026-01-10',
        endDate: '2026-03-15',
        maxParticipants: 32,
        categories: []
    },
    { 
        id: 'c5', 
        name: 'International Robotics Olympiad', 
        stages: ['Local Qualification', 'Regional', 'International Finals'], 
        description: 'First international robotics competition.', 
        type: 'Outer',
        startDate: '2026-05-11',
        endDate: '2026-05-17',
        maxParticipants: 1000,
        categories: []
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

  const [notifications, setNotifications] = useState([
    { id: 1, text: "New registration guidelines for the 2026 Robotics Olympiad are now available.", type: "info", date: "2026-02-01", studentId: "ST-001" },
    { id: 2, text: "System maintenance is scheduled for the end of this week.", type: "warning", date: "2026-01-28" },
    { id: 3, text: 'Welcome to the competitions platform!', type: 'info', date: '2026-02-01', studentId: 'ST-001' },
    { id: 4, text: 'Your abstract for the Science and Engineering Fair has been reviewed.', type: 'success', date: '2026-02-02', studentId: 'ST-001' },
  ]);

  const addNotification = (text, type = "info", studentId = null) => {
      setNotifications(prev => [{ id: Date.now(), text, type, date: new Date().toISOString().split('T')[0], studentId }, ...prev]);
  };

  const removeNotification = (notificationId) => {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
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
      school: 'WE School',
      email: `${data.name.split(' ')[0].toLowerCase()}@school.edu`,
      // Ensure members is structured correctly if it's a team
      members: Array.isArray(data.members) ? data.members : (typeof data.members === 'string' && data.members.trim() ? data.members.split(',').map((name, idx) => ({ id: `new-m-${idx}-${Date.now()}`, name: name.trim() })) : data.members)
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

  const editSubmission = (id, updatedData) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, ...updatedData } : sub
    ));
    addNotification(`Submission updated: ${updatedData.title}`, "success");
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
    addNotification(`Certificate issued: ${certificateData.certificateTitle}`, "success");
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
    addNotification(`Scores saved for student`, 'success');
  };

  const getStudentsBySchool = (schoolName) => {
    return students.filter(s => s.school === schoolName);
  };

  const getStudentScore = (studentId, competitionId) => {
    return scores.find(s => s.studentId === studentId && s.competitionId === competitionId) || null;
  };

  // Handle Demo Mode Toggle
  const toggleDemoMode = () => {
    setIsDemoMode(prev => {
      const next = !prev;
      if (next) {
        // Populate rich demo data
        setStudents(generateMockStudents());
        setCompetitions([
          { id: 'c1', name: 'Technology and Innovation Summit', stages: ['Stage 1', 'Stage 2', 'Finals'], description: 'Annual competition in technological innovation for high school students.', type: 'Internal', startDate: '2026-09-01', endDate: '2026-12-15', maxParticipants: 100, categories: ['Smart Cities', 'Health Tech', 'FinTech', 'EdTech'] },
          { id: 'c2', name: 'Science and Engineering Fair', stages: ['Submission', 'Finals'], description: 'Display of innovative science and engineering projects.', type: 'Internal', startDate: '2026-10-01', endDate: '2026-02-20', maxParticipants: 50, categories: ['Environmental Science', 'Mechanical Engineering', 'BioTech', 'Renewable Energy'] },
          { id: 'c3', name: 'AI Programming Championship', stages: ['Preliminaries', 'Finals'], description: 'Programming competition specialized in artificial intelligence and machine learning.', type: 'Internal', startDate: '2026-11-15', endDate: '2026-01-30', maxParticipants: 200, categories: ['Natural Language Processing', 'Computer Vision', 'Predictive Analysis', 'Robotics AI'] },
          { id: 'c4', name: 'Web Applications Challenge', stages: ['Round 1', 'Round 2', 'Finals'], description: 'Competition in web application development.', type: 'Internal', startDate: '2026-01-10', endDate: '2026-03-15', maxParticipants: 32, categories: [] },
          { id: 'c5', name: 'International Robotics Olympiad', stages: ['Local Qualification', 'Regional', 'International Finals'], description: 'First international robotics competition.', type: 'Outer', startDate: '2026-05-11', endDate: '2026-05-17', maxParticipants: 1000, categories: [] }
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
            description: '1. Introduction: EcoTracker is a mobile app designed to help users track their carbon footprint in real-time.\n2. Methodology: We used React Native for cross-platform support and a Firebase backend for data persistence.\n3. Results: Preliminary testing showed a 15% reduction in individual waste for active users.',
            codeSnippet: 'import React from "react";\n\nconst CarbonCalculator = ({ usage }) => {\n  const calculateEmissions = (val) => val * 0.45;\n  return <div>{calculateEmissions(usage)} kg CO2</div>;\n};',
            files: [{name: 'Project_Proposal.pdf'}, {name: 'app_screenshot.png'}]
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
            description: 'Solar-powered irrigation system using soil moisture sensors to optimize water usage in arid regions.',
            files: [{name: 'Hardware_Schematics.pdf'}, {name: 'demo_video.mp4'}]
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
            codeSnippet: 'import tensorflow as tf\n\nmodel = tf.keras.models.load_model("sorter_v1.h5")\ndef predict_class(image):\n    return model.predict(image)',
            files: [{name: 'Model_Architecture.png'}]
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
          },
          { 
            id: 'CERT-K7R4J1V', 
            studentId: 'ST-005', 
            studentName: 'Ahmed Deen', 
            competitionId: 'c1', 
            competitionName: 'Technology Innovation Summit',
            certificateTitle: 'Best Design Innovation',
            reason: 'Creative UI/UX Solutions',
            customMessage: 'Recognized for the most intuitive and aesthetically pleasing project design among over 100 participants.',
            date: '2026-02-15',
            signatureName: 'Innovation Board',
            issuedBy: 'National Education Portal Admin'
          }
        ]);
        addNotification('Demo Mode Activated! Mock data loaded across all screens.', 'success');
      } else {
        // Clear demo data
        setStudents([]);
        setCompetitions([]);
        setSubmissions([]);
        setScores([]);
        setCertificates([]);
        addNotification('Demo Mode Deactivated. Returning to blank state.', 'info');
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
      notifications,
      submissions,
      certificates,
      addCompetition,
      registerStudent,
      updateStudentStatus,
      updateStudentStage,
      setStudentResult,
      addNotification,
      removeNotification,
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
      getStudentsBySchool
    }}>
      {children}
    </AppContext.Provider>
  );
};
