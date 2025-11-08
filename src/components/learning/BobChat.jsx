import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot } from 'lucide-react';
import { Button } from '../ui/Button';

export const BobChat = ({ lessonContext }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bob',
      text: `Hey there! How can I help you understand ${lessonContext?.title || 'this topic'} today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: input
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const bobResponse = {
        id: Date.now() + 1,
        sender: 'bob',
        text: `That's a great question! Let me explain it in simpler terms. ${lessonContext?.title} is all about understanding the fundamentals. Would you like me to provide an example?`
      };
      
      setMessages(prev => [...prev, bobResponse]);
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
    <div className="w-80 h-full bg-dark-gray border-l border-white/5 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Ask Studly (Bob)</h3>
            <p className="text-xs text-gray-400">AI Learning Assistant</p>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[80%] p-3 rounded-lg
                  ${message.sender === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-white/5 text-gray-300'
                  }
                `}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white/5 p-3 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="p-4 border-t border-white/5">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Bob anything..."
            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg
                     text-white placeholder-gray-500 focus:outline-none focus:border-primary
                     transition-smooth"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            size="sm"
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Quick actions */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setInput('Explain simpler')}
            className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-smooth"
          >
            Explain simpler
          </button>
          <button
            onClick={() => setInput('Give me an example')}
            className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-smooth"
          >
            Give example
          </button>
        </div>
      </div>
    </div>
  );
};