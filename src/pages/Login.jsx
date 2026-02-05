import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { User, ShieldCheck } from 'lucide-react';

const Login = () => {
  const { login, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin', { replace: true });
      else navigate('/student', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (role) => {
    await login(role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 gradient-bg-subtle relative overflow-hidden">
      {/* Decorative gradient orbs - Hidden on small screens */}
      <div className="hidden sm:block absolute top-10 sm:top-20 left-5 sm:left-10 w-40 sm:w-72 h-40 sm:h-72 bg-violet-400/20 rounded-full blur-3xl" />
      <div className="hidden md:block absolute -bottom-10 md:bottom-20 -right-20 md:right-10 w-56 md:w-96 h-56 md:h-96 bg-purple-500/15 rounded-full blur-3xl" />
      <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 lg:w-[500px] h-80 lg:h-[500px] bg-blue-400/10 rounded-full blur-3xl" />

      <Card className="w-full max-w-sm sm:max-w-md relative z-10 shadow-soft-xl border-0 glass animate-scale-in">
        <CardHeader className="text-center pb-3 sm:pb-2 px-4 sm:px-6">
          <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text">
            EduComp
          </CardTitle>
          <p className="text-muted-foreground mt-2 text-xs sm:text-sm font-medium">
            Competition Management Platform
          </p>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 pt-3 sm:pt-6 px-4 sm:px-6">
          <p className="text-center text-xs sm:text-sm font-semibold text-muted-foreground">
            Select your role to sign in
          </p>
          <div className="flex flex-col gap-3 sm:gap-4">
            <button
              onClick={() => handleLogin('student')}
              disabled={loading}
              className="w-full flex flex-col sm:flex-row items-center sm:items-stretch justify-center sm:justify-start gap-3 sm:gap-5 h-auto sm:h-24 p-4 sm:p-6 rounded-2xl bg-secondary text-secondary-foreground border border-border hover:bg-accent hover:border-primary-200/50 dark:hover:border-primary-700/50 shadow-soft transition-all duration-300 hover:shadow-soft-md group disabled:opacity-50 disabled:pointer-events-none"
            >
              <div className="flex h-14 sm:h-14 w-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg group-hover:scale-105 transition-transform duration-300 shrink-0">
                <User className="h-7 w-7" />
              </div>
              <div className="text-center sm:text-left flex flex-col justify-center sm:justify-start">
                <div className="font-bold text-foreground text-base">Student</div>
                <div className="text-xs sm:text-sm text-muted-foreground font-normal mt-0.5 hidden sm:block">
                  Access your dashboard and results
                </div>
              </div>
            </button>
            <button
              onClick={() => handleLogin('admin')}
              disabled={loading}
              className="w-full flex flex-col sm:flex-row items-center sm:items-stretch justify-center sm:justify-start gap-3 sm:gap-5 h-auto sm:h-24 p-4 sm:p-6 rounded-2xl bg-secondary text-secondary-foreground border border-border hover:bg-accent hover:border-primary-200/50 dark:hover:border-primary-700/50 shadow-soft transition-all duration-300 hover:shadow-soft-md group disabled:opacity-50 disabled:pointer-events-none"
            >
              <div className="flex h-14 sm:h-14 w-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg group-hover:scale-105 transition-transform duration-300 shrink-0">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div className="text-center sm:text-left flex flex-col justify-center sm:justify-start">
                <div className="font-bold text-foreground text-base">Administrator</div>
                <div className="text-xs sm:text-sm text-muted-foreground font-normal mt-0.5 hidden sm:block">
                  Manage competitions and students
                </div>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
