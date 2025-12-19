import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Upload,
  FileText,
  X,
  Sparkles,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStudyGram } from '../context/StudyGramContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const UploadNotes = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useStudyGram();

  const [uploadedFile, setUploadedFile] = useState(null);
  const [topic, setTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError('');

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Validate file type
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];

      if (!validTypes.includes(file.type)) {
        setError('Please upload a PDF, DOC, DOCX, or TXT file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      setUploadedFile(file);
    }
  }, []);

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setError('');

      // Validate file type
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];

      if (!validTypes.includes(file.type)) {
        setError('Please upload a PDF, DOC, DOCX, or TXT file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      setUploadedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setError('');
  };

  const handleGenerate = async () => {
    if (!uploadedFile || !topic.trim()) {
      setError('Please upload a file and enter a topic');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // Simulate API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 2000));

      // TODO: Integrate with quiz generation API
      // const formData = new FormData();
      // formData.append('file', uploadedFile);
      // formData.append('topic', topic);
      // formData.append('questionCount', questionCount);
      // const response = await fetch('/api/generate-quiz', {
      //   method: 'POST',
      //   body: formData
      // });
      // const quizData = await response.json();

      // Navigate to quiz feed after generation
      navigate('/quiz-feed');
    } catch (err) {
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = uploadedFile && topic.trim() && questionCount > 0;

  return (
    <div className="min-h-screen bg-reddit-bg pt-16">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-reddit-bg/95 backdrop-blur-sm border-b border-reddit-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => navigate(-1)}
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-reddit-cardHover rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-reddit-text" />
              </motion.button>
              <h1 className="text-xl font-bold text-reddit-text">Generate Quiz</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Info Card */}
          <div className="bg-gradient-to-br from-reddit-blue/10 to-reddit-orange/10 backdrop-blur-sm border border-reddit-blue/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="bg-reddit-blue/20 p-3 rounded-xl">
                <Sparkles size={24} className="text-reddit-blue" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-reddit-text mb-2">
                  AI-Powered Quiz Generation
                </h3>
                <p className="text-reddit-textMuted text-sm leading-relaxed">
                  Upload your study notes and let AI generate personalized quizzes to test your knowledge.
                  Perfect for exam prep and self-assessment!
                </p>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-reddit-card backdrop-blur-sm border border-reddit-border rounded-2xl p-6">
            <label className="block text-sm font-semibold text-reddit-text mb-3">
              Upload Notes
            </label>

            {!uploadedFile ? (
              <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${isDragging
                    ? 'border-reddit-blue bg-reddit-blue/10'
                    : 'border-reddit-border hover:border-reddit-textMuted bg-reddit-input'
                  }`}
              >
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.txt"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <motion.div
                  animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Upload size={48} className={`mx-auto mb-4 ${isDragging ? 'text-reddit-blue' : 'text-reddit-textMuted'}`} />
                  <p className="text-reddit-text font-medium mb-2">
                    {isDragging ? 'Drop your file here' : 'Drag & drop your notes'}
                  </p>
                  <p className="text-sm text-reddit-textMuted mb-4">
                    or click to browse files
                  </p>
                  <p className="text-xs text-reddit-textMuted">
                    Supported: PDF, DOC, DOCX, TXT (Max 10MB)
                  </p>
                </motion.div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-reddit-input border border-reddit-border rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-reddit-blue/20 p-3 rounded-lg">
                      <FileText size={24} className="text-reddit-blue" />
                    </div>
                    <div>
                      <p className="text-reddit-text font-medium">{uploadedFile.name}</p>
                      <p className="text-sm text-reddit-textMuted">
                        {(uploadedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleRemoveFile}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-red-400" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3"
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </motion.div>
            )}
          </div>

          {/* Topic Input */}
          <div className="bg-reddit-card backdrop-blur-sm border border-reddit-border rounded-2xl p-6">
            <label className="block text-sm font-semibold text-reddit-text mb-3">
              Topic / Subject
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Linear Algebra, World History, React Hooks..."
              className="w-full px-4 py-3 bg-reddit-input border border-reddit-border rounded-xl text-reddit-text placeholder-reddit-textMuted focus:outline-none focus:border-reddit-blue transition-colors"
            />
            <p className="text-xs text-reddit-textMuted mt-2">
              This helps AI generate more relevant questions
            </p>
          </div>

          {/* Question Count */}
          <div className="bg-reddit-card backdrop-blur-sm border border-reddit-border rounded-2xl p-6">
            <label className="block text-sm font-semibold text-reddit-text mb-3">
              Number of Questions
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max="30"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="flex-1 h-2 bg-reddit-border rounded-lg appearance-none cursor-pointer accent-reddit-blue"
              />
              <div className="bg-reddit-input border border-reddit-border rounded-lg px-4 py-2 min-w-[60px] text-center">
                <span className="text-reddit-text font-bold text-lg">{questionCount}</span>
              </div>
            </div>
            <div className="flex justify-between text-xs text-reddit-textMuted mt-2">
              <span>5 questions</span>
              <span>30 questions (max)</span>
            </div>
          </div>

          {/* Generate Button */}
          <motion.button
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            whileHover={canGenerate && !isGenerating ? { scale: 1.02 } : {}}
            whileTap={canGenerate && !isGenerating ? { scale: 0.98 } : {}}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${canGenerate && !isGenerating
                ? 'bg-gradient-to-r from-reddit-blue to-reddit-orange hover:from-reddit-blue/90 hover:to-reddit-orange/90 text-white'
                : 'bg-reddit-input text-reddit-textMuted cursor-not-allowed'
              }`}
          >
            {isGenerating ? (
              <>
                <LoadingSpinner size={20} color="#ffffff" />
                Generating Quiz...
              </>
            ) : (
              <>
                <Sparkles size={24} />
                Generate Quiz
              </>
            )}
          </motion.button>

          {/* Tips */}
          <div className="bg-reddit-card/50 backdrop-blur-sm border border-reddit-border rounded-xl p-4">
            <h4 className="text-reddit-text font-semibold mb-2 flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" />
              Tips for best results
            </h4>
            <ul className="space-y-1 text-sm text-reddit-textMuted">
              <li>• Upload well-formatted notes with clear content</li>
              <li>• Specify a clear topic for more focused questions</li>
              <li>• Start with 10-15 questions for a comprehensive quiz</li>
              <li>• Review explanations to deepen your understanding</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadNotes;
