import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/Card';
import {
  User,
  ShieldCheck,
  Mail,
  Lock,
  UserPlus,
  ArrowRight,
} from 'lucide-react';
import DotGrid from '../components/ui/DotGrid';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const Login = () => {
  const { login, register, sendOtp, forgotPassword, resetUserPassword, loading, user } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    school: '',
  });
  const [errors, setErrors] = useState({});
  const [successData, setSuccessData] = useState(null);
  const [registerStep, setRegisterStep] = useState('data'); // 'data' or 'otp'
  const [resetMode, setResetMode] = useState(false);
  const [resetStep, setResetStep] = useState('email'); // 'email' or 'otp'

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'register') {
      setIsLogin(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin', { replace: true });
      else navigate('/student', { replace: true });
    }
  }, [user, navigate]);

   const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    setErrors(prev => ({ ...prev, form: null }));
  };

   const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.name) newErrors.name = 'Full name is required';
      if (!formData.school) {
        newErrors.school = role === 'admin' ? 'School name is required' : 'School code is required';
      }
      if (!role) newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    if (!validate()) return;

    if (resetMode) {
      if (resetStep === 'email') {
        const res = await forgotPassword(formData.email);
        if (res.success) {
          setResetStep('otp');
          setErrors({});
        } else {
          setErrors({ form: res.message });
        }
      } else {
        const res = await resetUserPassword(formData.email, formData.otp, formData.password);
        if (res.success) {
          setSuccessData({
            title: 'Password Reset Successful',
            message: 'Your password has been updated. You can now login with your new password.',
          });
          setResetMode(false);
          setIsLogin(true);
          setFormData({ ...formData, password: '', otp: '' });
        } else {
          setErrors({ form: res.message });
        }
      }
      return;
    }

    if (isLogin) {
      const res = await login(formData.email, formData.password);
      if (!res.success) {
        if (res.errors) {
          const backendErrors = {};
          res.errors.forEach(err => {
            backendErrors[err.path] = err.msg;
          });
          setErrors(backendErrors);
        } else {
          setErrors({ form: res.message });
        }
      }
    } else {
      if (registerStep === 'data') {
        const res = await sendOtp(formData.email);
        if (res.success) {
          setRegisterStep('otp');
          setErrors({});
        } else {
          if (res.errors) {
            const backendErrors = {};
            res.errors.forEach((err) => {
              backendErrors[err.path] = err.msg;
            });
            setErrors(backendErrors);
          } else {
            setErrors({ form: res.message });
          }
        }
      } else {
        const res = await register(
          formData.name,
          formData.email,
          formData.password,
          role,
          formData.school,
          formData.otp
        );
        if (!res.success) {
          if (res.errors) {
            const backendErrors = {};
            res.errors.forEach((err) => {
              backendErrors[err.path] = err.msg;
            });
            setErrors(backendErrors);
          } else {
            setErrors({ form: res.message });
          }
        } else {
          // Registration successful
          if (role === 'admin') {
            setSuccessData({
              title: 'School Registered!',
              message: `Your school code is: ${res.data.schoolCode}. Share this with your students so they can join.`,
              code: res.data.schoolCode,
            });
          } else {
            setSuccessData({
              title: 'Registration Successful',
              message:
                'Your account is pending approval from your school administrator.',
            });
          }
          // Clear form
          setFormData({ name: '', email: '', password: '', school: '', otp: '' });
          setIsLogin(true);
          setRegisterStep('data');
        }
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setResetMode(false);
    setErrors({});
    setFormData({ name: '', email: '', password: '', school: '', otp: '' });
    setRole(null);
    setRegisterStep('data');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Decorative gradient orbs - Hidden on small screens */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />

      <Card className="w-full max-w-sm sm:max-w-md absolute z-10 shadow-soft-xl border-0 glass animate-scale-in">
        <CardHeader className="text-center pb-3 sm:pb-2 px-4 sm:px-6">
          <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text">
            Competition Management
          </CardTitle>
          <div className="mt-1">
            <button 
              onClick={() => navigate('/')}
              className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowRight className="h-3 w-3 rotate-180" /> Back to Home
            </button>
          </div>
          <p className="text-muted-foreground mt-2 text-xs sm:text-sm font-medium">
            Competition Management Platform
          </p>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 pt-3 sm:pt-6 px-4 sm:px-6">
          {errors.form && (
            <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm text-center animate-shake">
              {errors.form}
            </div>
          )}

          {!isLogin && !role ? (
            <>
              <p className="text-center text-xs sm:text-sm font-semibold text-muted-foreground">
                Select your role to register
              </p>
              <div className="flex flex-col gap-3 sm:gap-4">
                <button
                  onClick={() => setRole('student')}
                  className="w-full flex flex-col sm:flex-row items-center sm:items-stretch justify-center sm:justify-start gap-3 sm:gap-5 h-auto sm:h-24 p-4 sm:p-6 rounded-2xl bg-secondary text-secondary-foreground border border-border hover:bg-accent hover:border-primary-200/50 dark:hover:border-primary-700/50 shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1 dark:shadow-md dark:hover:shadow-lg group"
                >
                  <div className="flex h-14 sm:h-14 w-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <User className="h-7 w-7 group-hover:animate-float" />
                  </div>
                  <div className="text-center sm:text-left flex flex-col justify-center sm:justify-start">
                    <div className="font-bold text-foreground text-base transition-colors duration-200">
                      Student
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-normal mt-0.5 hidden sm:block transition-colors duration-200">
                      Access your dashboard and results
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setRole('admin')}
                  className="w-full flex flex-col sm:flex-row items-center sm:items-stretch justify-center sm:justify-start gap-3 sm:gap-5 h-auto sm:h-24 p-4 sm:p-6 rounded-2xl bg-secondary text-secondary-foreground border border-border hover:bg-accent hover:border-primary-200/50 dark:hover:border-primary-700/50 shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1 dark:shadow-md dark:hover:shadow-lg group"
                >
                  <div className="flex h-14 sm:h-14 w-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <ShieldCheck className="h-7 w-7 group-hover:animate-pulse-glow" />
                  </div>
                  <div className="text-center sm:text-left flex flex-col justify-center sm:justify-start">
                    <div className="font-bold text-foreground text-base transition-colors duration-200">
                      Administrator
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-normal mt-0.5 hidden sm:block transition-colors duration-200">
                      Manage competitions and students
                    </div>
                  </div>
                </button>
              </div>
              {errors.role && <p className="text-center text-xs text-destructive font-bold">{errors.role}</p>}
              <div className="text-center mt-4">
                <button
                  onClick={toggleMode}
                  className="text-sm text-primary hover:underline"
                >
                  Already have an account? Login
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold">
                  {resetMode 
                    ? (resetStep === 'email' ? 'Reset Password' : 'New Password')
                    : (isLogin
                      ? 'Welcome Back'
                      : registerStep === 'otp'
                        ? 'Verify Your Email'
                        : `Register as ${role === 'admin' ? 'Administrator' : 'Student'}`)}
                </h3>
              </div>

              {resetMode ? (
                /* Password Reset Fields */
                resetStep === 'email' ? (
                  <div className="space-y-4">
                    <p className="text-center text-xs text-muted-foreground px-2">
                      Enter your email address to receive a password reset code.
                    </p>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      error={errors.email}
                      icon={<Mail className="h-4 w-4" />}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-center text-xs text-muted-foreground px-2">
                      Enter the 6-digit code sent to <strong>{formData.email}</strong> and your new password.
                    </p>
                    <Input
                      name="otp"
                      placeholder="Enter 6-digit code"
                      value={formData.otp}
                      onChange={handleChange}
                      required
                      error={errors.otp}
                      icon={<ShieldCheck className="h-4 w-4" />}
                      className="text-center tracking-[0.5em] text-lg font-bold"
                      maxLength={6}
                    />
                    <Input
                      name="password"
                      type="password"
                      placeholder="New Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      error={errors.password}
                      icon={<Lock className="h-4 w-4" />}
                    />
                  </div>
                )
              ) : isLogin ? (
                /* Login Fields */
                <>
                  <div className="space-y-2">
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      error={errors.email}
                      icon={<Mail className="h-4 w-4" />}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      name="password"
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      error={errors.password}
                      icon={<Lock className="h-4 w-4" />}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setResetMode(true);
                        setResetStep('email');
                        setErrors({});
                      }}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </>
              ) : registerStep === 'otp' ? (
                /* Registration Step 2: OTP */
                <div className="space-y-4">
                  <p className="text-center text-xs text-muted-foreground px-2">
                    A 6-digit verification code has been sent to <strong>{formData.email}</strong>. Please enter it below.
                  </p>
                  <div className="space-y-2">
                    <Input
                      name="otp"
                      placeholder="Enter 6-digit code"
                      value={formData.otp}
                      onChange={handleChange}
                      required
                      error={errors.otp}
                      icon={<ShieldCheck className="h-4 w-4" />}
                      className="text-center tracking-[0.5em] text-lg font-bold"
                      maxLength={6}
                    />
                  </div>
                </div>
              ) : (
                /* Registration Step 1: Data */
                <>
                  <div className="space-y-2">
                    <Input
                      name="school"
                      placeholder={role === 'admin' ? 'School Name' : 'School Code'}
                      value={formData.school}
                      onChange={handleChange}
                      required
                      error={errors.school}
                      icon={<ShieldCheck className="h-4 w-4" />}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      error={errors.name}
                      icon={<User className="h-4 w-4" />}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      error={errors.email}
                      icon={<Mail className="h-4 w-4" />}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      name="password"
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      error={errors.password}
                      icon={<Lock className="h-4 w-4" />}
                    />
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-violet-500/25 transition-all animate-fade-up"
                disabled={loading}
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                ) : resetMode ? (
                  resetStep === 'email' ? 'Send Reset Code' : 'Reset Password'
                ) : isLogin ? (
                  'Sign In'
                ) : registerStep === 'otp' ? (
                  'Verify & Complete'
                ) : (
                  'Get Verification Code'
                )}
              </Button>

              <div className="text-center mt-4 space-y-2">
                {resetMode && (
                  <button
                    type="button"
                    onClick={() => {
                      setResetMode(false);
                      setIsLogin(true);
                    }}
                    className="block w-full text-sm text-muted-foreground hover:text-primary mb-2"
                  >
                    Back to Login
                  </button>
                )}
                {!isLogin && !resetMode && (
                  <button
                    type="button"
                    onClick={() => {
                      setRole(null);
                      setRegisterStep('data');
                    }}
                    className="block w-full text-sm text-muted-foreground hover:text-primary mb-2"
                  >
                    Back to Role Selection
                  </button>
                )}
                {registerStep === 'otp' && (
                  <button
                    type="button"
                    onClick={() => setRegisterStep('data')}
                    className="block w-full text-sm text-violet-600 hover:text-violet-700 font-medium mb-2"
                  >
                    Edit Details
                  </button>
                )}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-sm text-primary hover:underline"
                >
                  {isLogin
                    ? "Don't have an account? Register"
                    : 'Already have an account? Login'}
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Success Modal */}
      {successData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md shadow-xl border-0 bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-xl text-green-600 dark:text-green-400 flex items-center gap-2">
                <ShieldCheck className="h-6 w-6" />
                {successData.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 dark:text-slate-300">
                {successData.message}
              </p>
              {successData.code && (
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                    School Code
                  </p>
                  <p className="text-2xl font-bold tracking-widest font-mono select-all">
                    {successData.code}
                  </p>
                </div>
              )}
              <Button onClick={() => setSuccessData(null)} className="w-full">
                Got it, Proceed to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Login;
