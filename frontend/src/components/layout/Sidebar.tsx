import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Flame,
  Target,
  User,
  GitCompare,
  Activity,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

const navItems = [
  { name: 'Overview', path: '/', icon: LayoutDashboard },
  { name: 'Batter Rankings', path: '/batters', icon: Flame },
  { name: 'Bowler Rankings', path: '/bowlers', icon: Target },
  { name: 'Player Explorer', path: '/players', icon: User },
  { name: 'Player Comparison', path: '/compare', icon: GitCompare },
  { name: 'Pressure Intelligence', path: '/pressure', icon: Activity },
  { name: 'Bowling Intelligence', path: '/bowling-intelligence', icon: ShieldCheck },
  { name: 'Methodology & Reliability', path: '/methodology', icon: BookOpen },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-56 border-r border-[#e2e6ec] bg-[#f8fafc] flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="py-5 px-3">
        <div className="px-3 mb-3">
          <p className="text-[11px] font-semibold tracking-wider uppercase text-[#94a3b8]">Modules</p>
        </div>
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-white text-[#d92779] shadow-xs border-l-2 border-[#d92779] font-semibold'
                      : 'text-[#64748b] hover:text-[#17263c] hover:bg-[#f1f5f9]'
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

      <div className="p-4 m-3 rounded-md bg-white border border-[#e2e6ec] text-[11px] text-[#64748b]">
        <div className="font-semibold text-[#17263c] mb-1.5 flex items-center justify-between">
          <span>Audited Cohort</span>
          <span className="w-2 h-2 rounded-full bg-[#16845b]"></span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Matches:</span>
            <span className="font-medium text-[#17263c]">853</span>
          </div>
          <div className="flex justify-between">
            <span>HP Balls (&ge;65):</span>
            <span className="font-medium text-[#17263c]">45,825</span>
          </div>
          <div className="flex justify-between">
            <span>Qualified Batters:</span>
            <span className="font-medium text-[#365e91]">180</span>
          </div>
          <div className="flex justify-between">
            <span>Qualified Bowlers:</span>
            <span className="font-medium text-[#16845b]">222</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
