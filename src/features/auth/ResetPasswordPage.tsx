import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/auth/reset-password', { token, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-white to-transparent">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
           <div className="w-16 h-16 rounded-[24px] bg-blue-600 flex items-center justify-center text-white font-black text-2xl mx-auto shadow-2xl shadow-blue-600/30 mb-4">S</div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">Vault Recovery</h1>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Update your secure access key</p>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-2xl relative overflow-hidden">
          {success ? (
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="text-center py-8"
            >
               <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8" />
               </div>
               <h2 className="text-xl font-black text-slate-900 mb-2">Password Restored!</h2>
               <p className="text-sm text-slate-400 font-medium">Redirecting you to the portal...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">New Password</label>
                  <div className="relative">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <input 
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:bg-white focus:border-blue-500 transition-all outline-none"
                        placeholder="••••••••"
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Secret</label>
                  <div className="relative">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <input 
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:bg-white focus:border-blue-500 transition-all outline-none"
                        placeholder="••••••••"
                     />
                  </div>
               </div>

               {error && (
                 <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                 </div>
               )}

               <button 
                 disabled={loading}
                 className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-slate-800 shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
               >
                  {loading ? 'Restoring...' : (
                    <>
                       Reset Access Key
                       <ArrowRight className="w-4 h-4" />
                    </>
                  )}
               </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
