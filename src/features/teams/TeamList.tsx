import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Users, Search, Filter, Shield, Clock, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useAuth } from '../auth/AuthContext';

interface Team {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  leadId: string;
  leadName: string;
  visibility: string;
  createdAt: string;
}

export default function TeamList() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const { isManager } = useAuth();

  useEffect(() => {
    setLoading(true);
    axios.get('/api/teams')
      .then(res => setTeams(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Teams</h2>
          <p className="text-slate-500">Collaborate with your colleagues across different squads.</p>
        </div>
        {/* Create Team option removed as requested */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-3xl border border-slate-200"></div>
          ))
        ) : teams.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
            <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No teams found</h3>
            <p className="text-slate-500 mt-1">Contact your administrator to be assigned to a squad.</p>
          </div>
        ) : (
          teams.map((team, i) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Users className="w-6 h-6" />
                </div>
                <span className={cn(
                  "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  team.visibility === 'Public' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                )}>
                  {team.visibility}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">{team.name}</h3>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{team.description}</p>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 border border-white">
                    {team.leadName?.charAt(0)}
                  </div>
                  <div className="text-xs">
                    <p className="text-slate-400 font-medium whitespace-nowrap">Team Lead</p>
                    <p className="font-bold text-slate-700 whitespace-nowrap">{team.leadName}</p>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600">
                      {String.fromCharCode(64 + j)}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                    +5
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-50 flex gap-2">
                <button className="flex-1 py-2 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-all">
                  View Squad
                </button>
                <button className="px-3 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
