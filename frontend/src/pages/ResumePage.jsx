import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TopNavBar from '../components/layout/TopNavBar';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import { useToast } from '../components/common/Toast';
import apiService from '../api/apiService';

const ResumePage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const { showToast, ToastContainer } = useToast();

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        showToast('File size must be less than 5MB', 'error');
        return;
      }
      if (!selectedFile.name.match(/\.(pdf|doc|docx)$/)) {
        showToast('Please upload a PDF or Word document', 'error');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    const userId = localStorage.getItem('userId');
    if (!userId) {
      showToast('Please login to upload resume', 'error');
      return;
    }

    setUploading(true);
    try {
      // Always save resume data to localStorage first
      const resumeData = {
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(2) + ' KB',
        uploadedAt: new Date().toLocaleDateString(),
        active: true,
        userId: userId
      };
      
      // Get existing resumes or create new array
      const existingResumes = JSON.parse(localStorage.getItem('userResumes') || '[]');
      
      // Set new resume as active and deactivate others
      existingResumes.forEach(resume => resume.active = false);
      existingResumes.unshift(resumeData);
      
      localStorage.setItem('userResumes', JSON.stringify(existingResumes));
      
      // Try to upload to backend for analysis
      try {
        const response = await apiService.uploadResume(file, userId);
        setAnalysis(response.data);
        setShowAnalysis(true);
        showToast('Resume uploaded and analyzed successfully!', 'success');
      } catch (apiError) {
        // Backend failed but resume was saved locally
        console.error('Backend analysis failed:', apiError);
        // Create a basic analysis from local data
        setAnalysis({
          fileName: file.name,
          uploadedAt: new Date().toLocaleDateString(),
          message: 'Resume saved successfully. AI analysis is temporarily unavailable.'
        });
        setShowAnalysis(true);
        showToast('Resume saved locally. AI analysis unavailable right now.', 'info');
      }
    } catch (error) {
      showToast('Failed to process resume. Please try again.', 'error');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const event = { target: { files: [droppedFile] } };
      handleFileSelect(event);
    }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-[#0a1128] min-h-screen transition-colors duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <TopNavBar />
      
      <main className="pt-24 px-4 md:px-8 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-headline text-3xl md:text-4xl font-extrabold mb-4 text-slate-900 dark:text-slate-100">
              Resume Analysis
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Upload your resume to get personalized interview questions based on your experience
            </p>
          </div>

          {/* Upload Card */}
          <Card padding="large" className="mb-8">
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-outline-variant rounded-xl p-12 text-center hover:border-primary transition-colors"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full signature-glow flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-3xl">
                    upload_file
                  </span>
                </div>
                
                {file ? (
                  <div className="flex items-center gap-3 bg-primary-fixed px-6 py-3 rounded-xl">
                    <span className="material-symbols-outlined text-primary">description</span>
                    <span className="font-label font-bold text-primary">{file.name}</span>
                    <button 
                      onClick={() => setFile(null)}
                      className="ml-2 hover:bg-primary/10 rounded-full p-1"
                    >
                      <span className="material-symbols-outlined text-primary text-sm">close</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="font-headline text-xl font-bold mb-2">
                        Drop your resume here
                      </p>
                      <p className="text-on-surface-variant mb-4">
                        or click to browse
                      </p>
                    </div>
                    <input
                      type="file"
                      id="resume-upload"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <label htmlFor="resume-upload">
                      <Button variant="outline" as="span">
                        Browse Files
                      </Button>
                    </label>
                  </>
                )}
              </div>
            </div>

            {file && (
              <div className="mt-6 flex justify-center">
                <Button
                  variant="gradient"
                  size="large"
                  onClick={handleUpload}
                  disabled={uploading}
                  icon={uploading ? undefined : "analytics"}
                >
                  {uploading ? 'Analyzing...' : 'Analyze Resume'}
                </Button>
              </div>
            )}

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4">
                <span className="material-symbols-outlined text-primary mb-2" 
                      style={{fontVariationSettings: "'FILL' 1"}}>
                  verified
                </span>
                <p className="text-sm text-on-surface-variant">
                  Secure & Private
                </p>
              </div>
              <div className="p-4">
                <span className="material-symbols-outlined text-secondary mb-2" 
                      style={{fontVariationSettings: "'FILL' 1"}}>
                  speed
                </span>
                <p className="text-sm text-on-surface-variant">
                  Instant Analysis
                </p>
              </div>
              <div className="p-4">
                <span className="material-symbols-outlined text-tertiary mb-2" 
                      style={{fontVariationSettings: "'FILL' 1"}}>
                  psychology
                </span>
                <p className="text-sm text-on-surface-variant">
                  AI-Powered
                </p>
              </div>
            </div>
          </Card>

          {/* Supported Formats */}
          <Card variant="bordered" padding="medium">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-on-surface-variant">info</span>
              <div>
                <p className="font-label font-bold mb-2">Supported Formats</p>
                <p className="text-sm text-on-surface-variant">
                  We accept PDF (.pdf), Microsoft Word (.doc, .docx) files. 
                  Maximum file size: 5MB
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Analysis Modal */}
      {analysis && (
        <Modal
          isOpen={showAnalysis}
          onClose={() => setShowAnalysis(false)}
          title="Resume Analysis Results"
          size="large"
        >
          <ResumeAnalysisResults data={analysis} />
        </Modal>
      )}

      <Footer />
      <ToastContainer />
    </motion.div>
  );
};

/** Normalize skills/topics from API (array or JSON string from some clients). */
const asStringList = (value) => {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string') {
    const s = value.trim();
    if (!s) return [];
    try {
      const parsed = JSON.parse(s);
      return Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : [];
    } catch {
      return [];
    }
  }
  return [];
};

// Resume Analysis Results Component
const ResumeAnalysisResults = ({ data }) => {
  const skills = asStringList(data.skills);
  const topics = asStringList(data.suggestedTopics);
  const summary =
    typeof data.experienceSummary === 'string' && data.experienceSummary.trim()
      ? data.experienceSummary.trim()
      : '';
  const offlineMessage =
    typeof data.message === 'string' && data.message.trim() ? data.message.trim() : '';

  const sectionTitle = 'font-headline text-xl font-bold mb-4 text-slate-900 dark:text-slate-100';
  const insetCard =
    'rounded-xl p-6 border border-slate-200/80 bg-slate-100 text-slate-800 dark:border-slate-600/50 dark:bg-slate-900/70 dark:text-slate-200';
  const topicRow =
    'flex items-start gap-3 p-4 rounded-lg border border-slate-200/80 bg-slate-50 dark:border-slate-600/40 dark:bg-slate-900/50';

  return (
    <div className="space-y-6">
      {offlineMessage && (
        <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
          {offlineMessage}
        </p>
      )}

      {/* Skills Identified */}
      <div>
        <h3 className={sectionTitle}>Skills Identified</h3>
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="rounded-full px-3 py-1 text-sm font-label font-bold bg-primary-fixed text-primary dark:bg-primary/25 dark:text-slate-100"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No skills extracted yet. Try a text-based PDF or re-run analysis.
          </p>
        )}
      </div>

      {/* Experience Summary */}
      <div>
        <h3 className={sectionTitle}>Experience Summary</h3>
        <div className={insetCard}>
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            {summary || 'No experience summary returned for this file.'}
          </p>
        </div>
      </div>

      {/* Suggested Interview Topics */}
      <div>
        <h3 className={sectionTitle}>Suggested Interview Topics</h3>
        {topics.length > 0 ? (
          <div className="space-y-3">
            {topics.map((topic, index) => (
              <div key={index} className={topicRow}>
                <span className="material-symbols-outlined mt-1 shrink-0 text-primary dark:text-indigo-300">
                  arrow_right
                </span>
                <p className="text-slate-800 dark:text-slate-200">{topic}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No topics listed. If you uploaded Word (.docx), try PDF for best text extraction.
          </p>
        )}
      </div>
    </div>
  );
};

export default ResumePage;