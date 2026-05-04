import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Moon, 
  Languages, 
  Smartphone, 
  Mail, 
  Lock, 
  Camera,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useAuth } from '../auth/AuthContext';
import axios from 'axios';

export default function Settings() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [profileForm, setProfileForm] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    jobTitle: user?.jobTitle || '',
    bio: ''
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await axios.patch('/api/users/profile', profileForm);
      setUser({ ...user, ...profileForm });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'Profile', icon: User, description: 'Manage your public details' },
    { id: 'Security', icon: Shield, description: 'Passwords and access control' },
    { id: 'Notifications', icon: Bell, description: 'Where and how we contact you' },
    { id: 'Appearance', icon: Moon, description: 'Customise your workspace theme' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Settings</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Configure your SAHA experience</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Navigation */}
        <aside className="lg:w-72 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left group",
                activeTab === tab.id 
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10" 
                  : "bg-white border border-slate-100 text-slate-500 hover:border-slate-300"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                activeTab === tab.id ? "bg-white/10" : "bg-slate-50"
              )}>
                <tab.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-black">{tab.id}</p>
                <p className={cn("text-[10px] font-bold", activeTab === tab.id ? "text-slate-400" : "text-slate-400")}>
                  {tab.description}
                </p>
              </div>
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[40px] border border-slate-200 p-8 lg:p-12 shadow-sm"
          >
            {activeTab === 'Profile' && (
              <div className="max-w-2xl">
                <div className="flex items-center gap-8 mb-12">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-[32px] bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden border-4 border-white shadow-lg">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10" />
                      )}
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight">Your Avatar</h3>
                    <p className="text-slate-400 text-sm font-medium">Click to upload a high-resolution <br/> PNG or JPG file.</p>
                  </div>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Display Name</label>
                      <input 
                        type="text" 
                        value={profileForm.displayName}
                        onChange={(e) => setProfileForm({...profileForm, displayName: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3.5 text-sm font-bold focus:bg-white focus:border-blue-500 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                      <input 
                        type="email" 
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3.5 text-sm font-bold focus:bg-white focus:border-blue-500 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Job Title</label>
                    <input 
                      type="text" 
                      value={profileForm.jobTitle}
                      onChange={(e) => setProfileForm({...profileForm, jobTitle: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3.5 text-sm font-bold focus:bg-white focus:border-blue-500 transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Short Bio</label>
                    <textarea 
                      rows={4}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-[28px] px-6 py-4 text-sm font-bold focus:bg-white focus:border-blue-500 transition-all outline-none resize-none"
                      placeholder="Tell the squad about yourself..."
                    />
                  </div>

                  {message.text && (
                    <div className={cn(
                      "p-4 rounded-2xl text-xs font-bold flex items-center gap-2 border",
                      message.type === 'success' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                    )}>
                      {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      {message.text}
                    </div>
                  )}

                  <button 
                    disabled={loading}
                    className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50"
                  >
                    {loading ? 'Saving Changes...' : 'Update Settings'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'Security' && (
               <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Security Control</h3>
                    <p className="text-slate-400 font-medium tracking-tight">Protect your account with modern security standards.</p>
                  </div>
                  
                  <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 shadow-sm">
                        <Smartphone className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-sm font-black">Two-Factor Authentication</p>
                        <p className="text-xs text-slate-400 font-medium">Add an extra layer of security to your account.</p>
                      </div>
                    </div>
                    <button className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:border-blue-500 hover:text-blue-600 transition-all">Configure</button>
                  </div>

                  <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-amber-500 shadow-sm">
                        <Lock className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-sm font-black">Change Password</p>
                        <p className="text-xs text-slate-400 font-medium">Last updated 3 months ago.</p>
                      </div>
                    </div>
                    <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Update</button>
                  </div>
               </div>
            )}

            {activeTab === 'Notifications' && (
               <div className="space-y-6">
                  {['Task Reminders', 'Project Updates', 'Team Activities', 'Marketing Emails'].map((item) => (
                    <div key={item} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                      <div>
                        <p className="text-sm font-black">{item}</p>
                        <p className="text-xs text-slate-400 font-medium">Receive real-time push and email alerts.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
               </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
