import React from 'react';

const LiveInsightPanel = ({ metrics }) => {
  return (
    <div className="sticky top-24">
      <div className="glass-panel p-6 rounded-xl border border-white/20 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full signature-glow flex items-center justify-center">
            <span className="material-symbols-outlined text-white" 
                  style={{fontVariationSettings: "'FILL' 1"}}>
              analytics
            </span>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-[#2d5a27]">
              Live Insight
            </p>
            <p className="font-headline font-bold text-on-surface">
              Performance Metrics
            </p>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-label text-on-surface">
              Confidence Score
            </span>
            <span className="text-sm font-bold text-[#2d5a27]">
              {metrics.confidenceScore}%
            </span>
          </div>
          <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
            <div 
              className="h-full signature-glow transition-all duration-500" 
              style={{width: `${metrics.confidenceScore}%`}}
            ></div>
          </div>
        </div>

        {/* Pacing */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-label text-on-surface">
              Pacing
            </span>
            <span className="text-sm font-bold text-secondary">
              {metrics.pacing}
            </span>
          </div>
          <div className="flex gap-1">
            {['slow', 'normal', 'fast'].map((pace) => (
              <div 
                key={pace}
                className={`h-2 flex-1 rounded-full ${
                  metrics.pacing === pace 
                    ? 'bg-secondary' 
                    : 'bg-surface-container-high'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Clarity */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-label text-on-surface">
              Clarity
            </span>
            <span className="text-sm font-bold text-tertiary">
              {metrics.clarity}%
            </span>
          </div>
          <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
            <div 
              className="h-full bg-tertiary transition-all duration-500" 
              style={{width: `${metrics.clarity}%`}}
            ></div>
          </div>
        </div>

        {/* AI Feedback */}
        <div className="pt-4 border-t border-outline-variant/20">
          <p className="text-xs text-on-surface-variant leading-relaxed">
            "Your pacing is excellent. Try to elaborate more on the technical challenges 
            you faced in your previous project."
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveInsightPanel;