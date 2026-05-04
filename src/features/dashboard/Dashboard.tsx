import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Plus, 
  Search, 
  Filter, 
  Briefcase, 
  CheckSquare, 
  Users, 
  Clock, 
  TrendingUp,
  Award,
  Zap,
  ChevronRight,
  ArrowUpRight,
  Target,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useAuth } from '../auth/AuthContext';
import CreateProjectModal from '../projects/CreateProjectModal';
import { formatDistanceToNow } from 'date-fns';

interface Stats {
  totalProjects: number;
  activeTasks: number;
  completedTasks: number;
  overdueTasks: number;
  productivityScore: number;
  weeklyProgress: number[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const { user, isManager } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, actRes] = await Promise.all([
          axios.get('/api/analytics/summary'),
          axios.get('/api/activities')
        ]);
        setStats(statsRes.data);
        setActivities(actRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Hydrating Dashboard...</p>
      </div>
    </div>
  );

  const productivityData = stats?.weeklyProgress.map((val, i) => ({
    name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    value: val
  })) || [];

  const taskDistribution = [
    { name: 'Completed', value: stats?.completedTasks || 0, color: '#10B981' },
    { name: 'Active', value: stats?.activeTasks || 0, color: '#2563EB' },
    { name: 'Overdue', value: stats?.overdueTasks || 0, color: '#F43F5E' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">SAHA v2.0</span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400">Systems Active</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Hey {user?.displayName?.split(' ')[0]}, <br className="hidden sm:block" /> 
            <span className="text-slate-400">here's your squad summary.</span>
          </h2>
        </div>
        {isManager && (
          <div className="flex gap-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 font-bold text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Enterprise Project</span>
            </button>
          </div>
        )}
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Projects', value: stats?.totalProjects, icon: Briefcase, color: 'blue', growth: '+12%' },
          { label: 'Pending Tasks', value: stats?.activeTasks, icon: Clock, color: 'amber', growth: '+3%' },
          { label: 'Total Assets', value: stats?.completedTasks, icon: Award, color: 'emerald', growth: '+24%' },
          { label: 'Productivity', value: `${stats?.productivityScore}%`, icon: Zap, color: 'indigo', growth: '+5%' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                item.color === 'blue' ? "bg-blue-50 text-blue-600" :
                item.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                item.color === 'indigo' ? "bg-indigo-50 text-indigo-600" : "bg-amber-50 text-amber-600"
              )}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-green-500 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {item.growth}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
            <h3 className="text-3xl font-black mt-1 text-slate-900">{item.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8">
            <TrendingUp className="w-8 h-8 text-blue-100 group-hover:text-blue-500 transition-colors" />
          </div>
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900">Sprint Productivity</h3>
            <p className="text-sm text-slate-400 font-medium">Daily output efficiency over the last week.</p>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productivityData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    padding: '12px 16px'
                  }} 
                  itemStyle={{ fontWeight: 800, color: '#2563EB' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2563EB" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorVal)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-900">Task Allocation</h3>
            <p className="text-sm text-slate-400 font-medium">Current workload status distribution.</p>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskDistribution}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {taskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 gap-3 mt-4">
              {taskDistribution.map(item => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-bold text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[40px] text-white flex justify-between items-center relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl transition-transform group-hover:scale-125 duration-700" />
            <div className="relative z-10">
               <h4 className="text-white/60 text-xs font-black uppercase tracking-widest mb-2">Upcoming Milestone</h4>
               <h3 className="text-2xl font-bold max-w-[200px]">SAHA Portal v3 Beta Launch</h3>
               <div className="flex items-center gap-2 mt-4">
                  <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold">12</div>
                  <div className="text-xs font-bold">Days Remaining</div>
               </div>
            </div>
            <button className="relative z-10 w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all">
               <ChevronRight className="w-6 h-6" />
            </button>
         </div>

         <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex items-center gap-8">
            <div className="w-20 h-20 rounded-3xl bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100 shrink-0">
               <Sparkles className="w-10 h-10 fill-amber-500" />
            </div>
            <div>
               <h4 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Top Performer</h4>
               <h3 className="text-xl font-bold">Jane Cooper</h3>
               <p className="text-sm text-slate-500 mt-1">Completed 12 sprints this month with 92% efficiency.</p>
               <button className="mt-4 text-blue-600 text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                  View Full Metrics <ChevronRight className="w-3 h-3" />
               </button>
            </div>
         </div>
      </div>

      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {/* refresh stats logic if needed */}} 
      />
    </div>
  );
}
