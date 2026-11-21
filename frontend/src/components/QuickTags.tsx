import React from 'react';
import { Flame } from 'lucide-react';

interface QuickTagsProps {
  onSelect: (tag: string) => void;
  activeQuery: string;
}

const POPULAR_GAMES = [
  'Cyberpunk 2077',
  'The Witcher 3',
  'Elden Ring',
  'Red Dead Redemption 2',
  'Baldur\'s Gate 3',
  'Grand Theft Auto V',
];

export const QuickTags: React.FC<QuickTagsProps> = ({ onSelect, activeQuery }) => {
  return (
    <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
      <span className="text-slate-400 flex items-center gap-1 font-medium mr-1">
        <Flame className="w-3.5 h-3.5 text-amber-400" />
        Popular:
      </span>
      {POPULAR_GAMES.map((game) => {
        const isActive = activeQuery.toLowerCase() === game.toLowerCase();
        return (
          <button
            key={game}
            onClick={() => onSelect(game)}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              isActive
                ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-sm shadow-purple-500/20'
                : 'bg-gaming-card/60 border-gaming-border text-slate-300 hover:border-slate-600 hover:text-white'
            }`}
          >
            {game}
          </button>
        );
      })}
    </div>
  );
};
