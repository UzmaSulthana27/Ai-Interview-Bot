import React, { useState, useEffect } from 'react';
import LiveInsightPanel from './LiveInsightPanel';
import QuestionCard from './QuestionCard';
import apiService from '../../api/apiService';

const InterviewRoom = ({ sessionId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState({
    confidenceScore: 0,
    pacing: 'normal',
    clarity: 0
  });

  useEffect(() => {
    fetchNextQuestion();
  }, []);

  const fetchNextQuestion = async () => {
    try {
      const response = await apiService.getNextQuestion(sessionId);
      setCurrentQuestion(response.data);
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // Integrate with your existing recording logic
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Integrate with your existing submission logic
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d170d] pt-20 px-8 pb-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Interview Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Card */}
            <QuestionCard 
              question={currentQuestion}
              isRecording={isRecording}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
            />

            {/* Recording Controls */}
            <div className="bg-surface-container-lowest rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-headline text-xl font-bold">Your Response</h3>
                <div className="flex items-center gap-2">
                  {isRecording && (
                    <span className="flex items-center gap-2 text-error">
                      <span className="w-3 h-3 bg-error rounded-full animate-pulse"></span>
                      <span className="text-sm font-label">Recording...</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center gap-6 py-12">
                <button
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg ${
                    isRecording 
                      ? 'bg-error hover:bg-error/90' 
                      : 'signature-glow hover:opacity-90'
                  }`}
                >
                  <span className="material-symbols-outlined text-white text-4xl">
                    {isRecording ? 'stop' : 'mic'}
                  </span>
                </button>

                <p className="text-sm text-on-surface-variant">
                  {isRecording 
                    ? 'Click to stop and submit your answer' 
                    : 'Click to start recording your response'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Live Insights Panel */}
          <div className="lg:col-span-1">
            <LiveInsightPanel metrics={liveMetrics} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;