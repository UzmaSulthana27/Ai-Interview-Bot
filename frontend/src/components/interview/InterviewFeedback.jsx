import React from 'react';
import Card from '../common/Card';

const InterviewFeedback = ({ feedback }) => {
  // Feedback could be a string or an object with .text depending on backend change
  const feedbackText = typeof feedback === 'string' ? feedback : (feedback?.text || '');

  // Extract score if it exists (e.g. "Score: 8/10")
  let scoreMatch = feedbackText.match(/Score:\s*(\d+)\/10/i);
  let scoreNum = null;
  if (scoreMatch && scoreMatch[1]) {
    scoreNum = parseInt(scoreMatch[1], 10);
  }

  // Determine badge styling based on score
  let badgeColorClass = 'bg-slate-100 text-slate-700 dark:bg-[#0a0a0a] dark:text-[#166534]';
  if (scoreNum !== null) {
    if (scoreNum >= 7) {
      badgeColorClass = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    } else if (scoreNum >= 5) {
      badgeColorClass = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    } else {
      badgeColorClass = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    }
  }

  return (
    <div className="space-y-6">
      <Card padding="large" className="text-white dark:text-[#4ade80] relative">
        {scoreNum !== null && (
          <div className="absolute top-6 right-6">
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${badgeColorClass}`}>
              Score: {scoreNum}/10
            </span>
          </div>
        )}
        
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-primary" 
                style={{fontVariationSettings: "'FILL' 1"}}>
            auto_awesome
          </span>
          <h3 className="font-headline text-xl font-bold">AI Feedback</h3>
        </div>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap transition-colors duration-300">
            {feedbackText || "No feedback provided."}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default InterviewFeedback;