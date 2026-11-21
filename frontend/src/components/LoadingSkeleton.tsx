import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div
          key={i}
          className="bg-gaming-card border border-gaming-border rounded-2xl overflow-hidden p-4 flex flex-col gap-3 animate-pulse"
        >
          <div className="w-full h-36 bg-slate-800/60 rounded-xl" />
          <div className="w-3/4 h-5 bg-slate-800/80 rounded mt-1" />
          <div className="flex justify-between items-center mt-2">
            <div className="w-20 h-6 bg-slate-800/60 rounded" />
            <div className="w-24 h-8 bg-slate-800/80 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};
