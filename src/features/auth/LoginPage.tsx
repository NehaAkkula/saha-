import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Info, ShieldCheck, Mail, Lock, User, Briefcase, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Team Member');
  const [jobTitle, setJobTitle] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (isForgot) {
        const res = await axios.post('/api/auth/forgot-password', { email });
        setSuccess(`Demo Token: ${res.data.token}. In a real app, this would be emailed.`);
      } else if (isLogin) {
        await login(email, password);
        navigate('/');
      } else {
        await axios.post('/api/auth/register', { email, password, displayName: name, role, jobTitle });
        setIsLogin(true);
        setSuccess('Account created! Please login with your new credentials.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const fillDemo = (role: string) => {
    const demos: any = {
      admin: ['admin@saha.com', 'Admin@123'],
      manager: ['manager@saha.com', 'Manager@123'],
      member: ['member@saha.com', 'Member@123'],
    };
    setEmail(demos[role][0]);
    setPassword(demos[role][1]);
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900 overflow-hidden relative">
      {/* Left Panel - Branding */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-slate-900 relative p-12 flex-col justify-between overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute -top-1/4 -right-1/4 w-full h-full bg-blue-600 rounded-full blur-[150px]" />
          <div className="absolute top-1/2 left-1/4 w-1/2 h-1/2 bg-amber-500 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-600/30">S</div>
            <span className="text-3xl font-black tracking-tighter text-white">SAHA</span>
          </div>
          <div className="mt-12 max-w-sm">
            <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
              Manage your squad <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-8">seamlessly.</span>
            </h1>
            <p className="text-slate-400 mt-6 text-lg leading-relaxed">
              Premium collaboration tool for modern product teams. Track performance, visualize workflows, and build faster.
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex gap-12 text-slate-400 text-sm font-bold uppercase tracking-widest">
            <div className="flex flex-col gap-2">
              <span className="text-blue-500 text-xl font-black">500+</span>
              <span>Enterprises</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-amber-500 text-xl font-black">1.2M</span>
              <span>Tasks Tracked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 bg-white relative flex flex-col p-8 md:p-16 lg:p-24 overflow-y-auto">
        <div className="max-w-md w-full mx-auto my-auto">
          <div className="md:hidden flex items-center gap-2 mb-12">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">S</div>
            <span className="text-xl font-bold tracking-tighter">SAHA</span>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            key={isForgot ? 'forgot' : isLogin ? 'login' : 'register'}
          >
            <h2 className="text-4xl font-extrabold tracking-tight mb-2">
              {isForgot ? 'Reset your key.' : isLogin ? 'Welcome back.' : 'Join the squad.'}
            </h2>
            <p className="text-slate-400 font-medium mb-8">
              {isForgot ? "We'll send you a secure link to get back in." : isLogin ? "Please enter your details to sign in." : "Fill the form to start your 14-day free trial."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="popLayout">
                {!isLogin && !isForgot && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pt-1"
                  >
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm font-bold"
                        placeholder="Your Full Name"
                      />
                    </div>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm font-bold"
                        placeholder="Job Title (e.g. Lead Designer)"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm font-bold"
                  placeholder="name@company.com"
                />
              </div>

              {!isForgot && (
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm font-bold"
                    placeholder="••••••••"
                  />
                </div>
              )}

              {isLogin && !isForgot && (
                <div className="flex items-center justify-between px-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="text-sm font-bold text-slate-500 group-hover:text-slate-800 transition-colors">Remember me</span>
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setIsForgot(true)}
                    className="text-sm font-bold text-blue-600 hover:text-blue-700"
                  >
                    Forgot?
                  </button>
                </div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-rose-50 text-rose-600 text-xs font-bold rounded-2xl border border-rose-100 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-2xl border border-emerald-100 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {success}
                </motion.div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                {isForgot ? <Mail className="w-5 h-5" /> : isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                {isForgot ? 'Send Recovery Link' : isLogin ? 'Sign In to SAHA' : 'Initialize Account'}
              </button>

              {isForgot && (
                <button 
                  type="button"
                  onClick={() => setIsForgot(false)}
                  className="w-full text-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Back to Login
                </button>
              )}
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 space-y-6">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="w-full text-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
              >
                {isLogin ? "New to SAHA? Request an invite" : "Existing member? Log in to your portal"}
              </button>

              <div className="bg-slate-50 p-6 rounded-[28px] border border-slate-100">
                <div className="flex items-center gap-2 mb-4 text-slate-400">
                  <Info className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Quick Demo Access</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['admin', 'manager', 'member'].map(r => (
                    <button
                      key={r}
                      onClick={() => fillDemo(r)}
                      className="py-2.5 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:shadow-sm transition-all"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
