import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { 
  HTMLIllustration, 
  CSSIllustration, 
  JavaScriptIllustration, 
  PythonIllustration,
  MathIllustration 
} from '../../illustrations';

const illustrationMap = {
  html: HTMLIllustration,
  css: CSSIllustration,
  javascript: JavaScriptIllustration,
  python: PythonIllustration,
  math: MathIllustration
};

export const CourseOverviewModal = ({ isOpen, onClose, course }) => {
  const navigate = useNavigate();
  
  if (!course) return null;
  
  const Illustration = illustrationMap[course.illustration] || HTMLIllustration;
  
  const handleStartCourse = () => {
    onClose();
    // Small delay for smooth transition
    setTimeout(() => {
      navigate(`/learn/${course.id}`);
    }, 200);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-6">
        {/* Illustration */}
        <div className="h-48 rounded-xl overflow-hidden bg-primary/5 flex items-center justify-center p-8">
          <Illustration className="w-full h-full" />
        </div>
        
        {/* Course Info */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {course.title}
          </h2>
          <p className="text-gray-400 text-lg">
            {course.description}
          </p>
        </div>
        
        {/* Meta Info */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Duration:</span>
            <span className="text-white font-medium">{course.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Level:</span>
            <span className="text-white font-medium">{course.difficulty}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Aura Points:</span>
            <span className="text-primary font-medium">{course.totalAuraPoints}</span>
          </div>
        </div>
        
        {/* Sections List */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">
            Course Sections
          </h3>
          <div className="space-y-3">
            {course.sections.map((section) => (
              <div 
                key={section.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-smooth"
              >
                <CheckCircle2 className="w-5 h-5 text-gray-500" />
                <span className="text-white font-medium flex-1">
                  Section {section.id}: {section.title}
                </span>
                <span className="text-sm text-gray-400">
                  +{section.auraPoints} pts
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button 
            variant="secondary" 
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleStartCourse}
            className="flex-1"
          >
            Start Course
          </Button>
        </div>
      </div>
    </Modal>
  );
};