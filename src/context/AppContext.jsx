import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = window.localStorage.getItem('edu-theme');
    return saved === 'dark' || saved === 'light' ? saved : 'light';
  });

  const [students, setStudents] = useState([]);
  const [schoolStudents, setSchoolStudents] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [certificates, setCertificates] = useState([]); // Pending backend
  const [achievements, setAchievements] = useState([]); // Pending backend

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
        try {
            const compsRes = await api.get('/competitions');
            const mappedComps = compsRes.data.map(c => ({
                id: c._id,
                name: c.title,
                description: c.description,
                stages: c.stages || ['Registration', 'Submission', 'Review', 'Finals'],
                type: c.type || 'Internal', 
                startDate: new Date(c.createdAt).toISOString().split('T')[0],
                endDate: new Date(c.deadline).toISOString().split('T')[0],
                maxParticipants: c.maxParticipants || 100
            }));
            setCompetitions(mappedComps);

            if (user) {
                try {
                    const notifRes = await api.get('/notifications');
                    setNotifications(notifRes.data);
                } catch (err) {
                   console.error("Failed to fetch notifications", err);
                }
            }

            if (user?.role === 'admin') {
                const [subsRes, certsRes, schoolStudentsRes] = await Promise.all([
                    api.get('/submissions'),
                    api.get('/certificates'),
                    api.get('/schools/students')
                ]);

                const mappedStudents = subsRes.data.map(s => ({
                    id: s._id, // submission id
                    studentId: s.student?._id,
                    name: s.student?.name || 'Unknown',
                    email: s.student?.email,
                    grade: s.student?.grade || '-',
                    clazz: s.student?.clazz || '-',
                    school: s.student?.school || 'School',
                    competition: s.competition?.title,
                    stage: s.stage,
                    status: s.status.charAt(0).toUpperCase() + s.status.slice(1),
                    result: s.result,
                    projectTitle: s.title || s.projectLink,
                    participationType: s.participationType,
                    submissionType: s.submissionType,
                    members: s.members,
                    feedback: s.feedback
                }));
                setStudents(mappedStudents);

                const mappedSchoolStudents = schoolStudentsRes.data.map(u => ({
                    id: u._id,
                    name: u.name,
                    email: u.email,
                    grade: u.grade || '-',
                    clazz: u.clazz || '-',
                    school: u.school || ''
                }));
                setSchoolStudents(mappedSchoolStudents);

                const mappedCerts = certsRes.data.map(c => ({
                    id: c._id,
                    studentId: c.student,
                    studentName: c.studentName,
                    competitionId: c.competition,
                    competitionName: c.competitionName,
                    achievement: c.achievement,
                    issuedBy: c.issuedByName,
                    date: new Date(c.date || c.createdAt).toISOString().split('T')[0]
                }));
                setCertificates(mappedCerts);
            } else if (user?.role === 'student') {
                const [subsRes, certsRes] = await Promise.all([
                    api.get('/submissions/my'),
                    api.get('/certificates/my')
                ]);

                const mappedSubmissions = subsRes.data.map(s => ({
                    id: s._id,
                    studentId: s.student,
                    competitionId: s.competition?._id,
                    competition: s.competition?.title,
                    projectTitle: s.title || s.competition?.title,
                    url: s.projectLink,
                    participationType: s.participationType,
                    submissionType: s.submissionType,
                    status: s.status,
                    stage: s.stage,
                    date: new Date(s.submittedAt || s.createdAt).toISOString().split('T')[0],
                    feedback: s.feedback,
                    result: s.result
                }));
                setSubmissions(mappedSubmissions);

                const mappedCerts = certsRes.data.map(c => ({
                    id: c._id,
                    studentId: c.student,
                    studentName: c.studentName,
                    competitionId: c.competition,
                    competitionName: c.competitionName,
                    achievement: c.achievement,
                    issuedBy: c.issuedByName,
                    date: new Date(c.date || c.createdAt).toISOString().split('T')[0]
                }));
                setCertificates(mappedCerts);
            }
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    fetchData();
  }, [user]);

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

  const addNotification = (text, type = "info", studentId = null) => {
      setNotifications(prev => [{ id: Date.now(), text, type, date: new Date().toISOString().split('T')[0], studentId }, ...prev]);
  };

  const removeNotification = (notificationId) => {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const addCompetition = async (data) => {
      try {
        const res = await api.post('/competitions', {
            title: data.name,
            description: data.description,
            deadline: data.endDate,
            stages: data.stages,
            type: data.type,
            maxParticipants: data.maxParticipants,
            prize: data.prize,
            requirements: data.requirements
        });
        // Refetch or update local
        const newComp = {
            id: res.data._id,
            name: res.data.title,
            description: res.data.description,
            stages: res.data.stages || ['Registration', 'Submission', 'Review', 'Finals'],
            type: res.data.type || 'Internal',
            startDate: new Date(res.data.createdAt).toISOString().split('T')[0],
            endDate: new Date(res.data.deadline).toISOString().split('T')[0],
            maxParticipants: res.data.maxParticipants || 100
        };
        setCompetitions(prev => [...prev, newComp]);
        addNotification(`New competition added: ${data.name}`, "success");
      } catch (error) {
          console.error("Failed to add competition", error);
          addNotification("Failed to add competition", "error");
      }
  };

  const registerStudent = async (data) => { // used for "Submitting"/Registering for comp
    // data: { competition: name, type, members, ... }
    const comp = competitions.find(c => c.name === data.competition);
    if (!comp) return;

    try {
        const res = await api.post('/submissions', {
            competitionId: comp.id,
            participationType: data.type,
            members: data.members,
            projectLink: '' // Pending submission
        });

        // Optimistically update local submissions for the logged-in student
        const created = res.data;
        const newSubmission = {
            id: created._id,
            studentId: created.student,
            competitionId: comp.id,
            competition: comp.name,
            projectTitle: created.title || comp.name,
            url: created.projectLink,
            participationType: created.participationType,
            submissionType: created.submissionType,
            status: created.status,
            stage: created.stage,
            date: new Date(created.submittedAt || created.createdAt).toISOString().split('T')[0],
            feedback: created.feedback,
            result: created.result
        };
        setSubmissions(prev => [...prev, newSubmission]);

        addNotification(`Registration successful for ${data.competition}`, "success");
    } catch (error) {
        console.error("Registration failed", error);
        addNotification("Registration failed", "error");
    }
  };

  // Admin Actions
  const updateStudentStatus = async (id, status) => { // id is submission id
    try {
        await api.put(`/submissions/${id}`, { status: status.toLowerCase() });
        setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
        addNotification(`Status updated to ${status}`, "success");
    } catch (error) {
        console.error("Update failed", error);
    }
  };

  const updateStudentStage = async (id, stage) => {
    try {
        await api.put(`/submissions/${id}`, { stage });
        setStudents(prev => prev.map(s => s.id === id ? { ...s, stage } : s));
        addNotification(`Stage updated to ${stage}`, "success");
    } catch (error) {
        console.error("Update failed", error);
    }
  };

  const setStudentResult = async (id, result) => {
      try {
        await api.put(`/submissions/${id}`, { result });
        setStudents(prev => prev.map(s => s.id === id ? { ...s, result } : s));
        addNotification(`Result updated to ${result}`, "success");
    } catch (error) {
        console.error("Update failed", error);
    }
  };

  const setStudentFeedback = async (id, feedback) => {
      try {
        await api.put(`/submissions/${id}`, { feedback });
        setStudents(prev => prev.map(s => s.id === id ? { ...s, feedback } : s));
        addNotification(`Feedback sent`, "success");
    } catch (error) {
        console.error("Update failed", error);
    }
  };

  const addSubmission = async (submission) => {
      // Logic for adding a project link to an existing registration?
      // Or creating new submission?
      // existing flow might be: Register -> Then Submit Link.
      // But my backend combines them.
      // If I already registered (created submission with empty link), I should UPDATE it.
      // But `addSubmission` in frontend usually means "Submit".
      // Let's assume it updates.
      // But I don't have the submission ID here easily.
      // I'll assume it creates a NEW submission if not exists, or I need to find the existing one.
      // The frontend `addSubmission` takes { competitionId, title, url ... }
      // I'll try to create new for now.
      try {
          const res = await api.post('/submissions', {
              competitionId: submission.competitionId,
              title: submission.title,
              projectLink: submission.url,
              submissionType: submission.type
          });
          const newSub = {
              id: res.data._id,
              competitionId: res.data.competition,
              url: res.data.projectLink,
              status: res.data.status,
              date: new Date(res.data.submittedAt).toISOString().split('T')[0],
              feedback: null
          };
          setSubmissions(prev => [...prev, newSub]);
          addNotification("Project submitted successfully", "success");
          return newSub;
      } catch (error) {
          console.error("Submission failed", error);
          addNotification("Submission failed", "error");
      }
  };
  
  // Derived / helper functions for submissions & certificates
  const getStudentSubmissions = (studentId) =>
    submissions.filter((s) => s.studentId === studentId);
  const getCompetitionSubmissions = (competitionId) =>
    submissions.filter((s) => s.competitionId === competitionId);

  const issueCertificate = async (data) => {
    // data: { studentId, studentName, competitionId, competitionName, achievement }
    try {
      const res = await api.post('/certificates', {
        studentId: data.studentId,
        competitionId: data.competitionId,
        achievement: data.achievement
      });

      const c = res.data;
      const mapped = {
        id: c._id,
        studentId: c.student,
        studentName: c.studentName,
        competitionId: c.competition,
        competitionName: c.competitionName,
        achievement: c.achievement,
        issuedBy: c.issuedByName,
        date: new Date(c.date || c.createdAt).toISOString().split('T')[0]
      };

      setCertificates(prev => [...prev, mapped]);
      addNotification(
        `Certificate issued to ${mapped.studentName} for ${mapped.competitionName}`,
        'success',
        mapped.studentId
      );
    } catch (error) {
      console.error('Issue certificate failed', error);
      addNotification('Failed to issue certificate', 'error');
    }
  };

  const getStudentCertificates = (id) =>
    certificates.filter((c) => c.studentId === id);

  const getCompetitionCertificates = (id) =>
    certificates.filter((c) => c.competitionId === id);

  const addAchievement = () => {};
  const getStudentAchievements = () => [];
  const removeAchievement = () => {};
  const updateSubmissionStatus = () => {}; // Used by student?

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      students,
      schoolStudents,
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
