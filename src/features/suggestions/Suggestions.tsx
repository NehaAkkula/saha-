import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Lightbulb, Code, Brain, Globe, Shield, Smartphone, 
  Database, Layers, Clock, TrendingUp, Sparkles, Filter
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface Suggestion {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  stack: string;
  duration: string;
  description: string;
}

export default function Suggestions() {
  const [data, setData] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    axios.get('/api/suggestions')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(data.map(i => i.category))];
  const filtered = filter === 'All' ? data : data.filter(i => i.category === filter);

  if (loading) return <div className="p-8">Generating smart recommendations...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold tracking-tight">Smart Suggestions</h2>
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <p className="text-slate-500">AI-powered project ideas based on market trends and your metrics.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
              filter === cat 
                ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20" 
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group relative bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 bg-blue-50 opacity-0 group-hover:opacity-100 rounded-full transition-all duration-500 group-hover:scale-150" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center",
                  item.category === 'Web Development' ? "bg-blue-50 text-blue-600" :
                  item.category === 'AI/ML' ? "bg-purple-50 text-purple-600" :
                  item.category === 'IoT' ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                )}>
                  {item.category === 'Web Development' ? <Globe className="w-6 h-6" /> :
                   item.category === 'AI/ML' ? <Brain className="w-6 h-6" /> :
                   item.category === 'IoT' ? <Layers className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
                </div>
                <div className="flex flex-col items-end gap-1">
                   <span className={cn(
                     "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                     item.difficulty === 'High' ? "bg-rose-100 text-rose-700" :
                     item.difficulty === 'Medium' ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                   )}>
                     {item.difficulty}
                   </span>
                   <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                     <Clock className="w-3 h-3" />
                     {item.duration}
                   </div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
              <p className="text-sm text-slate-500 mt-2 line-clamp-2">{item.description}</p>

              <div className="mt-6 flex flex-wrap gap-1">
                {item.stack.split(', ').map(tech => (
                  <span key={tech} className="px-2 py-1 bg-slate-50 rounded-lg text-[10px] font-medium text-slate-500 border border-slate-100">
                    {tech}
                  </span>
                ))}
              </div>

              <button className="w-full mt-6 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all">
                Adopt Idea
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
