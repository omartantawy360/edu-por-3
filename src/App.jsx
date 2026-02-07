import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { TeamProvider } from './context/TeamContext';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import DashboardLayout from './components/Layout/DashboardLayout';
import StudentDashboard from './pages/StudentDashboard';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import CreateCompetition from './pages/CreateCompetition';
import TeamsPage from './pages/TeamsPage';
import TeamHub from './pages/TeamHub';
import SkillsPage from './pages/SkillsPage';
import SubmissionsPage from './pages/SubmissionsPage';
import AchievementsPage from './pages/AchievementsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import CertificatePage from './pages/CertificatePage';
import RecommendationsPage from './pages/RecommendationsPage';
import StudentManagement from './pages/admin/StudentManagement';
import SubmissionsOverview from './pages/admin/SubmissionsOverview';
import CertificateManagement from './pages/admin/CertificateManagement';
import TeamsManagement from './pages/admin/TeamsManagement';
import TeamDetails from './pages/admin/TeamDetails';
import MessagesInbox from './pages/admin/MessagesInbox';
import UserSettingsPage from './pages/UserSettingsPage';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex bg-background items-center justify-center h-screen gradient-bg-subtle">
      <div className="flex flex-col items-center gap-4">
        <div className="h-14 w-14 rounded-2xl border-4 border-primary/30 border-t-primary animate-spin" />
        <p className="text-sm font-medium text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute allowedRoles={['student']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<StudentDashboard />} />
        <Route path="teams" element={<TeamsPage />} />
        <Route path="team/:teamId" element={<TeamHub />} />
        <Route path="skills" element={<SkillsPage />} />
        <Route path="submissions" element={<SubmissionsPage />} />
        <Route path="achievements" element={<AchievementsPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="certificate" element={<CertificatePage />} />
        <Route path="recommendations" element={<RecommendationsPage />} />
        <Route path="account" element={<UserSettingsPage />} />
      </Route>

      <Route path="/register" element={
        <ProtectedRoute allowedRoles={['student']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Register />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="messages" element={<MessagesInbox />} />
        <Route path="teams" element={<TeamsManagement />} />
        <Route path="teams/:teamId" element={<TeamDetails />} />
        <Route path="create-competition" element={<CreateCompetition />} />
        <Route path="students" element={<StudentManagement />} />
        <Route path="submissions" element={<SubmissionsOverview />} />
        <Route path="certificates" element={<CertificateManagement />} />
        <Route path="account" element={<UserSettingsPage />} />
      </Route>

    </Routes>
  );
}

const ThemedApp = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <TeamProvider>
          <ChatProvider>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
              <ThemedApp />
            </ThemeProvider>
          </ChatProvider>
        </TeamProvider>
      </AppProvider>
    </AuthProvider>
  );
}
