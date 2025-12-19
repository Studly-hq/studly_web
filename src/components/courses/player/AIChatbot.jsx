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
    <div className="h-1/2 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-reddit-border bg-reddit-card/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-reddit-orange/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-reddit-orange" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
            <p className="text-xs text-reddit-placeholder">
              {currentSectionTitle || 'Ready to help'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-reddit-orange/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-reddit-orange" />
                </div>
              )}

              <div
                className={`
                  max-w-[80%] px-3 py-2 rounded-lg text-sm
                  ${message.role === 'user'
                    ? 'bg-reddit-orange text-white'
                    : 'bg-reddit-cardHover text-reddit-placeholder border border-reddit-border'
                  }
                `}
              >
                {message.content}
              </div>

              {message.role === 'user' && (
                <div className="w-6 h-6 rounded-full bg-reddit-blue/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-3.5 h-3.5 text-reddit-blue" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2"
          >
            <div className="w-6 h-6 rounded-full bg-reddit-orange/20 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-reddit-orange" />
            </div>
            <div className="bg-reddit-cardHover border border-reddit-border px-3 py-2 rounded-lg">
              <div className="flex gap-1">
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 bg-reddit-placeholder rounded-full"
                />
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-reddit-placeholder rounded-full"
                />
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-reddit-placeholder rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-reddit-border bg-reddit-card/30">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            disabled={isTyping}
            className="flex-1 bg-reddit-cardHover border border-reddit-border rounded-lg px-3 py-2 text-sm text-white placeholder-reddit-placeholder focus:outline-none focus:border-reddit-orange transition-colors disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`
              w-10 h-10 rounded-lg flex items-center justify-center transition-colors
              ${input.trim() && !isTyping
                ? 'bg-reddit-orange hover:bg-reddit-orange/90 text-white'
                : 'bg-reddit-cardHover text-reddit-placeholder cursor-not-allowed'
              }
            `}
          >
            {isTyping ? (
              <LoadingSpinner size={16} color="#FF4500" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
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
