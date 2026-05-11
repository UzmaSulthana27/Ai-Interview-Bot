import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TopNavBar from '../components/layout/TopNavBar';
import Footer from '../components/layout/Footer';
import apiService from '../api/apiService';
import InterviewFeedback from '../components/interview/InterviewFeedback';

const Spinner = () => (
  <motion.div 
    className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full inline-block"
    animate={{ rotate: 360 }}
    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
  />
);

const parseMCQ = (rawText) => {
  const lines = rawText.split('\n')
    .map(l => l.trim())
    .filter(Boolean)

  let question = ''
  let options = []
  let correctAnswer = ''
  let explanation = ''

  lines.forEach(line => {
    if (line.startsWith('QUESTION:'))
      question = line.replace('QUESTION:', '').trim()
    else if (line.startsWith('A)'))
      options[0] = { key: 'A', text: line.replace('A)','').trim() }
    else if (line.startsWith('B)'))
      options[1] = { key: 'B', text: line.replace('B)','').trim() }
    else if (line.startsWith('C)'))
      options[2] = { key: 'C', text: line.replace('C)','').trim() }
    else if (line.startsWith('D)'))
      options[3] = { key: 'D', text: line.replace('D)','').trim() }
    else if (line.startsWith('ANSWER:'))
      correctAnswer = line.replace('ANSWER:','').trim()
    else if (line.startsWith('EXPLANATION:'))
      explanation = line.replace('EXPLANATION:','').trim()
  })

  return { question, options, correctAnswer, explanation }
}

const getRoleIcon = (role) => {
  const r = (role || '').toLowerCase();
  if (r.includes('java')) return '☕';
  if (r.includes('react')) return '⚛️';
  if (r.includes('python')) return '🐍';
  if (r.includes('mobile') || r.includes('ios') || r.includes('android')) return '📱';
  if (r.includes('design') || r.includes('ui') || r.includes('ux')) return '✨';
  if (r.includes('qa') || r.includes('test')) return '🛡️';
  if (r.includes('data scientist') || r.includes('ml') || r.includes('machine')) return '🤖';
  if (r.includes('data analyst')) return '📊';
  if (r.includes('cloud') || r.includes('aws') || r.includes('azure')) return '☁️';
  if (r.includes('security')) return '🔐';
  if (r.includes('product')) return '📋';
  if (r.includes('node')) return '🟢';
  if (r.includes('full')) return '🚀';
  return '💻';
};

const roles = [
  { id: 1,  name: 'Java Developer',       icon: '☕', tag: 'backend'  },
  { id: 2,  name: 'React Developer',      icon: '⚛️', tag: 'frontend' },
  { id: 3,  name: 'Python Developer',     icon: '🐍', tag: 'backend'  },
  { id: 4,  name: 'Full Stack Developer', icon: '🔧', tag: 'fullstack'},
  { id: 5,  name: 'Frontend Developer',   icon: '🎨', tag: 'frontend' },
  { id: 6,  name: 'Backend Developer',    icon: '⚙️', tag: 'backend'  },
  { id: 7,  name: 'Data Analyst',         icon: '📊', tag: 'data'     },
  { id: 8,  name: 'DevOps Engineer',      icon: '🚀', tag: 'devops'   },
  { id: 9,  name: 'Mobile Developer',     icon: '📱', tag: 'mobile'   },
  { id: 10, name: 'UI/UX Designer',       icon: '✨', tag: 'design'   },
  { id: 11, name: 'QA Engineer',          icon: '🛡️', tag: 'testing'  },
  { id: 12, name: 'Data Scientist',       icon: '🧪', tag: 'data'     },
  { id: 13, name: 'Cloud Architect',      icon: '☁️', tag: 'cloud'    },
  { id: 14, name: 'Security Engineer',    icon: '🔐', tag: 'security' },
  { id: 15, name: 'Product Manager',      icon: '📋', tag: 'product'  },
  { id: 16, name: 'ML Engineer',          icon: '🤖', tag: 'ai'       },
];

const InterviewPage = () => {
  const navigate = useNavigate();
  
  const [sessionStarted, setSessionStarted] = useState(false);
  const [loading, setLoading]               = useState(false);
  const [question, setQuestion]             = useState('');
  const [answer, setAnswer]                 = useState('');
  const [feedback, setFeedback]             = useState(null);
  const [sessionId, setSessionId]           = useState(null);
  const [qCount, setQCount]                 = useState(1);
  
  const [typedQuestion, setTypedQuestion] = useState('');
  const [loadingMsg, setLoadingMsg] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Configuration Steps: 1: Role, 2: Config, 3: Start Card
  const [configStep, setConfigStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const [difficulty, setDifficulty] = useState('Medium');
  const [format, setFormat] = useState('Q/A');
  const [useResume, setUseResume] = useState(false);

  // For MCQ format only:
  const [mcqData, setMcqData]               = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted]           = useState(false);
  const [isCorrect, setIsCorrect]           = useState(null);
  const [correctCount, setCorrectCount]     = useState(0);

  const typingTimer = useRef(null);
  const userId     = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    return () => clearInterval(typingTimer.current);
  }, [userId, navigate]);

  const handleBeginInterview = async () => {
    setLoading(true);
    setLoadingMsg('⏳ connecting to AI...');
    try {
      const res = await apiService.startInterviewSession(selectedRole.name, userId, difficulty, format, useResume);
      setSessionId(res.data.sessionId);
      if (res.data.question) {
        setQCount(1);
        handleNewQuestion(res.data.question);
      }
      setSessionStarted(true);
      setLoadingMsg('');
    } catch (e) {
      console.error(e);
      setLoadingMsg('');
      setErrorMsg('Failed to connect to AI.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewQuestion = (qText) => {
    setQuestion(qText);
    
    // Reset states
    setAnswer('');
    setFeedback(null);
    setSelectedOption(null);
    setSubmitted(false);
    setIsCorrect(null);
    
    if (format === 'MCQ') {
      const parsed = parseMCQ(qText);
      setMcqData(parsed);
      typeQuestion(parsed.question);
    } else {
      typeQuestion(qText);
    }
  };

  const typeQuestion = (text) => {
    setTypedQuestion('');
    clearInterval(typingTimer.current);
    let i = 0;
    typingTimer.current = setInterval(() => {
      setTypedQuestion(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(typingTimer.current);
    }, 20);
  };

  const handleSubmitQA = async () => {
    const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < 3) {
      setErrorMsg('Please provide a more detailed answer (minimum 3 words).');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);
    setLoadingMsg('🤖 AI is analyzing your answer...');
    
    try {
      const res = await apiService.submitAnswer({
        sessionId,
        question,
        answer,
        jobRole: selectedRole.name,
        difficulty,
        format: 'QA',
        useResume
      });
      setFeedback(res.data.feedback);
      
      if (res.data.nextQuestion && qCount < 10) {
        setTimeout(() => {
          setQCount(prev => prev + 1);
          handleNewQuestion(res.data.nextQuestion);
        }, 4000);
      } else {
        setTimeout(() => {
          setIsFinished(true);
        }, 4000);
      }
    } catch (e) {
      console.error(e);
      setErrorMsg('Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(false);
      setLoadingMsg('');
    }
  };

  const handleSubmitMCQ = async () => {
    if (!selectedOption) return;
    
    setErrorMsg('');
    setSubmitting(true);
    setSubmitted(true);
    
    const correct = selectedOption === mcqData.correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setCorrectCount(prev => prev + 1);
    }
    
    try {
      const payload = {
        sessionId,
        question: mcqData.question,
        answer: selectedOption,
        correctAnswer: mcqData.correctAnswer,
        format: 'MCQ',
        jobRole: selectedRole.name,
        difficulty,
        useResume
      };
      
      const res = await apiService.submitAnswer(payload);
      setFeedback(res.data.feedback);
      
      if (res.data.nextQuestion && qCount < 10) {
        setMcqData(prev => ({ ...prev, nextQuestion: res.data.nextQuestion }));
      } else {
        setMcqData(prev => ({ ...prev, nextQuestion: null }));
      }
    } catch (e) {
      console.error(e);
      setErrorMsg('Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextMCQQuestion = () => {
    if (mcqData.nextQuestion) {
      setQCount(prev => prev + 1);
      handleNewQuestion(mcqData.nextQuestion);
    } else {
      setIsFinished(true);
    }
  };

  const handleEndSession = () => {
    if (window.confirm('Are you sure you want to end this interview?')) {
      navigate('/history');
    }
  };

  // STEP-BY-STEP CONFIGURATION UI
  if (!sessionStarted) {
    return (
      <div className="bg-slate-50 dark:bg-[#020617] min-h-screen transition-colors duration-300 pt-24 pb-16">
        <TopNavBar />
        <div className="max-w-4xl mx-auto px-4">
          <AnimatePresence mode="wait">
            {configStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h1 className="font-headline text-3xl font-extrabold mb-8 text-slate-900 dark:text-slate-100 text-center">
                  Select Your Role
                </h1>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
                  {roles.map((role) => (
                    <motion.div
                      key={role.id}
                      onClick={() => { setSelectedRole(role); setConfigStep(2); }}
                      className="border border-[#bfdbfe] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-6 cursor-pointer flex flex-col items-center text-center transition-all hover:border-primary dark:hover:border-blue-500 hover:shadow-lg"
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-3xl block mb-2">{role.icon}</span>
                      <span className="font-headline font-bold text-slate-900 dark:text-slate-100 text-sm">{role.name}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {configStep === 2 && (
              <motion.div 
                key="step2"
                className="max-w-2xl mx-auto"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setConfigStep(1)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">arrow_back</span>
                  </button>
                  <h1 className="font-headline text-3xl font-extrabold text-slate-900 dark:text-slate-100">Configure Interview</h1>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-8">
                  <div>
                    <h3 className="font-headline font-bold text-slate-900 dark:text-slate-100 mb-4">Difficulty Level</h3>
                    <div className="flex gap-3">
                      {['Easy', 'Medium', 'Hard'].map(level => (
                        <button
                          key={level}
                          onClick={() => setDifficulty(level)}
                          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                            difficulty === level
                              ? 'bg-primary dark:bg-blue-600 text-white shadow-lg'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-headline font-bold text-slate-900 dark:text-slate-100 mb-4">Interview Format</h3>
                    <div className="flex gap-3">
                      {[
                        { id: 'QA', name: 'Q&A Text', icon: 'chat' },
                        { id: 'MCQ', name: 'Multiple Choice', icon: 'list_alt' }
                      ].map(f => (
                        <button
                          key={f.id}
                          onClick={() => setFormat(f.id)}
                          className={`flex-1 py-4 px-6 rounded-xl font-bold text-sm transition-all flex flex-col items-center gap-2 ${
                            format === f.id
                              ? 'bg-primary dark:bg-blue-600 text-white shadow-lg border-2 border-primary'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-transparent'
                          }`}
                        >
                          <span className="material-symbols-outlined">{f.icon}</span>
                          {f.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Resume Toggle - Moved above button for better visibility */}
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-blue-400">
                        <span className="material-symbols-outlined">psychology</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">Resume Personalization</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Tailor questions to your experience</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setUseResume(!useResume)}
                      className={`relative w-12 h-6 rounded-full transition-colors flex items-center ${useResume ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                    >
                      <motion.div 
                        className="absolute left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                        animate={{ x: useResume ? 24 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>

                  <motion.button
                    onClick={() => setConfigStep(3)}
                    className="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue to Start Card →
                  </motion.button>
                </div>
              </motion.div>
            )}

            {configStep === 3 && (
              <motion.div 
                key="step3"
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-[560px] w-full mx-auto shadow-xl text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="text-5xl mb-4">{selectedRole?.icon}</div>
                <h1 className="text-3xl font-headline font-bold text-slate-900 dark:text-slate-100 mb-6">
                  {selectedRole?.name}
                </h1>
                
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  <span className="px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-bold border border-indigo-200 dark:border-indigo-800/50">
                    Role: {selectedRole?.name}
                  </span>
                  <span className="px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-bold border border-orange-200 dark:border-orange-800/50">
                    {difficulty}
                  </span>
                  <span className="px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-bold border border-blue-200 dark:border-blue-800/50">
                    {format === 'MCQ' ? 'Multiple Choice' : 'Q&A Text'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6">
                  Ready to begin your interview?
                </h3>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 text-left mb-8 border border-slate-100 dark:border-slate-700/50">
                  <ul className="font-mono text-sm text-slate-700 dark:text-slate-300 space-y-2">
                    <li>✓ Read each question carefully</li>
                    <li>✓ Take your time to answer</li>
                    <li>✓ Questions: 10</li>
                  </ul>
                </div>

                <div className="flex flex-col gap-3">
                  <motion.button
                    onClick={handleBeginInterview}
                    disabled={loading}
                    className="w-full bg-primary dark:bg-blue-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg flex justify-center items-center gap-2"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? <Spinner /> : 'Begin Interview Session'}
                  </motion.button>
                  <button onClick={() => setConfigStep(2)} className="text-slate-500 hover:text-primary text-sm font-bold">
                    ← Back to Settings
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="bg-white dark:bg-[#020617] min-h-screen pt-24 px-4 pb-16 flex flex-col items-center justify-center">
        <TopNavBar />
        <motion.h2 
          className="font-headline text-3xl font-bold mb-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          Session Complete!
        </motion.h2>
        <motion.div 
          className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl mb-8 text-center min-w-[300px]"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-slate-600 dark:text-slate-400 mb-2">Total Questions: {Math.min(qCount, 10)}</p>
          {format === 'MCQ' && (
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-4">
              Score: {correctCount}/{Math.min(qCount, 10)}
            </p>
          )}
        </motion.div>
        
        <div className="flex gap-4">
          <motion.button 
            onClick={() => navigate('/home')}
            className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-6 py-3 rounded-xl font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Home
          </motion.button>
          <motion.button 
            onClick={() => navigate('/history')}
            className="bg-[#1e40af] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            View Full Report →
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#020617] min-h-screen transition-colors duration-300">
      <TopNavBar />
      
      <main className="pt-24 px-4 md:px-8 pb-24 md:pb-16 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{getRoleIcon(selectedRole?.name)}</span>
              <h1 className="font-headline text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {selectedRole?.name ?? 'Interview'}
              </h1>
            </div>
            
            <div className="flex gap-2 mt-2 mb-3">
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-full border border-slate-200 dark:border-slate-700">
                {difficulty}
              </span>
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full border border-indigo-100 dark:border-indigo-800/50">
                {format}
              </span>
            </div>

            <p className="text-sm text-slate-500 font-mono flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {qCount > 0 ? `QUESTION ${qCount} OF 10` : 'INITIALIZING...'}
            </p>
          </motion.div>
          <motion.button 
            onClick={handleEndSession}
            className="mt-4 md:mt-0 px-4 py-2 text-sm text-red-600 border border-red-200 dark:border-red-900/30 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            End Interview
          </motion.button>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full mb-4 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${(qCount / 10) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400"
          >
            <span className="material-symbols-outlined">error</span>
            <p className="text-sm font-medium">{errorMsg}</p>
          </motion.div>
        )}
        
        {format === 'MCQ' && qCount > 0 && (
          <div className="mb-6 font-mono text-sm font-bold text-green-600 dark:text-green-400">
            Score: {correctCount}/{qCount - 1 + (submitted ? 1 : 0)} correct
          </div>
        )}

        <AnimatePresence mode="wait">
          {loadingMsg && !feedback && !submitted ? (
            <motion.div 
              key="loading"
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-lg font-mono text-slate-600 dark:text-slate-400 animate-pulse">{loadingMsg}</p>
            </motion.div>
          ) : typedQuestion ? (
            <motion.div 
              key="question"
              className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-6 rounded-xl font-mono text-[12px] md:text-sm mb-6 shadow-2xl border border-slate-300 dark:border-slate-800 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
              <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-indigo-400 font-bold">$ AI_AGENT</span>
                {useResume && (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold rounded-md border border-indigo-200 dark:border-indigo-800">
                    <span className="material-symbols-outlined text-[12px]">psychology</span>
                    PERSONALIZED
                  </span>
                )}
              </div>
              {typedQuestion}
              <motion.span 
                className="inline-block w-2 h-4 bg-indigo-500 ml-1"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Q/A FORMAT UI */}
        {format !== 'MCQ' && !loadingMsg && typedQuestion && !feedback && (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative group">
              <textarea
                className="w-full h-40 md:h-48 p-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 outline-none resize-none font-body text-sm md:text-base text-slate-900 dark:text-slate-100"
                placeholder="Type your response here..."
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                disabled={submitting}
              />
              <div className="absolute bottom-4 right-4 text-[10px] text-slate-400 font-mono uppercase tracking-widest pointer-events-none">
                {answer.trim().split(/\s+/).filter(Boolean).length} words
              </div>
            </div>
            

            
            <motion.button
              onClick={handleSubmitQA}
              disabled={submitting || !answer.trim() || answer.trim().split(/\s+/).filter(Boolean).length < 3}
              className="w-full bg-[#1e40af] text-white py-4 rounded-xl font-headline font-bold text-lg shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 disabled:opacity-50 flex items-center justify-center gap-3"
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.99 }}
            >
              {submitting ? <><Spinner /> ANALYZING...</> : 'SUBMIT ANSWER'}
            </motion.button>
          </motion.div>
        )}

        {/* Q/A FEEDBACK UI */}
        {format !== 'MCQ' && feedback && (
          <motion.div 
            key="feedback"
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <InterviewFeedback feedback={feedback} />
            {!isFinished && (
              <div className="flex flex-col items-center mt-6 gap-2">
                <Spinner />
                <p className="text-sm text-slate-500">Preparing next question...</p>
              </div>
            )}
          </motion.div>
        )}

        {/* MCQ FORMAT UI */}
        {format === 'MCQ' && mcqData && typedQuestion && (
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {mcqData.options.map((opt) => {
              let btnClass = "w-full text-left bg-white dark:bg-slate-900 border-[0.5px] border-[#bfdbfe] dark:border-slate-700 p-[14px] px-4 rounded-lg cursor-pointer font-mono mb-2 transition-all duration-150 text-slate-800 dark:text-slate-200 ";
              
              if (submitted) {
                if (opt.key === mcqData.correctAnswer) {
                  btnClass = "w-full text-left p-[14px] px-4 rounded-lg font-mono mb-2 border-2 border-[#1D9E75] bg-[#f0fff4] dark:bg-[#1D9E75]/20 text-[#1D9E75] dark:text-blue-400 font-bold ";
                } else if (opt.key === selectedOption && opt.key !== mcqData.correctAnswer) {
                  btnClass = "w-full text-left p-[14px] px-4 rounded-lg font-mono mb-2 border-2 border-[#cc0000] bg-[#fff5f5] dark:bg-[#cc0000]/20 text-[#cc0000] dark:text-red-400 font-bold ";
                } else {
                  btnClass += " opacity-50 ";
                }
              } else {
                if (selectedOption === opt.key) {
                  btnClass = "w-full text-left p-[14px] px-4 rounded-lg font-mono mb-2 border-2 border-[#1a2e1a] dark:border-white bg-[#f7faf7] dark:bg-slate-800 text-slate-900 dark:text-white font-bold ";
                } else {
                  btnClass += " hover:border-[#888888] dark:hover:border-slate-500 hover:translate-x-1 ";
                }
              }

              return (
                <button
                  key={opt.key}
                  disabled={submitted || submitting}
                  onClick={() => setSelectedOption(opt.key)}
                  className={btnClass}
                >
                  {opt.key}) {opt.text}
                </button>
              );
            })}

            {!submitted && selectedOption && (
              <motion.button
                onClick={handleSubmitMCQ}
                disabled={submitting}
                className="w-full mt-4 bg-[#1e40af] text-white py-4 rounded-xl font-headline font-bold text-lg shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 disabled:opacity-50 flex items-center justify-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.99 }}
              >
                {submitting ? <><Spinner /> SUBMITTING...</> : 'SUBMIT ANSWER'}
              </motion.button>
            )}

            {/* MCQ RESULT & EXPLANATION */}
            {submitted && feedback && (
              <motion.div 
                className="mt-6 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {isCorrect ? (
                  <div className="flex items-center gap-3 mb-4 text-green-600 dark:text-green-400 font-bold text-xl font-headline">
                    <span className="material-symbols-outlined text-3xl">check_circle</span>
                    ✅ Correct! Well done.
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="flex items-center gap-3 text-red-600 dark:text-red-400 font-bold text-xl font-headline mb-1">
                      <span className="material-symbols-outlined text-3xl">cancel</span>
                      ❌ Incorrect
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 font-bold ml-10">
                      Correct answer: {mcqData.correctAnswer}) {mcqData.options.find(o => o.key === mcqData.correctAnswer)?.text}
                    </p>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 font-mono flex items-center gap-2">
                    <span className="material-symbols-outlined text-indigo-500">lightbulb</span> 
                    AI Explanation
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                    {feedback.replace('EXPLANATION:', '').trim()}
                  </p>
                </div>

                <motion.button
                  onClick={handleNextMCQQuestion}
                  className="w-full mt-6 bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Next Question →
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </main>
      <div className="hidden md:block"><Footer /></div>
    </div>
  );
};

export default InterviewPage;