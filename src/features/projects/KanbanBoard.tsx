import { Task } from '../../types';
import { MoreHorizontal, Plus, Clock, MessageCircle, Paperclip } from 'lucide-react';
import { motion } from 'motion/react';
import { cn, formatDate } from '../../lib/utils';

interface KanbanBoardProps {
  projectId: string;
  tasks: Task[];
}

const COLUMNS = [
  { id: 'Todo', label: 'To Do', color: 'bg-slate-500' },
  { id: 'In Progress', label: 'In Progress', color: 'bg-blue-500' },
  { id: 'Review', label: 'In Review', color: 'bg-amber-500' },
  { id: 'Completed', label: 'Completed', color: 'bg-green-500' },
];

export default function KanbanBoard({ projectId, tasks }: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {COLUMNS.map((col) => (
        <div key={col.id} className="flex flex-col h-full bg-slate-100/50 rounded-3xl p-4 border border-slate-200/50">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <div className={cn("w-1.5 h-1.5 rounded-full", col.color)}></div>
              <h3 className="font-bold text-slate-700 text-sm">{col.label}</h3>
              <span className="bg-white px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-500 border border-slate-200">
                {tasks.filter(t => t.status === col.id).length}
              </span>
            </div>
            <button className="p-1 hover:bg-white rounded-lg transition-all">
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="flex-1 space-y-4">
            {tasks
              .filter(t => t.status === col.id)
              .map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase",
                      task.priority === 'Urgent' ? 'bg-red-50 text-red-600' :
                      task.priority === 'High' ? 'bg-amber-50 text-amber-600' :
                      'bg-blue-50 text-blue-600'
                    )}>
                      {task.priority}
                    </span>
                    <div className="flex -space-x-2">
                       <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600">
                        {task.assigneeId?.charAt(0) || 'U'}
                      </div>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {task.title}
                  </h4>
                  
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {task.tags.map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 bg-slate-50 text-slate-400 text-[9px] font-medium rounded border border-slate-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between text-slate-400">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-medium">3</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-medium">1</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-medium">{formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}

            <button className="w-full py-3 border border-dashed border-slate-300 rounded-2xl text-slate-400 flex items-center justify-center gap-2 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-all font-semibold text-xs mt-2">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
