import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Flame,
  Target,
  UserCheck,
  GitCompare,
  Activity,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

const navItems = [
  { name: 'Executive Overview', path: '/', icon: LayoutDashboard },
  { name: 'Batter Rankings', path: '/batters', icon: Flame },
  { name: 'Bowler Rankings', path: '/bowlers', icon: Target },
  { name: 'Player Explorer', path: '/players', icon: UserCheck },
  { name: 'Player Comparison', path: '/compare', icon: GitCompare },
  { name: 'Pressure Intelligence', path: '/pressure', icon: Activity },
  { name: 'Bowling Intelligence', path: '/bowling-intelligence', icon: ShieldCheck },
  { name: 'Methodology & Reliability', path: '/methodology', icon: BookOpen },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 border-r border-[#23314d] bg-[#0c1424] flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="py-6 px-3">
        <div className="px-3 mb-4">
          <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Navigation</p>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-600/20 to-pink-500/10 text-pink-400 border-l-4 border-pink-500 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#131b2e]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Cohort Stats Footer in Sidebar */}
      <div className="p-4 m-3 rounded-xl bg-[#131b2e]/80 border border-[#23314d]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-slate-300">Audited Cohort</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
        <div className="space-y-1 text-[11px] text-slate-400 font-mono">
          <div className="flex justify-between">
            <span>Matches:</span>
            <span className="text-white font-medium">853</span>
          </div>
          <div className="flex justify-between">
            <span>HP Balls (PI&ge;65):</span>
            <span className="text-white font-medium">45,825</span>
          </div>
          <div className="flex justify-between">
            <span>Eligible Batters:</span>
            <span className="text-blue-400 font-medium">180</span>
          </div>
          <div className="flex justify-between">
            <span>Eligible Bowlers:</span>
            <span className="text-pink-400 font-medium">222</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

