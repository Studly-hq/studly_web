import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiX, FiMessageSquare, FiUser } from 'react-icons/fi';

const BobChat = ({ isOpen, onClose, isMobile = false }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey there! I'm Bob, your friendly AI study buddy. How can I help you understand this topic today?",
      sender: 'bob',
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBobResponse = (userMessage) => {
    const responses = [
      "That's a great question! While I'm just a prototype right now, I can tell you that this concept builds on what you learned in the previous section. Keep going, you're doing awesome!",
      "I love your curiosity! This topic is super important because it connects to everything else you'll learn. Want to go over any specific part again?",
      "Hmm, interesting question! The key thing to remember here is that practice makes perfect. Try working through another example and it'll start to click!",
      "Great thinking! That's exactly the kind of question that shows you're really understanding the material. Keep it up!",
      "I'm here to help! While I'm a prototype AI, I can tell you that breaking down complex problems into smaller steps is always a good strategy. You've got this!"
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate Bob thinking and responding
    setTimeout(() => {
      const bobResponse = {
        id: Date.now() + 1,
        text: generateBobResponse(inputValue),
        sender: 'bob',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, bobResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const chatContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <FiMessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Ask Studly</h3>
            <p className="text-sm text-slate-500">Your AI Study Buddy</p>
          </div>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-300"
          >
            <FiX className="text-slate-600 w-5 h-5" />
          </button>
        )}
      </div>

      {/* Enhanced Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin bg-slate-50/50">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex items-start gap-3 max-w-[85%]">
              {/* Bob's Avatar */}
              {message.sender === 'bob' && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <FiMessageSquare className="w-4 h-4 text-white" />
                </div>
              )}
              
              {/* Message Bubble */}
              <div
                className={`p-4 rounded-2xl ${
                  message.sender === 'bob'
                    ? 'bg-white border border-slate-200 text-slate-800'
                    : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.text}
                </p>
                <div className={`text-xs mt-2 ${
                  message.sender === 'bob' ? 'text-slate-500' : 'text-blue-100'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>

              {/* User's Avatar */}
              {message.sender === 'user' && (
                <div className="w-8 h-8 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <FiUser className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* Enhanced Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-start gap-3 max-w-[85%]">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <FiMessageSquare className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-2xl">
                <div className="flex gap-1.5">
                  <motion.div
                    className="w-2 h-2 bg-blue-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-blue-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-blue-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0, delay: 0.4 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <div className="p-6 border-t border-slate-200 bg-white">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about this topic..."
              className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 placeholder-slate-500 pr-12"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
            >
              <FiSend className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3 text-center">
          Bob can help explain concepts, provide examples, and answer your questions
        </p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-4 bottom-4 top-20 bg-white rounded-2xl z-50 overflow-hidden border border-slate-200"
            >
              {chatContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className="h-full bg-white border-l border-slate-200">
      {chatContent}
    </div>
  );
};

export default BobChat;