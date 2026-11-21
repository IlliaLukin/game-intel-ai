import React from 'react';
import { Sparkles, ExternalLink, Tag } from 'lucide-react';
import { GameDealItem } from '../types';

interface DealCardProps {
  deal: GameDealItem;
  onAnalyze: (deal: GameDealItem) => void;
  isAnalyzing: boolean;
  isSelected: boolean;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, onAnalyze, isAnalyzing, isSelected }) => {
  const hasDiscount = deal.savings_percent > 0;

  return (
    <div
      className={`group relative bg-gaming-card rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 ${
        isSelected
          ? 'border-purple-500 ring-2 ring-purple-500/30 shadow-xl shadow-purple-500/10'
          : 'border-gaming-border hover:border-slate-600'
      }`}
    >
      <div>
        {/* Banner Image */}
        <div className="relative w-full h-40 bg-slate-900 overflow-hidden">
          {deal.thumb_url ? (
            <img
              src={deal.thumb_url}
              alt={deal.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-600">
              No Preview
            </div>
          )}

          {hasDiscount && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-rose-600/90 backdrop-blur-md text-white font-bold text-xs tracking-wider shadow-lg flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span>-{deal.savings_percent.toFixed(1)}%</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-white text-base line-clamp-1 group-hover:text-purple-300 transition-colors">
            {deal.title}
          </h3>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-bold text-emerald-400">
              ${deal.sale_price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through">
                ${deal.normal_price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-0 flex gap-2">
        <button
          type="button"
          onClick={() => onAnalyze(deal)}
          disabled={isAnalyzing}
          className="flex-1 py-2.5 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 hover:border-purple-500/60 text-purple-300 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>AI Verdict</span>
        </button>

        {deal.deal_id && (
          <a
            href={`https://www.cheapshark.com/redirect?dealID=${deal.deal_id}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View deal on store"
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};
