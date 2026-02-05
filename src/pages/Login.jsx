import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
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
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg-subtle relative overflow-hidden">
      {/* Decorative gradient orbs - Hidden on small screens */}
      <div className="hidden sm:block absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-violet-400/20 rounded-full blur-3xl" />
      <div className="hidden md:block absolute bottom-20 right-10 w-64 md:w-96 h-64 md:h-96 bg-purple-500/15 rounded-full blur-3xl" />
      <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 lg:w-[500px] h-96 lg:h-[500px] bg-blue-400/10 rounded-full blur-3xl" />

      <Card className="w-full max-w-md relative z-10 shadow-soft-xl border-0 glass animate-scale-in">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl sm:text-4xl font-extrabold gradient-text">
            EduComp
          </CardTitle>
          <p className="text-muted-foreground mt-2 text-xs sm:text-sm font-medium">
            Competition Management Platform
          </p>
        </CardHeader>
        <CardContent className="space-y-6 pt-4 sm:pt-6">
          <p className="text-center text-xs sm:text-sm font-semibold text-muted-foreground">
            Select your role to sign in
          </p>
          <div className="grid gap-4">
            <Button
              variant="secondary"
              className="h-20 sm:h-24 justify-start gap-3 sm:gap-5 rounded-2xl px-4 sm:px-6 hover:border-primary-300/50 dark:hover:border-primary-600/50 transition-all duration-300 group flex-col sm:flex-row"
              onClick={() => handleLogin('student')}
              disabled={loading}
            >
              <div className="flex h-12 sm:h-14 w-12 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg group-hover:scale-105 transition-transform duration-300 shrink-0">
                <User className="h-6 sm:h-7 w-6 sm:w-7" />
              </div>
              <div className="text-center sm:text-left">
                <div className="font-bold text-foreground text-sm sm:text-base">Student</div>
                <div className="text-xs sm:text-sm text-muted-foreground font-normal mt-0.5 hidden sm:block">
                  Access your dashboard and results
                </div>
              </div>
            </Button>
            <Button
              variant="secondary"
              className="h-20 sm:h-24 justify-start gap-3 sm:gap-5 rounded-2xl px-4 sm:px-6 hover:border-primary-300/50 dark:hover:border-primary-600/50 transition-all duration-300 group flex-col sm:flex-row"
              onClick={() => handleLogin('admin')}
              disabled={loading}
            >
              <div className="flex h-12 sm:h-14 w-12 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg group-hover:scale-105 transition-transform duration-300 shrink-0">
                <ShieldCheck className="h-6 sm:h-7 w-6 sm:w-7" />
              </div>
              <div className="text-center sm:text-left">
                <div className="font-bold text-foreground text-sm sm:text-base">Administrator</div>
                <div className="text-xs sm:text-sm text-muted-foreground font-normal mt-0.5 hidden sm:block">
                  Manage competitions and students
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
