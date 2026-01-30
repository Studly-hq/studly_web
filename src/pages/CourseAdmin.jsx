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
    category: 'Tech',
    level: 'beginner',
    duration_minutes: null,
    image_url: null,
    tags: [''],
    sections: [
      {
        title: '',
        order_index: 1,
        duration_minutes: null,
        media: [],
        lessons: [
          {
            title: '',
            content: '',
            duration_minutes: null,
            order_index: 1,
            quiz: {
              title: '',
              passing_score: 70,
              questions: [
                {
                  question_text: '',
                  question_type: 'single_choice',
                  points: 10,
                  order_index: 1,
                  answers: [
                    { answer_text: '', is_correct: true, order_index: 1 },
                    { answer_text: '', is_correct: false, order_index: 2 },
                    { answer_text: '', is_correct: false, order_index: 3 },
                    { answer_text: '', is_correct: false, order_index: 4 }
                  ]
                }
              ]
            }
          }
        ]
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
          order_index: prev.sections.length + 1,
          duration_minutes: null,
          media: [],
          lessons: [
            {
              title: '',
              content: '',
              duration_minutes: null,
              order_index: 1,
              quiz: {
                title: '',
                passing_score: 70,
                questions: [
                  {
                    question_text: '',
                    question_type: 'single_choice',
                    points: 10,
                    order_index: 1,
                    answers: [
                      { answer_text: '', is_correct: true, order_index: 1 },
                      { answer_text: '', is_correct: false, order_index: 2 },
                      { answer_text: '', is_correct: false, order_index: 3 },
                      { answer_text: '', is_correct: false, order_index: 4 }
                    ]
                  }
                ]
              }
            }
          ]
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

  const addLesson = (sectionIndex) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
            ...section,
            lessons: [
              ...section.lessons,
              {
                title: '',
                content: '',
                duration_minutes: null,
                order_index: section.lessons.length + 1,
                quiz: {
                  title: '',
                  passing_score: 70,
                  questions: [
                    {
                      question_text: '',
                      question_type: 'single_choice',
                      points: 10,
                      order_index: 1,
                      answers: [
                        { answer_text: '', is_correct: true, order_index: 1 },
                        { answer_text: '', is_correct: false, order_index: 2 },
                        { answer_text: '', is_correct: false, order_index: 3 },
                        { answer_text: '', is_correct: false, order_index: 4 }
                      ]
                    }
                  ]
                }
              }
            ]
          }
          : section
      )
    }));
  };

  const removeLesson = (sectionIndex, lessonIndex) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
            ...section,
            lessons: section.lessons.filter((_, li) => li !== lessonIndex).map((l, li) => ({
              ...l,
              order_index: li + 1
            }))
          }
          : section
      )
    }));
  };

  const updateLesson = (sectionIndex, lessonIndex, field, value) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
            ...section,
            lessons: section.lessons.map((l, li) =>
              li === lessonIndex ? { ...l, [field]: value } : l
            )
          }
          : section
      )
    }));
  };

  const addQuestion = (sectionIndex, lessonIndex) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
            ...section,
            lessons: section.lessons.map((lesson, li) =>
              li === lessonIndex
                ? {
                  ...lesson,
                  quiz: {
                    ...lesson.quiz,
                    questions: [
                      ...lesson.quiz.questions,
                      {
                        question_text: '',
                        question_type: 'single_choice',
                        points: 10,
                        order_index: lesson.quiz.questions.length + 1,
                        answers: [
                          { answer_text: '', is_correct: true, order_index: 1 },
                          { answer_text: '', is_correct: false, order_index: 2 },
                          { answer_text: '', is_correct: false, order_index: 3 },
                          { answer_text: '', is_correct: false, order_index: 4 }
                        ]
                      }
                    ]
                  }
                }
                : lesson
            )
          }
          : section
      )
    }));
  };

  const removeQuestion = (sectionIndex, lessonIndex, questionIndex) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
            ...section,
            lessons: section.lessons.map((lesson, li) =>
              li === lessonIndex
                ? {
                  ...lesson,
                  quiz: {
                    ...lesson.quiz,
                    questions: lesson.quiz.questions
                      .filter((_, qi) => qi !== questionIndex)
                      .map((q, qi) => ({ ...q, order_index: qi + 1 }))
                  }
                }
                : lesson
            )
          }
          : section
      )
    }));
  };

  const updateQuestion = (sectionIndex, lessonIndex, questionIndex, field, value) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
            ...section,
            lessons: section.lessons.map((lesson, li) =>
              li === lessonIndex
                ? {
                  ...lesson,
                  quiz: {
                    ...lesson.quiz,
                    questions: lesson.quiz.questions.map((q, qi) =>
                      qi === questionIndex ? { ...q, [field]: value } : q
                    )
                  }
                }
                : lesson
            )
          }
          : section
      )
    }));
  };

  const updateQuizField = (sectionIndex, lessonIndex, field, value) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
            ...section,
            lessons: section.lessons.map((lesson, li) =>
              li === lessonIndex
                ? {
                  ...lesson,
                  quiz: {
                    ...lesson.quiz,
                    [field]: value
                  }
                }
                : lesson
            )
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
        return courseData.sections.length > 0 && courseData.sections.every(s =>
          s.title.trim() !== '' &&
          s.lessons.length > 0 &&
          s.lessons.every(l => l.title.trim() !== '' && l.content.trim() !== '')
        );
      case 3:
        return courseData.sections.every(s =>
          s.lessons.every(l =>
            !l.quiz || (
              l.quiz.questions.every(q =>
                q.question_text.trim() !== '' &&
                q.answers.length > 0 &&
                q.answers.every(a => a.answer_text.trim() !== '') &&
                q.answers.some(a => a.is_correct)
              )
            )
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
        name: courseData.name.trim(),
        description: courseData.description.trim(),
        level: courseData.level,
        duration_minutes: courseData.duration_minutes || 0,
        image_url: courseData.image_url || null,
        tags: [
          `cat:${courseData.category}`,
          ...courseData.tags.filter(tag => tag.trim() !== '').map(tag => tag.trim().toLowerCase())
        ],
        sections: courseData.sections.map(section => ({
          title: section.title.trim(),
          order_index: section.order_index,
          duration_minutes: section.duration_minutes || 0,
          lessons: section.lessons.map(lesson => ({
            title: lesson.title.trim(),
            content: lesson.content.trim(),
            order_index: lesson.order_index,
            duration_minutes: lesson.duration_minutes || 0,
            quiz: lesson.quiz && lesson.quiz.questions.length > 0 ? {
              title: lesson.quiz.title || `${lesson.title} Quiz`,
              passing_score: lesson.quiz.passing_score || 70,
              questions: lesson.quiz.questions.map(q => ({
                question_text: q.question_text.trim(),
                question_type: q.question_type,
                order_index: q.order_index,
                points: q.points || 10,
                answers: q.answers.map(a => ({
                  answer_text: a.answer_text.trim(),
                  is_correct: a.is_correct,
                  order_index: a.order_index
                }))
              }))
            } : null
          }))
        }))
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
            order_index: 1,
            duration_minutes: null,
            media: [],
            lessons: [
              {
                title: '',
                content: '',
                duration_minutes: null,
                order_index: 1,
                quiz: {
                  title: '',
                  passing_score: 70,
                  questions: [
                    {
                      question_text: '',
                      question_type: 'single_choice',
                      points: 10,
                      order_index: 1,
                      answers: [
                        { answer_text: '', is_correct: true, order_index: 1 },
                        { answer_text: '', is_correct: false, order_index: 2 },
                        { answer_text: '', is_correct: false, order_index: 3 },
                        { answer_text: '', is_correct: false, order_index: 4 }
                      ]
                    }
                  ]
                }
              }
            ]
          }
        ]
      });
      setCurrentStep(1);
    } catch (error) {
      console.error('Submit error:', error);
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
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${currentStep > step.id
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
                        Category <span className="text-red-500">*</span>
                      </span>
                      <select
                        value={courseData.category}
                        onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-reddit-cardHover border border-reddit-border rounded-lg text-white focus:outline-none focus:border-reddit-orange transition-colors"
                      >
                        <option value="STEM">STEM</option>
                        <option value="Tech">Tech</option>
                        <option value="Languages">Languages</option>
                        <option value="Arts">Arts</option>
                      </select>
                    </label>
                  </div>

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

          {/* Step 2: Sections & Lessons */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Sections & Lessons</h2>
                <p className="text-reddit-placeholder">Organize your course into sections and detailed lessons</p>
              </div>

              <div className="max-w-4xl mx-auto space-y-8">
                {courseData.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="bg-reddit-card border border-reddit-border rounded-xl p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-reddit-orange/20 text-reddit-orange flex items-center justify-center font-bold">
                          {sectionIndex + 1}
                        </div>
                        <h3 className="font-bold text-lg">Section Details</h3>
                      </div>
                      {courseData.sections.length > 1 && (
                        <button
                          onClick={() => removeSection(sectionIndex)}
                          className="p-2 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors"
                          title="Remove Section"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>

                    {/* Section Title */}
                    <div>
                      <label className="block">
                        <span className="text-sm font-semibold mb-2 block">
                          Section Title <span className="text-red-500">*</span>
                        </span>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                          placeholder="e.g., Introduction to the Course"
                          className="w-full px-4 py-3 bg-reddit-cardHover border border-reddit-border rounded-lg text-white placeholder-reddit-placeholder focus:outline-none focus:border-reddit-orange transition-colors"
                        />
                      </label>
                    </div>

                    {/* Lessons within this section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-reddit-placeholder">Lessons</h4>
                        <button
                          onClick={() => addLesson(sectionIndex)}
                          className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-reddit-cardHover hover:bg-reddit-border border border-reddit-border rounded-lg font-medium transition-colors"
                        >
                          <Plus size={14} />
                          Add Lesson
                        </button>
                      </div>

                      <div className="space-y-4">
                        {section.lessons.map((lesson, lessonIndex) => (
                          <div key={lessonIndex} className="bg-reddit-dark/50 border border-reddit-border rounded-lg p-4 space-y-4 relative">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-reddit-orange">Lesson {lessonIndex + 1}</span>
                              {section.lessons.length > 1 && (
                                <button
                                  onClick={() => removeLesson(sectionIndex, lessonIndex)}
                                  className="text-reddit-placeholder hover:text-red-500 transition-colors"
                                >
                                  <X size={14} />
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="md:col-span-2">
                                <label className="block">
                                  <span className="text-xs font-semibold mb-1.5 block">Lesson Title</span>
                                  <input
                                    type="text"
                                    value={lesson.title}
                                    onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'title', e.target.value)}
                                    placeholder="e.g., What is logic?"
                                    className="w-full px-3 py-2 bg-reddit-cardHover border border-reddit-border rounded-lg text-sm text-white focus:outline-none focus:border-reddit-orange transition-colors"
                                  />
                                </label>
                              </div>
                              <div className="md:col-span-2">
                                <label className="block">
                                  <span className="text-xs font-semibold mb-1.5 block">Content (Markdown)</span>
                                  <textarea
                                    value={lesson.content}
                                    onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'content', e.target.value)}
                                    placeholder="Enter lesson content..."
                                    rows={4}
                                    className="w-full px-3 py-2 bg-reddit-cardHover border border-reddit-border rounded-lg text-sm text-white focus:outline-none focus:border-reddit-orange transition-colors resize-none"
                                  />
                                </label>
                              </div>
                              <div>
                                <label className="block">
                                  <span className="text-xs font-semibold mb-1.5 block">Duration (mins)</span>
                                  <input
                                    type="number"
                                    value={lesson.duration_minutes || ''}
                                    onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'duration_minutes', e.target.value ? parseInt(e.target.value) : null)}
                                    placeholder="15"
                                    className="w-full px-3 py-2 bg-reddit-cardHover border border-reddit-border rounded-lg text-sm text-white focus:outline-none focus:border-reddit-orange transition-colors"
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addSection}
                  className="w-full py-4 border-2 border-dashed border-reddit-border hover:border-reddit-orange rounded-xl text-reddit-placeholder hover:text-reddit-orange transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Plus size={20} />
                  Add New Section
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
                <h2 className="text-2xl font-bold mb-2">Lesson Quizzes</h2>
                <p className="text-reddit-placeholder">Add assessments to your lessons to track student progress</p>
              </div>

              <div className="max-w-5xl mx-auto space-y-12">
                {courseData.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="space-y-6">
                    <div className="flex items-center gap-4 bg-reddit-card border border-reddit-border p-4 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-reddit-orange/10 text-reddit-orange flex items-center justify-center font-bold text-lg">
                        {sectionIndex + 1}
                      </div>
                      <h3 className="font-bold text-xl">{section.title || `Section ${sectionIndex + 1}`}</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-8 pl-4 border-l-2 border-reddit-border/30">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className="bg-reddit-card border border-reddit-border rounded-xl p-6 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-reddit-orange" />
                          <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <span className="text-reddit-placeholder text-sm">Lesson {lessonIndex + 1}:</span>
                            {lesson.title || "Untitled Lesson"}
                          </h4>

                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block">
                                  <span className="text-sm font-semibold mb-2 block">Quiz Title</span>
                                  <input
                                    type="text"
                                    value={lesson.quiz.title}
                                    onChange={(e) => updateQuizField(sectionIndex, lessonIndex, 'title', e.target.value)}
                                    placeholder="e.g., Module Assessment"
                                    className="w-full px-4 py-2 bg-reddit-cardHover border border-reddit-border rounded-lg text-white placeholder-reddit-placeholder focus:outline-none focus:border-reddit-orange transition-colors"
                                  />
                                </label>
                              </div>
                              <div>
                                <label className="block">
                                  <span className="text-sm font-semibold mb-2 block">Passing Score (%)</span>
                                  <input
                                    type="number"
                                    value={lesson.quiz.passing_score || ''}
                                    onChange={(e) => updateQuizField(sectionIndex, lessonIndex, 'passing_score', e.target.value ? parseInt(e.target.value) : null)}
                                    placeholder="70"
                                    className="w-full px-4 py-2 bg-reddit-cardHover border border-reddit-border rounded-lg text-white placeholder-reddit-placeholder focus:outline-none focus:border-reddit-orange transition-colors"
                                  />
                                </label>
                              </div>
                            </div>

                            <div className="space-y-6">
                              <div className="flex items-center justify-between">
                                <h5 className="text-sm font-bold uppercase tracking-widest text-reddit-placeholder">Questions</h5>
                                <button
                                  onClick={() => addQuestion(sectionIndex, lessonIndex)}
                                  className="text-xs bg-reddit-orange hover:bg-reddit-orange/90 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors"
                                >
                                  <Plus size={14} />
                                  Add Question
                                </button>
                              </div>

                              {lesson.quiz.questions.map((question, questionIndex) => (
                                <div key={questionIndex} className="bg-reddit-cardHover border border-reddit-border rounded-lg p-4 space-y-4">
                                  <div className="flex items-center justify-between">
                                    <h6 className="font-bold text-sm">Q{questionIndex + 1}</h6>
                                    {lesson.quiz.questions.length > 1 && (
                                      <button
                                        onClick={() => removeQuestion(sectionIndex, lessonIndex, questionIndex)}
                                        className="text-reddit-placeholder hover:text-red-500 transition-colors"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    )}
                                  </div>

                                  <textarea
                                    value={question.question_text}
                                    onChange={(e) => updateQuestion(sectionIndex, lessonIndex, questionIndex, 'question_text', e.target.value)}
                                    placeholder="Type your question..."
                                    rows={2}
                                    className="w-full px-4 py-2 bg-reddit-dark border border-reddit-border rounded-lg text-sm text-white focus:outline-none focus:border-reddit-orange transition-colors resize-none"
                                  />

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <select
                                      value={question.question_type}
                                      onChange={(e) => updateQuestion(sectionIndex, lessonIndex, questionIndex, 'question_type', e.target.value)}
                                      className="w-full px-4 py-2 bg-reddit-dark border border-reddit-border rounded-lg text-sm text-white focus:outline-none focus:border-reddit-orange transition-colors"
                                    >
                                      <option value="single_choice">Single Choice</option>
                                      <option value="multiple_choice">Multiple Choice</option>
                                    </select>
                                    <input
                                      type="number"
                                      value={question.points || ''}
                                      onChange={(e) => updateQuestion(sectionIndex, lessonIndex, questionIndex, 'points', e.target.value ? parseInt(e.target.value) : null)}
                                      placeholder="Points (e.g., 10)"
                                      className="w-full px-4 py-2 bg-reddit-dark border border-reddit-border rounded-lg text-sm text-white focus:outline-none focus:border-reddit-orange transition-colors"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    {question.answers.map((answer, answerIndex) => (
                                      <div key={answerIndex} className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded bg-reddit-dark flex items-center justify-center text-[10px] font-bold text-reddit-placeholder">
                                          {String.fromCharCode(65 + answerIndex)}
                                        </div>
                                        <input
                                          type="text"
                                          value={answer.answer_text}
                                          onChange={(e) => {
                                            const newAnswers = [...question.answers];
                                            newAnswers[answerIndex].answer_text = e.target.value;
                                            updateQuestion(sectionIndex, lessonIndex, questionIndex, 'answers', newAnswers);
                                          }}
                                          placeholder="Answer option..."
                                          className="flex-1 px-3 py-1.5 bg-reddit-dark border border-reddit-border rounded-lg text-xs text-white focus:outline-none focus:border-reddit-orange transition-colors"
                                        />
                                        <input
                                          type={question.question_type === 'single_choice' ? 'radio' : 'checkbox'}
                                          name={`q-${sectionIndex}-${lessonIndex}-${questionIndex}`}
                                          checked={answer.is_correct}
                                          onChange={(e) => {
                                            const newAnswers = [...question.answers];
                                            if (question.question_type === 'single_choice') {
                                              newAnswers.forEach((a, i) => a.is_correct = i === answerIndex);
                                            } else {
                                              newAnswers[answerIndex].is_correct = e.target.checked;
                                            }
                                            updateQuestion(sectionIndex, lessonIndex, questionIndex, 'answers', newAnswers);
                                          }}
                                          className="w-4 h-4 accent-reddit-orange"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Preview/Review */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold mb-2">Review Course</h2>
                <p className="text-reddit-placeholder">Check your course details before publishing</p>
              </div>

              <div className="max-w-3xl mx-auto space-y-8">
                {/* Course Overview */}
                <div className="bg-reddit-card border border-reddit-border rounded-xl overflow-hidden">
                  <div className="h-48 bg-reddit-cardHover relative">
                    {courseData.image_url ? (
                      <img src={courseData.image_url} alt="Course" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-reddit-placeholder">
                        <BookOpen size={48} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-reddit-orange rounded text-[10px] font-bold uppercase tracking-wider">
                          {courseData.level}
                        </span>
                        {courseData.duration_minutes && (
                          <span className="text-xs text-reddit-placeholder">
                            {courseData.duration_minutes} mins
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold">{courseData.name || "Untitled Course"}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-reddit-placeholder text-sm mb-4">
                      {courseData.description || "No description provided."}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {courseData.tags.map((tag, i) => tag && (
                        <span key={i} className="px-3 py-1 bg-reddit-cardHover border border-reddit-border rounded-full text-xs text-reddit-placeholder">
                          #{tag.toLowerCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Structure Overview */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <CheckCircle size={20} className="text-green-500" />
                    Course Structure
                  </h3>
                  <div className="space-y-4">
                    {courseData.sections.map((section, si) => (
                      <div key={si} className="bg-reddit-card border border-reddit-border rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-reddit-placeholder">Section {si + 1}: {section.title}</h4>
                          <span className="text-xs bg-reddit-cardHover px-2 py-1 rounded border border-reddit-border">
                            {section.lessons.length} Lessons
                          </span>
                        </div>
                        <div className="space-y-2">
                          {section.lessons.map((lesson, li) => (
                            <div key={li} className="flex items-center justify-between py-2 border-t border-reddit-border/30 text-sm">
                              <span className="text-white">{lesson.title}</span>
                              <div className="flex items-center gap-3">
                                {lesson.quiz && lesson.quiz.questions.length > 0 && (
                                  <span className="text-[10px] text-green-500 font-bold uppercase tracking-tighter">Quiz Included</span>
                                )}
                                <span className="text-reddit-placeholder text-xs">{lesson.duration_minutes || 0}m</span>
                              </div>
                            </div>
                          ))}
                        </div>
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
                        {!validateStep(2) && <li>• All sections must have a title and at least one lesson</li>}
                        {!validateStep(3) && <li>• Quiz questions must have text, at least one answer, and a correct answer marked</li>}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle className="text-green-500" size={20} />
                    <span className="text-green-400 font-medium">All validations passed! Ready to publish.</span>
                  </div>
                )}

                {/* Final Actions */}
                <div className="flex flex-col gap-4 pt-8">
                  <div className="bg-reddit-orange/10 border border-reddit-orange/20 rounded-xl p-4 flex items-start gap-4">
                    <AlertCircle className="text-reddit-orange mt-0.5" size={20} />
                    <p className="text-sm text-reddit-placeholder">
                      Once published, your course will be available in the Course Bank for all students.
                    </p>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !validateStep(1) || !validateStep(2) || !validateStep(3)}
                    className="w-full py-4 bg-reddit-orange hover:bg-reddit-orange/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Publishing Course...</span>
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        <span>Publish Course & Save</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="max-w-6xl mx-auto px-4 py-8 flex items-center justify-between border-t border-reddit-border mt-12 mb-20">
          <button
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            className={`px-6 py-2.5 rounded-lg font-bold transition-colors ${currentStep === 1
              ? 'opacity-0 pointer-events-none'
              : 'bg-reddit-cardHover hover:bg-reddit-border text-white border border-reddit-border'
              }`}
          >
            Previous Step
          </button>

          <button
            onClick={() => {
              if (currentStep < 4) {
                if (validateStep(currentStep)) {
                  setCurrentStep(prev => prev + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  toast.error('Please complete all required fields correctly.');
                }
              }
            }}
            className={`px-8 py-2.5 bg-reddit-orange hover:bg-reddit-orange/90 rounded-lg font-bold transition-all ${currentStep === 4 ? 'hidden' : 'block'
              }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseAdmin;
