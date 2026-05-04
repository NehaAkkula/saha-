import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Trophy, TrendingUp, CheckCircle, Clock, AlertCircle, 
  Users, Briefcase, Zap, Star
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface Assessment {
  id: string;
  userId: string;
  displayName: string;
  jobTitle: string;
  teamName: string;
  score: number;
  tasksCompleted: number;
  efficiency: number;
  reportMonth: string;
}

export default function Assessments() {
  const [data, setData] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/assessments')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Analyzing performance data...</div>;

  const topPerformers = [...data].sort((a, b) => b.score - a.score).slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Team Assessment</h2>
          <p className="text-slate-500">Performance tracking and efficiency metrics.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">
            Export Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20">
            New Audit
          </button>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy className="w-24 h-24 text-blue-600" />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Avg Efficiency</p>
          <div className="flex items-end gap-2 mt-2">
            <h3 className="text-4xl font-extrabold text-slate-900">92.4%</h3>
            <span className="text-green-600 text-sm font-bold mb-1">+4.2%</span>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-blue-600 rounded-full w-[92%]" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle className="w-24 h-24 text-green-600" />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Completion Rate</p>
          <div className="flex items-end gap-2 mt-2">
            <h3 className="text-4xl font-extrabold text-slate-900">88.5%</h3>
            <span className="text-green-600 text-sm font-bold mb-1">+6.1%</span>
          </div>
          <div className="mt-6 h-12 flex items-center justify-between gap-1">
            {[40, 60, 45, 70, 85, 65, 88].map((v, i) => (
              <div key={i} className="flex-1 bg-green-100 rounded-sm hover:bg-green-500 transition-colors" style={{ height: `${v}%` }} />
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-24 h-24 text-amber-600" />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Collaboration</p>
          <div className="flex items-end gap-2 mt-2">
            <h3 className="text-4xl font-extrabold text-slate-900">7.8</h3>
            <span className="text-slate-400 text-sm font-bold mb-1">/ 10</span>
          </div>
          <div className="mt-6 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className={cn("w-5 h-5", i <= 4 ? "text-amber-400 fill-amber-400" : "text-slate-200")} />
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Table */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-lg">Detailed Assessment</h3>
            <select className="text-xs font-bold border-none bg-slate-50 rounded-lg px-3 py-1 outline-none">
              <option>April 2026</option>
              <option>March 2026</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Member</th>
                  <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Efficiency</th>
                  <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Score</th>
                  <th className="px-8 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {item.displayName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{item.displayName}</p>
                          <p className="text-xs text-slate-400 font-medium">{item.jobTitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                         <div className="flex-1 w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-600 rounded-full" style={{ width: `${item.efficiency}%` }} />
                         </div>
                         <span className="text-xs font-bold">{item.efficiency}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-lg text-xs font-bold",
                        item.score >= 80 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      )}>
                        {item.score}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <TrendingUp className="w-4 h-4 text-green-500 ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
           <h3 className="font-bold text-lg mb-8">Productivity Insights</h3>
           <div className="h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data} layout="vertical">
                 <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                 <XAxis type="number" axisLine={false} tickLine={false} hide />
                 <YAxis dataKey="displayName" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} width={100} />
                 <Tooltip 
                   cursor={{fill: '#f8fafc'}}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                 />
                 <Bar dataKey="tasksCompleted" name="Tasks Completed" fill="#2563EB" radius={[0, 4, 4, 0]} barSize={20} />
                 <Bar dataKey="score" name="Performance Score" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={20} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
}
