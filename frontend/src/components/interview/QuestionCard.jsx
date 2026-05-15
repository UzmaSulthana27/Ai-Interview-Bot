import React from 'react';

const QuestionCard = ({ question, isRecording, onStartRecording, onStopRecording }) => {
  if (!question) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl p-8 animate-pulse">
        <div className="h-6 bg-surface-container rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-surface-container rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest dark:bg-[#0a0a0a] rounded-2xl p-8 border-l-4 border-[#2d5a27] text-white dark:text-[#4ade80] transition-colors duration-300">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-[#e8f0e0] rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-primary" 
                style={{fontVariationSettings: "'FILL' 1"}}>
            chat
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-wider font-bold text-primary dark:text-[#c8e6c0]">
              Question {question.number}
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400 transition-colors duration-300">
              • {question.category}
            </span>
          </div>
          <h3 className="font-headline text-xl md:text-2xl font-bold text-on-surface">
            {question.text}
          </h3>
        </div>
      </div>

      {/* Context if available */}
      {question.context && (
        <div className="mt-4 p-4 bg-surface-container rounded-lg">
          <p className="text-sm text-on-surface-variant">
            <span className="font-bold">Context:</span> {question.context}
          </p>
        </div>
      )}

      {/* Time indicator */}
      {question.suggestedTime && (
        <div className="mt-4 flex items-center gap-2 text-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-sm">schedule</span>
          <span>Suggested time: {question.suggestedTime} minutes</span>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;