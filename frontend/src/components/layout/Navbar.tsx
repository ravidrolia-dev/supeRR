import React, { useState } from 'react';
import { Search } from 'lucide-react';
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
    <header className="h-16 border-b border-[#e2e6ec] bg-white sticky top-0 z-40 px-6 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-[#d92779] flex items-center justify-center font-bold text-white text-sm tracking-wider">
          RR
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#17263c] text-sm tracking-tight">ClutchIQ</span>
            <span className="text-[11px] font-medium text-[#64748b]">| Pressure Performance Intelligence</span>
          </div>
          <p className="text-[11px] text-[#94a3b8]">SupeRR Selector Season 2 &bull; Independent analytics prototype</p>
        </div>
      </div>

      {/* Global Player Search */}
      <div className="relative w-80 max-w-full">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            placeholder="Search player or ID (e.g. David, Wood)..."
            className="w-full bg-[#f8fafc] border border-[#e2e6ec] focus:border-[#365e91] focus:bg-white text-xs text-[#17263c] rounded-md pl-9 pr-4 py-2 placeholder-[#94a3b8] outline-none transition-all"
          />
        </div>

        {isOpen && results.length > 0 && (
          <div className="absolute top-11 left-0 right-0 bg-white border border-[#e2e6ec] rounded-md shadow-lg overflow-hidden z-50 max-h-72 overflow-y-auto">
            {results.map((p) => (
              <button
                key={p.player_id}
                onClick={() => handleSelect(p.player_id)}
                className="w-full text-left px-3 py-2.5 hover:bg-[#f8fafc] border-b border-[#f1f5f9] last:border-0 flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="text-xs font-semibold text-[#17263c] flex items-center gap-2">
                    {p.player_name}
                    <span className="text-[11px] text-[#94a3b8]">#{p.player_id}</span>
                  </div>
                  <div className="text-[11px] text-[#64748b] mt-0.5">
                    {p.batting_type || p.bowling_type || 'Player'}
                    {p.teams && p.teams.length > 0 && ` • ${p.teams.join(', ')}`}
                  </div>
                </div>
                <div className="text-right">
                  {p.batting_rating !== null && (
                    <span className="text-[11px] block font-medium text-[#365e91]">
                      Bat: +{p.batting_rating.toFixed(2)}
                    </span>
                  )}
                  {p.bowling_rating !== null && (
                    <span className="text-[11px] block font-medium text-[#16845b]">
                      Bowl: +{p.bowling_rating.toFixed(2)}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
