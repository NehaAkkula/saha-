import React from 'react';
import axios from 'axios';
import { 
  CheckCircle2, Clock, Ban, LogOut, ChevronDown, User, Settings,
  Zap, Briefcase, Moon
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { cn } from '../lib/utils';

const statuses = [
  { label: 'Active', value: 'Active', color: 'bg-green-500', icon: CheckCircle2 },
  { label: 'Busy', value: 'Busy', color: 'bg-rose-500', icon: Ban },
  { label: 'In Meeting', value: 'In Meeting', color: 'bg-blue-500', icon: Briefcase },
  { label: 'Working Remotely', value: 'Working Remotely', color: 'bg-purple-500', icon: Zap },
  { label: 'On Leave', value: 'On Leave', color: 'bg-amber-500', icon: Moon },
  { label: 'Offline', value: 'Offline', color: 'bg-slate-400', icon: Clock },
];

export default function UserStatusDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  const updateStatus = async (status: string) => {
    try {
      await axios.post('/api/users/status', { status });
      // In a real app, I'd update global user state or use SWR/Query
      window.location.reload(); 
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all group"
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
            {user.displayName?.charAt(0)}
          </div>
          <div className={cn(
            "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
            statuses.find(s => s.value === user.status)?.color || 'bg-slate-400'
          )} />
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-bold text-slate-800 leading-none">{user.displayName}</p>
          <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">{user.role}</p>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 w-64 bg-white rounded-[24px] border border-slate-100 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-5 border-b border-slate-50 bg-slate-50/50">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Set Availability</p>
              <div className="grid grid-cols-1 gap-1">
                {statuses.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => updateStatus(status.value)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold transition-all",
                      user.status === status.value 
                        ? "bg-white text-blue-600 shadow-sm border border-slate-100" 
                        : "text-slate-500 hover:bg-white hover:text-slate-800"
                    )}
                  >
                    <status.icon className={cn("w-4 h-4", user.status === status.value ? "text-blue-600" : "text-slate-400")} />
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                <User className="w-4 h-4" />
                Profile Settings
              </button>
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
