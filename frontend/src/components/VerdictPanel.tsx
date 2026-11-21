import React from 'react';
import { CheckCircle2, XCircle, Sparkles, ShoppingCart, ThumbsUp } from 'lucide-react';
import { AnalyzeResponse } from '../types';

interface VerdictPanelProps {
  verdict: AnalyzeResponse | null;
  isLoading: boolean;
}

export const VerdictPanel: React.FC<VerdictPanelProps> = ({ verdict, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-gaming-card border border-purple-500/30 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
            <Sparkles className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Analyzing Deal with AI...</h3>
            <p className="text-xs text-slate-400">Evaluating 2026 community sentiment, patch updates & pricing</p>
          </div>
        </div>
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-slate-800 rounded w-3/4" />
          <div className="h-4 bg-slate-800 rounded w-1/2" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="h-24 bg-slate-800/60 rounded-xl" />
            <div className="h-24 bg-slate-800/60 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!verdict) return null;

  const getVerdictBadge = (v: string) => {
    switch (v) {
      case 'Must Buy':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'Great Deal':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      case 'Wait for Sale':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#141b2d] to-gaming-card border border-purple-500/40 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gaming-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Purchase Verdict (2026 Edition)</span>
            {verdict.is_mock && (
              <span className="text-[10px] lowercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                offline knowledge base
              </span>
            )}
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {verdict.game_title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl border text-sm font-bold tracking-wide flex items-center gap-2 ${getVerdictBadge(verdict.verdict)}`}>
            <ThumbsUp className="w-4 h-4" />
            <span>{verdict.verdict}</span>
          </div>

          <div className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-white font-black text-lg">
            <span className="text-purple-300">{verdict.score.toFixed(1)}</span>
            <span className="text-xs text-slate-400 font-normal">/10</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6">
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed bg-[#0a0d14]/40 p-4 rounded-2xl border border-gaming-border/60">
          {verdict.summary}
        </p>
      </div>

      {/* Pros & Cons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Pros */}
        <div className="bg-[#0a0d14]/60 border border-emerald-500/20 rounded-2xl p-4">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <CheckCircle2 className="w-4 h-4" />
            Key Strengths
          </h4>
          <ul className="space-y-2">
            {verdict.pros.map((pro, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="bg-[#0a0d14]/60 border border-rose-500/20 rounded-2xl p-4">
          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <XCircle className="w-4 h-4" />
            Considerations / Drawbacks
          </h4>
          <ul className="space-y-2">
            {verdict.cons.map((con, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Value Assessment Banner */}
      <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
          <ShoppingCart className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs text-purple-300 font-semibold uppercase tracking-wider block">
            Value For Money Assessment
          </span>
          <p className="text-xs sm:text-sm text-slate-200 font-medium">
            {verdict.value_assessment}
          </p>
        </div>
      </div>
    </div>
  );
};
