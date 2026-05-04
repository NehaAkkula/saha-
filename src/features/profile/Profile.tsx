import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  User, 
  Mail, 
  Briefcase, 
  Calendar, 
  MapPin, 
  Github, 
  Twitter, 
  Globe,
  Clock,
  Target,
  Users,
  Award,
  ChevronRight,
  TrendingUp,
  Activity as ActivityIcon
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

interface ProfileData {
  id: string;
  email: string;
  displayName: string;
  jobTitle: string;
  role: string;
  status: string;
  photoURL: string;
  createdAt: string;
  activities: any[];
  teams: any[];
}

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    axios.get(`/api/users/${id}/profile`)
      .then(res => setProfile(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest animate-pulse">Syncing Profile...</div>;
  if (!profile) return <div className="p-20 text-center text-rose-500 font-bold">User profile not found.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Profile Header Card */}
      <div className="bg-white rounded-[48px] border border-slate-200 overflow-hidden shadow-sm relative">
        <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        </div>
        
        <div className="px-12 pb-12">
          <div className="relative -mt-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex flex-col md:flex-row md:items-end gap-6 text-center md:text-left">
              <div className="relative mx-auto md:mx-0">
                <div className="w-40 h-40 rounded-[48px] bg-white border-[6px] border-white shadow-2xl flex items-center justify-center overflow-hidden">
                  {profile.photoURL ? (
                    <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                      <User className="w-16 h-16" />
                    </div>
                  )}
                </div>
                <div className={cn(
                  "absolute bottom-4 right-4 w-6 h-6 rounded-full border-4 border-white shadow-lg",
                  profile.status === 'Active' ? "bg-emerald-500" : "bg-slate-300"
                )} />
              </div>
              <div className="pb-2">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                   <h1 className="text-4xl font-black text-slate-900 tracking-tight">{profile.displayName}</h1>
                   <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">PRO</span>
                </div>
                <p className="text-slate-400 font-bold mt-1 text-lg">{profile.jobTitle || 'Contributor'}</p>
              </div>
            </div>
            
            <div className="flex gap-3 justify-center md:pb-2">
               <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Send Message
               </button>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8 border-t border-slate-50 pt-12">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                   <Mail className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                   <p className="text-sm font-bold text-slate-900">{profile.email}</p>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                   <Users className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Role</p>
                   <p className="text-sm font-bold text-slate-900">{profile.role}</p>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                   <Calendar className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined Date</p>
                   <p className="text-sm font-bold text-slate-900">{format(new Date(profile.createdAt), 'MMMM yyyy')}</p>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                   <Award className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Achievements</p>
                   <p className="text-sm font-bold text-slate-900">12 Badges Earned</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Experience & Skills */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                 <Users className="w-6 h-6 text-blue-500" />
                 Teams
              </h3>
              <div className="space-y-4">
                 {profile.teams.map(team => (
                   <div key={team.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 font-black">
                            {team.name[0]}
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-900">{team.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{team.teamRole}</p>
                         </div>
                      </div>
                      <button className="p-2 rounded-xl bg-white border border-slate-100 opacity-0 group-hover:opacity-100 transition-all text-slate-400 hover:text-blue-600">
                         <ChevronRight className="w-4 h-4" />
                      </button>
                   </div>
                 ))}
                 {profile.teams.length === 0 && (
                   <p className="text-sm text-slate-400 font-bold text-center py-4">Not assigned to any teams yet.</p>
                 )}
              </div>
           </div>

           <div className="bg-slate-900 p-8 rounded-[40px] text-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-20">
                 <TrendingUp className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold mb-6">Efficiency Stats</h3>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                       <span>Task Velocity</span>
                       <span className="text-blue-400">92%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-blue-500" />
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                       <span>Quality Score</span>
                       <span className="text-amber-400">88%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: '88%' }} className="h-full bg-amber-500" />
                    </div>
                 </div>
              </div>
              <button className="mt-8 w-full py-4 rounded-2xl bg-white/10 border border-white/20 text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all">Detailed Analytics</button>
           </div>
        </div>

        {/* Activity Timeline */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                 <ActivityIcon className="w-6 h-6 text-indigo-500" />
                 Recent Activity
              </h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">View Journal</button>
           </div>
           
           <div className="relative space-y-8 before:absolute before:left-6 before:top-4 before:bottom-4 before:w-px before:bg-slate-100">
              {profile.activities.map((activity, i) => (
                <div key={activity.id} className="relative flex gap-8">
                   <div className="relative z-10 w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                      <Clock className="w-5 h-5" />
                   </div>
                   <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between mb-1">
                         <h4 className="text-sm font-black text-slate-900">{activity.action.replace('_', ' ')}</h4>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {format(new Date(activity.createdAt), 'MMM dd, HH:mm')}
                         </span>
                      </div>
                      <p className="text-sm text-slate-500 font-medium tracking-tight">
                         {activity.details || `Performed ${activity.action.toLowerCase()} on ${activity.targetType || 'system'}`}
                      </p>
                      {activity.targetType === 'Project' && (
                        <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 w-fit">
                           <Target className="w-3 h-3 text-emerald-500" />
                           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Project: {activity.targetId}</span>
                        </div>
                      )}
                   </div>
                </div>
              ))}
              {profile.activities.length === 0 && (
                <div className="text-center py-20">
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No recent interactions logged.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
