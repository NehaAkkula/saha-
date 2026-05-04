import { useEffect, useState } from 'react';
import axios from 'axios';
import { Project } from '../../types';
import { Link } from 'react-router-dom';
import { 
  MoreVertical, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  Flag, 
  Briefcase,
  TrendingUp,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatDate } from '../../lib/utils';
import { useAuth } from '../auth/AuthContext';
import CreateProjectModal from './CreateProjectModal';

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { isManager } = useAuth();

  useEffect(() => {
    setLoading(true);
    axios.get('/api/projects')
      .then(res => setProjects(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'Active': return 'bg-blue-100 text-blue-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'On Hold': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'Urgent': return 'text-red-500';
      case 'High': return 'text-amber-500';
      case 'Medium': return 'text-blue-500';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Projects</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Execute and track enterprise objectives</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-white border border-slate-200 rounded-2xl p-1 flex items-center gap-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={cn("p-2 rounded-xl transition-all", viewMode === 'grid' ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600")}
              >
                 <LayoutGrid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={cn("p-2 rounded-xl transition-all", viewMode === 'list' ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600")}
              >
                 <ListIcon className="w-5 h-5" />
              </button>
           </div>
           {isManager && (
             <button 
               onClick={() => setIsModalOpen(true)}
               className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 font-black text-sm"
             >
               <Plus className="w-5 h-5" />
               <span>Initiate Project</span>
             </button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-[40px] border border-slate-200"></div>
          ))
        ) : projects.length === 0 ? (
          <div className="col-span-full py-32 text-center bg-white rounded-[40px] border border-dashed border-slate-300">
            <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-300 mx-auto mb-6">
              <Briefcase className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">No active projects</h3>
            <p className="text-slate-400 font-medium mt-2 max-w-sm mx-auto">Get the squad together and start shipping high-impact work.</p>
          </div>
        ) : (
          projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white rounded-[40px] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all overflow-hidden flex flex-col relative"
            >
              <div className="p-8 pb-4">
                <div className="flex justify-between items-start mb-6">
                  <div className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                    getStatusColor(project.status).replace('bg-', 'bg-').replace('text-', 'text-')
                  )}>
                    {project.status}
                  </div>
                  <div className="flex items-center gap-1">
                     <span className={cn("text-[10px] font-black uppercase tracking-widest", getPriorityColor(project.priority))}>
                        {project.priority}
                     </span>
                     <Flag className={cn("w-3.5 h-3.5", getPriorityColor(project.priority))} />
                  </div>
                </div>
                
                <Link to={`/projects/${project.id}`}>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight leading-tight mb-2">
                    {project.name}
                  </h3>
                </Link>
                <p className="text-sm text-slate-400 font-medium line-clamp-2 leading-relaxed mb-6">
                  {project.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                   <div className="flex -space-x-3">
                      {[1, 2, 3].map(m => (
                        <div key={m} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-400">
                           {m}
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full bg-blue-50 border-2 border-white flex items-center justify-center text-[10px] font-black text-blue-600">
                         +5
                      </div>
                   </div>
                   <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                         {formatDate(project.endDate)}
                      </span>
                   </div>
                </div>
              </div>

              <div className="p-8 pt-4 bg-slate-50/50">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Completion</span>
                  <span className="text-sm font-black text-blue-600">{project.progress}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.3)]"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">+12% vs last week</span>
                   </div>
                   <Link 
                     to={`/projects/${project.id}`}
                     className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                   >
                     <MoreVertical className="w-4 h-4" />
                   </Link>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={(newProject) => setProjects([newProject, ...projects])}
      />
    </div>
  );
}
