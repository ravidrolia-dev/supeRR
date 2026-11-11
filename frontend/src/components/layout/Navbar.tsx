import React, { useState } from 'react';
import { Search, ShieldAlert, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchPlayers } from '../../services/api';

export const Navbar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (val.trim().length >= 2) {
      try {
        const res = await searchPlayers(val);
        setResults(res);
        setIsOpen(true);
      } catch (err) {
        setResults([]);
      }
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (playerId: number) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/players?id=${playerId}`);
  };

  return (
    <header className="h-16 border-b border-[#23314d] bg-[#0d1527]/90 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-400 flex items-center justify-center font-black text-white text-lg shadow-md shadow-pink-500/20">
          RR
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-base tracking-wide">ClutchIQ</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/30">
              SupeRR Selector Season 2
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">Rajasthan Royals Pressure Analytics Engine</p>
        </div>
      </div>

      {/* Global Player Search */}
      <div className="relative w-80 max-w-full">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            placeholder="Search player by name or ID (e.g. David, Wood)..."
            className="w-full bg-[#131b2e] border border-[#23314d] focus:border-pink-500/70 text-xs text-slate-100 rounded-lg pl-9 pr-4 py-2 placeholder-slate-500 outline-none transition-all shadow-inner"
          />
        </div>

        {isOpen && results.length > 0 && (
          <div className="absolute top-11 left-0 right-0 bg-[#131b2e] border border-[#23314d] rounded-lg shadow-2xl overflow-hidden z-50 max-h-72 overflow-y-auto">
            {results.map((p) => (
              <button
                key={p.player_id}
                onClick={() => handleSelect(p.player_id)}
                className="w-full text-left px-3 py-2.5 hover:bg-[#1c2640] border-b border-[#23314d]/40 last:border-0 flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="text-xs font-semibold text-white flex items-center gap-2">
                    {p.player_name}
                    <span className="text-[10px] font-mono text-slate-400">#{p.player_id}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{p.batting_type || p.bowling_type || 'Player'}</span>
                    {p.teams && p.teams.length > 0 && (
                      <span className="text-pink-400 font-medium">({p.teams.join(', ')})</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {p.batting_rating !== null && (
                    <span className="text-[10px] block font-mono text-blue-400">
                      Bat: +{p.batting_rating.toFixed(2)}
                    </span>
                  )}
                  {p.bowling_rating !== null && (
                    <span className="text-[10px] block font-mono text-amber-400">
                      Bowl: +{p.bowling_rating.toFixed(2)}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-[#131b2e] px-3 py-1.5 rounded-lg border border-[#23314d]">
          <ShieldAlert className="w-3.5 h-3.5 text-pink-400" />
          <span className="text-xs font-medium text-slate-300">
            Validated High-Pressure Engine (<span className="text-pink-400 font-mono">PI &ge; 65</span>)
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
          <Award className="w-3.5 h-3.5" />
          <span>RR SupeRR Selector</span>
        </div>
      </div>
    </header>
  );
};

