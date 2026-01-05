import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  BookOpen,
  FileText,
  HelpCircle,
  Eye,
  Plus,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { createCourse } from '../api/coursebank';
import { toast } from 'sonner';

const CourseAdmin = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [courseData, setCourseData] = useState({
    name: '',
    description: '',
    level: 'beginner',
    duration_minutes: null,
    image_url: null,
    tags: [''],
    sections: [
      {
        title: '',
        content: '',
        duration_minutes: null,
        order_index: 1,
        quiz: {
          title: '',
          passing_score: null,
          questions: [
            {
              question_text: '',
              question_type: 'single_choice',
              points: null,
              order_index: 1,
              answers: [
                {
                  answer_text: '',
                  is_correct: true,
                  order_index: 1
                },
                {
                  answer_text: '',
                  is_correct: false,
                  order_index: 2
                },
                {
                  answer_text: '',
                  is_correct: false,
                  order_index: 3
                },
                {
                  answer_text: '',
                  is_correct: false,
                  order_index: 4
                }
              ]
            }
          ]
        }
      }
    ]
  });

  const steps = [
    { id: 1, name: 'Basic Info', icon: BookOpen },
    { id: 2, name: 'Sections', icon: FileText },
    { id: 3, name: 'Quizzes', icon: HelpCircle },
    { id: 4, name: 'Review', icon: Eye }
  ];

  // Helper functions
  const addTag = () => {
    setCourseData(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const removeTag = (index) => {
    setCourseData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const updateTag = (index, value) => {
    setCourseData(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => i === index ? value : tag)
    }));
  };

  const addSection = () => {
    setCourseData(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          title: '',
          content: '',
          duration_minutes: null,
          order_index: prev.sections.length + 1,
          quiz: {
            title: '',
            passing_score: null,
            questions: [
              {
                question_text: '',
                question_type: 'multiple_choice',
                points: null,
                order_index: 1,
                answers: [
                  {
                    answer_text: '',
                    is_correct: true,
                    order_index: 1
                  }
                ]
              }
            ]
          }
        }
      ]
    }));
  };

  const removeSection = (index) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index).map((section, i) => ({
        ...section,
        order_index: i + 1
      }))
    }));
  };

  const updateSection = (index, field, value) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      )
    }));
  };

  const addQuestion = (sectionIndex) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
            ...section,
            quiz: {
              ...section.quiz,
              questions: [
                ...section.quiz.questions,
                {
                  question_text: '',
                  question_type: 'single_choice',
                  points: null,
                  order_index: section.quiz.questions.length + 1,
                  answers: [
                    {
                      answer_text: '',
                      is_correct: true,
                      order_index: 1
                    },
                    {
                      answer_text: '',
                      is_correct: false,
                      order_index: 2
                    },
                    {
                      answer_text: '',
                      is_correct: false,
                      order_index: 3
                    },
                    {
                      answer_text: '',
                      is_correct: false,
                      order_index: 4
                    }
                  ]
                }
              ]
            }
          }
          : section
      )
    }));
  };

  const removeQuestion = (sectionIndex, questionIndex) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
            ...section,
            quiz: {
              ...section.quiz,
              questions: section.quiz.questions
                .filter((_, qi) => qi !== questionIndex)
                .map((q, qi) => ({ ...q, order_index: qi + 1 }))
            }
          }
          : section
      )
    }));
  };

  const updateQuestion = (sectionIndex, questionIndex, field, value) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
            ...section,
            quiz: {
              ...section.quiz,
              questions: section.quiz.questions.map((q, qi) =>
                qi === questionIndex ? { ...q, [field]: value } : q
              )
            }
          }
          : section
      )
    }));
  };

  const updateQuizField = (sectionIndex, field, value) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
            ...section,
            quiz: {
              ...section.quiz,
              [field]: value
            }
          }
          : section
      )
    }));
  };

  const addAnswer = (sectionIndex, questionIndex) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
            ...section,
            quiz: {
              ...section.quiz,
              questions: section.quiz.questions.map((q, qi) =>
                qi === questionIndex
                  ? {
                    ...q,
                    answers: [
                      ...q.answers,
                      {
                        answer_text: '',
                        is_correct: false,
                        order_index: q.answers.length + 1
                      }
                    ]
                  }
                  : q
              )
            }
          }
          : section
      )
    }));
  };

  const removeAnswer = (sectionIndex, questionIndex, answerIndex) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
            ...section,
            quiz: {
              ...section.quiz,
              questions: section.quiz.questions.map((q, qi) =>
                qi === questionIndex
                  ? {
                    ...q,
                    answers: q.answers
                      .filter((_, ai) => ai !== answerIndex)
                      .map((a, ai) => ({ ...a, order_index: ai + 1 }))
                  }
                  : q
              )
            }
          }
          : section
      )
    }));
  };

  const updateAnswer = (sectionIndex, questionIndex, answerIndex, field, value) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
            ...section,
            quiz: {
              ...section.quiz,
              questions: section.quiz.questions.map((q, qi) =>
                qi === questionIndex
                  ? {
                    ...q,
                    answers: q.answers.map((a, ai) =>
                      ai === answerIndex ? { ...a, [field]: value } : a
                    )
                  }
                  : q
              )
            }
          }
          : section
      )
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return courseData.name.trim() !== '' && courseData.level !== '';
      case 2:
        return courseData.sections.every(s => s.title.trim() !== '' && s.content.trim() !== '');
      case 3:
        return courseData.sections.every(s =>
          s.quiz.questions.every(q =>
            q.question_text.trim() !== '' &&
            q.answers.length > 0 &&
            q.answers.every(a => a.answer_text.trim() !== '') &&
            q.answers.some(a => a.is_correct)
          )
        );
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Clean up the data before submission
      const cleanedData = {
        ...courseData,
        tags: courseData.tags.filter(tag => tag.trim() !== ''),
        duration_minutes: courseData.duration_minutes || null,
        image_url: courseData.image_url || null
      };

      await createCourse(cleanedData);
      toast.success('Course created successfully!');
      
      // Reset form
      setCourseData({
        name: '',
        description: '',
        level: 'beginner',
        duration_minutes: null,
        image_url: null,
        tags: [''],
        sections: [
          {
            title: '',
            content: '',
            duration_minutes: null,
            order_index: 1,
            quiz: {
              title: '',
              passing_score: null,
              questions: [
                {
                  question_text: '',
                  question_type: 'single_choice',
                  points: null,
                  order_index: 1,
                  answers: [
                    {
                      answer_text: '',
                      is_correct: true,
                      order_index: 1
                    },
                    {
                      answer_text: '',
                      is_correct: false,
                      order_index: 2
                    },
                    {
                      answer_text: '',
                      is_correct: false,
                      order_index: 3
                    },
                    {
                      answer_text: '',
                      is_correct: false,
                      order_index: 4
                    }
                  ]
                }
              ]
            }
          }
        ]
      });
      setCurrentStep(1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create course');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-reddit-dark text-white">
      {/* Header */}
      <div className="sticky top-0 bg-reddit-dark/95 backdrop-blur-md z-10 border-b border-reddit-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/courses')}
            className="p-2 -ml-2 rounded-full hover:bg-reddit-cardHover transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-xl">Create Course</h1>
            <p className="text-xs text-reddit-placeholder">Add a new course to the course bank</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-10">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: currentStep >= step.id ? 1 : 0.9 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                    currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : currentStep === step.id
                      ? 'bg-reddit-orange text-white'
                      : 'bg-reddit-cardHover text-reddit-placeholder border border-reddit-border'
                  }`}
                >
                  {currentStep > step.id ? <Check size={20} /> : <step.icon size={18} />}
                </motion.div>
                <span className={`text-xs mt-2 font-medium ${currentStep >= step.id ? 'text-white' : 'text-reddit-placeholder'}`}>
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 transition-all duration-500 ${currentStep > step.id ? 'bg-reddit-orange' : 'bg-reddit-border'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
                <p className="text-reddit-placeholder">Enter the core details about your course</p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                {/* Course Name */}
                <div className="bg-reddit-card border border-reddit-border rounded-xl p-6">
                  <label className="block">
                    <span className="text-sm font-semibold mb-2 block">
                      Course Name <span className="text-red-500">*</span>
                    </span>
                    <input
                      type="text"
                      value={courseData.name}
                      onChange={(e) => setCourseData({ ...courseData, name: e.target.value })}
                      placeholder="e.g., Introduction to Python Programming"
                      className="w-full px-4 py-3 bg-reddit-cardHover border border-reddit-border rounded-lg text-white placeholder-reddit-placeholder focus:outline-none focus:border-reddit-orange transition-colors"
                    />
                  </label>
                </div>

                {/* Description */}
                <div className="bg-reddit-card border border-reddit-border rounded-xl p-6">
                  <label className="block">
                    <span className="text-sm font-semibold mb-2 block">Description</span>
                    <textarea
                      value={courseData.description}
                      onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                      placeholder="Describe what students will learn in this course..."
                      rows={4}
                      className="w-full px-4 py-3 bg-reddit-cardHover border border-reddit-border rounded-lg text-white placeholder-reddit-placeholder focus:outline-none focus:border-reddit-orange transition-colors resize-none"
                    />
                  </label>
                </div>

                {/* Level and Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-reddit-card border border-reddit-border rounded-xl p-6">
                    <label className="block">
                      <span className="text-sm font-semibold mb-2 block">
                        Level <span className="text-red-500">*</span>
                      </span>
                      <select
                        value={courseData.level}
                        onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}
                        className="w-full px-4 py-3 bg-reddit-cardHover border border-reddit-border rounded-lg text-white focus:outline-none focus:border-reddit-orange transition-colors"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </label>
                  </div>

                  <div className="bg-reddit-card border border-reddit-border rounded-xl p-6">
                    <label className="block">
                      <span className="text-sm font-semibold mb-2 block">Duration (minutes)</span>
                      <input
                        type="number"
                        value={courseData.duration_minutes || ''}
                        onChange={(e) => setCourseData({ ...courseData, duration_minutes: e.target.value ? parseInt(e.target.value) : null })}
                        placeholder="e.g., 120"
                        className="w-full px-4 py-3 bg-reddit-cardHover border border-reddit-border rounded-lg text-white placeholder-reddit-placeholder focus:outline-none focus:border-reddit-orange transition-colors"
                      />
                    </label>
                  </div>
                </div>

                {/* Image URL */}
                <div className="bg-reddit-card border border-reddit-border rounded-xl p-6">
                  <label className="block">
                    <span className="text-sm font-semibold mb-2 block">Image URL</span>
                    <input
                      type="text"
                      value={courseData.image_url || ''}
                      onChange={(e) => setCourseData({ ...courseData, image_url: e.target.value || null })}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 bg-reddit-cardHover border border-reddit-border rounded-lg text-white placeholder-reddit-placeholder focus:outline-none focus:border-reddit-orange transition-colors"
                    />
                  </label>
                </div>

                {/* Tags */}
                <div className="bg-reddit-card border border-reddit-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold">Tags</span>
                    <button
                      onClick={addTag}
                      className="flex items-center gap-2 px-3 py-1.5 bg-reddit-orange hover:bg-reddit-orange/90 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Plus size={16} />
                      Add Tag
                    </button>
                  </div>
                  <div className="space-y-3">
                    {courseData.tags.map((tag, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={tag}
                          onChange={(e) => updateTag(index, e.target.value)}
                          placeholder="e.g., Python, Programming, Beginner"
                          className="flex-1 px-4 py-2 bg-reddit-cardHover border border-reddit-border rounded-lg text-white placeholder-reddit-placeholder focus:outline-none focus:border-reddit-orange transition-colors"
                        />
                        {courseData.tags.length > 1 && (
                          <button
                            onClick={() => removeTag(index)}
                            className="p-2 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Sections */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Course Sections</h2>
                <p className="text-reddit-placeholder">Add sections to organize your course content</p>
              </div>

              <div className="max-w-4xl mx-auto space-y-6">
                {courseData.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="bg-reddit-card border border-reddit-border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">Section {sectionIndex + 1}</h3>
                      {courseData.sections.length > 1 && (
                        <button
                          onClick={() => removeSection(sectionIndex)}
                          className="p-2 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {/* Section Title */}
                      <div>
                        <label className="block">
                          <span className="text-sm font-semibold mb-2 block">
                            Title <span className="text-red-500">*</span>
                          </span>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                            placeholder="e.g., Getting Started with Variables"
                            className="w-full px-4 py-3 bg-reddit-cardHover border border-reddit-border rounded-lg text-white placeholder-reddit-placeholder focus:outline-none focus:border-reddit-orange transition-colors"
                          />
                        </label>
                      </div>

                      {/* Section Content */}
                      <div>
                        <label className="block">
                          <span className="text-sm font-semibold mb-2 block">
                            Content <span className="text-red-500">*</span>
                          </span>
                          <textarea
                            value={section.content}
                            onChange={(e) => updateSection(sectionIndex, 'content', e.target.value)}
                            placeholder="Enter the lesson content here..."
                            rows={6}
                            className="w-full px-4 py-3 bg-reddit-cardHover border border-reddit-border rounded-lg text-white placeholder-reddit-placeholder focus:outline-none focus:border-reddit-orange transition-colors resize-none"
                          />
                        </label>
                      </div>

                      {/* Section Duration */}
                      <div>
                        <label className="block">
                          <span className="text-sm font-semibold mb-2 block">Duration (minutes)</span>
                          <input
                            type="number"
                            value={section.duration_minutes || ''}
                            onChange={(e) => updateSection(sectionIndex, 'duration_minutes', e.target.value ? parseInt(e.target.value) : null)}
                            placeholder="e.g., 30"
                            className="w-full px-4 py-3 bg-reddit-cardHover border border-reddit-border rounded-lg text-white placeholder-reddit-placeholder focus:outline-none focus:border-reddit-orange transition-colors"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addSection}
                  className="w-full py-4 border-2 border-dashed border-reddit-border hover:border-reddit-orange rounded-xl text-reddit-placeholder hover:text-reddit-orange transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Plus size={20} />
                  Add Another Section
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Quizzes */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Section Quizzes</h2>
                <p className="text-reddit-placeholder">Add quiz questions for each section</p>
              </div>

              <div className="max-w-5xl mx-auto space-y-8">
                {courseData.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="bg-reddit-card border border-reddit-border rounded-xl p-6">
                    <h3 className="font-semibold text-lg mb-4">
                      Quiz for: {section.title || `Section ${sectionIndex + 1}`}
                    </h3>

                    {/* Quiz Title and Passing Score */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block">
                          <span className="text-sm font-semibold mb-2 block">Quiz Title</span>
                          <input
                            type="text"
                            value={section.quiz.title}
                            onChange={(e) => updateQuizField(sectionIndex, 'title', e.target.value)}
                            placeholder="e.g., Variables Quiz"
                            className="w-full px-4 py-2 bg-reddit-cardHover border border-reddit-border rounded-lg text-white placeholder-reddit-placeholder focus:outline-none focus:border-reddit-orange transition-colors"
                          />
                        </label>
                      </div>
                      <div>
                        <label className="block">
                          <span className="text-sm font-semibold mb-2 block">Passing Score (%)</span>
                          <input
                            type="number"
                            value={section.quiz.passing_score || ''}
                            onChange={(e) => updateQuizField(sectionIndex, 'passing_score', e.target.value ? parseInt(e.target.value) : null)}
                            placeholder="e.g., 70"
                            className="w-full px-4 py-2 bg-reddit-cardHover border border-reddit-border rounded-lg text-white placeholder-reddit-placeholder focus:outline-none focus:border-reddit-orange transition-colors"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Questions */}
                    <div className="space-y-6">
                      {section.quiz.questions.map((question, questionIndex) => (
                        <div key={questionIndex} className="bg-reddit-cardHover border border-reddit-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold">Question {questionIndex + 1}</h4>
                            {section.quiz.questions.length > 1 && (
                              <button
                                onClick={() => removeQuestion(sectionIndex, questionIndex)}
                                className="p-1.5 hover:bg-red-500/20 rounded text-red-500 transition-colors"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>

                          {/* Question Text */}
                          <div className="mb-4">
                            <label className="block">
                              <span className="text-sm font-semibold mb-2 block">
                                Question <span className="text-red-500">*</span>
                              </span>
                              <textarea
                                value={question.question_text}
                                onChange={(e) => updateQuestion(sectionIndex, questionIndex, 'question_text', e.target.value)}
                                placeholder="Enter your question here..."
                                rows={2}
                                className="w-full px-4 py-2 bg-reddit-cardHover border border-reddit-border rounded-lg text-white placeholder-reddit-placeholder focus:outline-none focus:border-reddit-orange transition-colors resize-none"
                              />
                            </label>
                          </div>

                          {/* Question Type and Points */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block">
                                <span className="text-sm font-semibold mb-2 block">
                                  Question Type <span className="text-red-500">*</span>
                                </span>
                                <select
                                  value={question.question_type}
                                  onChange={(e) => updateQuestion(sectionIndex, questionIndex, 'question_type', e.target.value)}
                                  className="w-full px-4 py-2 bg-reddit-cardHover border border-reddit-border rounded-lg text-white focus:outline-none focus:border-reddit-orange transition-colors"
                                >
                                  <option value="single_choice">Single Choice (One Correct Answer)</option>
                                  <option value="multiple_choice">Multiple Choice (Multiple Correct Answers)</option>
                                </select>
                              </label>
                            </div>
                            <div>
                              <label className="block">
                                <span className="text-sm font-semibold mb-2 block">Points</span>
                                <input
                                  type="number"
                                  value={question.points || ''}
                                  onChange={(e) => updateQuestion(sectionIndex, questionIndex, 'points', e.target.value ? parseInt(e.target.value) : null)}
                                  placeholder="e.g., 10"
                                  className="w-full px-4 py-2 bg-reddit-cardHover border border-reddit-border rounded-lg text-white placeholder-reddit-placeholder focus:outline-none focus:border-reddit-orange transition-colors"
                                />
                              </label>
                            </div>
                          </div>

                          {/* Answers - Fixed to 4 options */}
                          <div>
                            <div className="mb-3">
                              <span className="text-sm font-semibold">
                                Answers (4 Options) <span className="text-red-500">*</span>
                              </span>
                              <p className="text-xs text-reddit-placeholder mt-1">
                                {question.question_type === 'single_choice' 
                                  ? 'Select one correct answer' 
                                  : 'Select one or more correct answers'}
                              </p>
                            </div>
                            <div className="space-y-2">
                              {[0, 1, 2, 3].map((answerIndex) => {
                                const answer = question.answers[answerIndex] || { answer_text: '', is_correct: false, order_index: answerIndex + 1 };
                                return (
                                  <div key={answerIndex} className="flex gap-2 items-center">
                                    <div className="w-8 h-8 rounded-full bg-reddit-cardHover border border-reddit-border flex items-center justify-center text-sm font-semibold flex-shrink-0">
                                      {String.fromCharCode(65 + answerIndex)}
                                    </div>
                                    <input
                                      type="text"
                                      value={answer.answer_text}
                                      onChange={(e) => {
                                        const newAnswers = [...question.answers];
                                        if (!newAnswers[answerIndex]) {
                                          newAnswers[answerIndex] = { answer_text: '', is_correct: false, order_index: answerIndex + 1 };
                                        }
                                        newAnswers[answerIndex].answer_text = e.target.value;
                                        updateQuestion(sectionIndex, questionIndex, 'answers', newAnswers);
                                      }}
                                      placeholder={`Option ${String.fromCharCode(65 + answerIndex)}`}
                                      className="flex-1 px-3 py-2 bg-reddit-cardHover border border-reddit-border rounded-lg text-white placeholder-reddit-placeholder focus:outline-none focus:border-reddit-orange transition-colors text-sm"
                                    />
                                    <label className="flex items-center gap-2 px-3 py-2 bg-reddit-cardHover border border-reddit-border rounded-lg cursor-pointer hover:border-reddit-orange transition-colors">
                                      <input
                                        type={question.question_type === 'single_choice' ? 'radio' : 'checkbox'}
                                        name={question.question_type === 'single_choice' ? `question-${sectionIndex}-${questionIndex}` : undefined}
                                        checked={answer.is_correct}
                                        onChange={(e) => {
                                          const newAnswers = [...question.answers];
                                          if (!newAnswers[answerIndex]) {
                                            newAnswers[answerIndex] = { answer_text: '', is_correct: false, order_index: answerIndex + 1 };
                                          }
                                          
                                          if (question.question_type === 'single_choice') {
                                            // For single choice, uncheck all others
                                            newAnswers.forEach((a, i) => {
                                              if (newAnswers[i]) {
                                                newAnswers[i].is_correct = i === answerIndex;
                                              }
                                            });
                                          } else {
                                            // For multiple choice, toggle this one
                                            newAnswers[answerIndex].is_correct = e.target.checked;
                                          }
                                          updateQuestion(sectionIndex, questionIndex, 'answers', newAnswers);
                                        }}
                                        className="w-4 h-4 accent-reddit-orange"
                                      />
                                      <span className="text-xs text-reddit-placeholder">Correct</span>
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() => addQuestion(sectionIndex)}
                        className="w-full py-3 border border-dashed border-reddit-border hover:border-reddit-orange rounded-lg text-reddit-placeholder hover:text-reddit-orange transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Plus size={16} />
                        Add Question
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Review & Submit</h2>
                <p className="text-reddit-placeholder">Review your course details before publishing</p>
              </div>

              <div className="max-w-4xl mx-auto space-y-6">
                {/* Basic Info Summary */}
                <div className="bg-reddit-card border border-reddit-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Basic Information</h3>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-sm text-reddit-orange hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-reddit-placeholder">Course Name:</span>
                      <span className="font-medium">{courseData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-reddit-placeholder">Level:</span>
                      <span className="font-medium capitalize">{courseData.level}</span>
                    </div>
                    {courseData.duration_minutes && (
                      <div className="flex justify-between">
                        <span className="text-reddit-placeholder">Duration:</span>
                        <span className="font-medium">{courseData.duration_minutes} minutes</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-reddit-placeholder">Tags:</span>
                      <span className="font-medium">{courseData.tags.filter(t => t.trim()).join(', ') || 'None'}</span>
                    </div>
                  </div>
                </div>

                {/* Sections Summary */}
                <div className="bg-reddit-card border border-reddit-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Sections ({courseData.sections.length})</h3>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-sm text-reddit-orange hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="space-y-4">
                    {courseData.sections.map((section, index) => (
                      <div key={index} className="bg-reddit-cardHover rounded-lg p-4">
                        <h4 className="font-semibold mb-2">{section.title}</h4>
                        <p className="text-sm text-reddit-placeholder line-clamp-2">{section.content}</p>
                        {section.duration_minutes && (
                          <p className="text-xs text-reddit-placeholder mt-2">{section.duration_minutes} minutes</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quiz Summary */}
                <div className="bg-reddit-card border border-reddit-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Quizzes</h3>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="text-sm text-reddit-orange hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="space-y-4">
                    {courseData.sections.map((section, index) => (
                      <div key={index} className="bg-reddit-cardHover rounded-lg p-4">
                        <h4 className="font-semibold mb-2">
                          {section.quiz.title || `Quiz ${index + 1}`}
                        </h4>
                        <p className="text-sm text-reddit-placeholder">
                          {section.quiz.questions.length} question{section.quiz.questions.length !== 1 ? 's' : ''}
                          {section.quiz.passing_score && ` • ${section.quiz.passing_score}% passing score`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Validation Warnings */}
                {!validateStep(1) || !validateStep(2) || !validateStep(3) ? (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <h4 className="font-semibold text-red-500 mb-1">Validation Errors</h4>
                      <ul className="text-sm text-red-400 space-y-1">
                        {!validateStep(1) && <li>• Please fill in all required basic information</li>}
                        {!validateStep(2) && <li>• All sections must have a title and content</li>}
                        {!validateStep(3) && <li>• All questions must have text, at least one answer, and at least one correct answer</li>}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle className="text-green-500" size={20} />
                    <span className="text-green-400 font-medium">All validations passed! Ready to submit.</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-10 pt-6 border-t border-reddit-border">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-3 rounded-full font-semibold border border-reddit-border hover:bg-reddit-cardHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (currentStep < 4) {
                if (validateStep(currentStep)) {
                  setCurrentStep(currentStep + 1);
                } else {
                  toast.error('Please fill in all required fields');
                }
              } else {
                if (validateStep(1) && validateStep(2) && validateStep(3)) {
                  handleSubmit();
                } else {
                  toast.error('Please fix validation errors before submitting');
                }
              }
            }}
            disabled={isSubmitting}
            className="px-8 py-3 rounded-full font-bold bg-reddit-orange hover:bg-reddit-orange/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : currentStep === 4 ? (
              <>
                <Save size={18} />
                Create Course
              </>
            ) : (
              'Continue'
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CourseAdmin;
