import React from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { Trophy, ArrowRight } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

export const CompletionModal = ({ isOpen, onClose, sectionData, courseData }) => {
  const navigate = useNavigate();
  const [windowSize, setWindowSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  React.useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleBackToDashboard = () => {
    onClose();
    navigate('/dashboard');
  };
  
  const handleNextSection = () => {
    onClose();
    // Logic to load next section
  };
  
  const isLastSection = sectionData?.isLast || false;
  
  return (
    <>
      {isOpen && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}
      
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <div className="text-center space-y-6 py-8">
          {/* Trophy Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
          </motion.div>
          
          {/* Congratulations */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-2"
            >
              {isLastSection 
                ? `🎉 You've completed ${courseData?.title}!`
                : 'Section Complete!'
              }
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400"
            >
              {isLastSection
                ? 'Congratulations on finishing the entire course!'
                : `Great job! You've mastered ${sectionData?.title}`
              }
            </motion.p>
          </div>
          
          {/* Aura Points */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-xl p-6"
          >
            <div className="text-sm text-gray-400 mb-2">Aura Points Earned</div>
            <div className="text-4xl font-bold text-primary">
              +{sectionData?.auraPoints || 10}
            </div>
          </motion.div>
          
          {/* Motivational Message */}
          {!isLastSection && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-300"
            >
              Nice! You're {courseData?.sectionsRemaining || 1} section away from mastering {courseData?.title}!
            </motion.p>
          )}
          
          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex gap-3 pt-4"
          >
            <Button
              variant="secondary"
              onClick={handleBackToDashboard}
              className="flex-1"
            >
              Back to Dashboard
            </Button>
            
            {!isLastSection ? (
              <Button
                onClick={handleNextSection}
                className="flex-1 flex items-center justify-center gap-2"
              >
                Next Section
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={() => navigate('/courses')}
                className="flex-1 flex items-center justify-center gap-2"
              >
                Explore More
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </motion.div>
        </div>
      </Modal>
    </>
  );
};