import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User } from 'lucide-react';
import LoadingSpinner from '../../common/LoadingSpinner';

const AIChatbot = ({ topicTitle, currentSectionTitle }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: `Hi! I'm your AI learning assistant for "${topicTitle}". Ask me anything about what you're learning!`
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse = generateMockResponse(userMessage.content, topicTitle, currentSectionTitle);

      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: aiResponse
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-1/2 flex flex-col bg-reddit-dark">
      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-reddit-orange to-pink-500 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-reddit-dark rounded-full"></div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">AI Tutor</h3>
          <p className="text-[10px] text-reddit-textMuted uppercase tracking-wider font-medium">
            {currentSectionTitle ? 'Topic Active' : 'Online'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5 text-reddit-textMuted" />
                </div>
              )}

              <div
                className={`
                  max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                  ${message.role === 'user'
                    ? 'bg-reddit-orange text-white rounded-br-sm shadow-lg shadow-reddit-orange/10'
                    : 'bg-white/5 text-white/90 rounded-bl-sm border border-white/5'
                  }
                `}
              >
                {message.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="w-3.5 h-3.5 text-reddit-textMuted" />
            </div>
            <div className="bg-white/5 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1.5 h-2 items-center">
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                  className="w-1.5 h-1.5 bg-reddit-textMuted rounded-full"
                />
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                  className="w-1.5 h-1.5 bg-reddit-textMuted rounded-full"
                />
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                  className="w-1.5 h-1.5 bg-reddit-textMuted rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 pt-2">
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything..."
            disabled={isTyping}
            className="w-full bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/5 rounded-full pl-5 pr-12 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-reddit-orange/50 transition-all duration-300"
          />
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`
              w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200
              ${input.trim() && !isTyping
                  ? 'bg-reddit-orange hover:bg-reddit-orange/90 text-white shadow-lg shadow-reddit-orange/20 scale-100'
                  : 'bg-transparent text-white/10 scale-90'
                }
            `}
            >
              {isTyping ? (
                <LoadingSpinner size={14} color="#fff" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock response generator (replace with actual API)
const generateMockResponse = (question, topicTitle, sectionTitle) => {
  const responses = [
    `That's a great question! In the context of "${sectionTitle}", ${question.toLowerCase()} is an important concept to understand.`,
    `Let me help you with that. When learning about "${topicTitle}", it's helpful to think about how this relates to what you've already learned.`,
    `Good question! This topic in "${sectionTitle}" builds on previous concepts. Would you like me to explain it in more detail?`,
    `I can help clarify that for you. In this section, we're focusing on the fundamentals that will help you understand more advanced topics later.`,
    `That's an excellent observation! Keep asking questions like this as you progress through "${topicTitle}".`
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};

export default AIChatbot;
