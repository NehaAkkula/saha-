import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Project, Task } from '../../types';
import { 
  ArrowLeft, 
  Calendar, 
  Flag, 
  Users, 
  MessageSquare, 
  Paperclip, 
  Settings,
  Plus
} from 'lucide-react';
import KanbanBoard from './KanbanBoard';
import WorkflowViewer from './WorkflowViewer';
import { motion, AnimatePresence } from 'motion/react';
import { formatDate, cn } from '../../lib/utils';
import { useAuth } from '../auth/AuthContext';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Tasks');
  const { isManager } = useAuth();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const fetchData = async () => {
      try {
        const [projRes, tasksRes] = await Promise.all([
          axios.get(`/api/projects/${id}`),
          axios.get(`/api/projects/${id}/tasks`)
        ]);
        setProject(projRes.data);
        setTasks(tasksRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div>Loading project details...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link to="/projects" className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Link>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Link to="/projects" className="hover:text-blue-600">Projects</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">{project.name}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-extrabold text-slate-900">{project.name}</h2>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                {project.status}
              </span>
            </div>
            <p className="text-slate-500 max-w-2xl leading-relaxed">{project.description}</p>
            
            <div className="flex flex-wrap gap-6 pt-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div className="text-xs">
                  <p className="text-slate-400 font-medium">Deadline</p>
                  <p className="font-bold text-slate-700">{formatDate(project.endDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-slate-400" />
                <div className="text-xs">
                  <p className="text-slate-400 font-medium">Priority</p>
                  <p className="font-bold text-slate-700">{project.priority}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                <div className="text-xs">
                  <p className="text-slate-400 font-medium">Team</p>
                  <p className="font-bold text-slate-700">Engineering</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-semibold text-sm">
              <Settings className="w-4 h-4" />
              <span>Project Settings</span>
            </button>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all font-semibold text-sm shadow-lg shadow-blue-600/20">
              <Plus className="w-4 h-4" />
              <span>Invite Team</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs / Content */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 px-4">
          <div className="flex gap-8">
            {['Tasks', 'Workflow', 'Activity', 'Files'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-4 text-sm font-bold transition-all relative",
                  activeTab === tab ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {tab}
                {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
              </button>
            ))}
          </div>
          <div className="pb-4 flex items-center gap-4 text-slate-400 px-4">
            <MessageSquare className="w-4 h-4 hover:text-blue-600 transition-colors cursor-pointer" />
            <Paperclip className="w-4 h-4 hover:text-blue-600 transition-colors cursor-pointer" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'Tasks' && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <KanbanBoard projectId={project.id} tasks={tasks} />
            </motion.div>
          )}
          {activeTab === 'Workflow' && (
            <motion.div
              key="workflow"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <WorkflowViewer projectId={project.id} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
