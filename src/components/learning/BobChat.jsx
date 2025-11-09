import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiX } from 'react-icons/fi';

const BobChat = ({ isOpen, onClose, isMobile = false }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey there! I'm Bob, your friendly AI study buddy. How can I help you understand this topic today? 😊",
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
      "That's a great question! While I'm just a prototype right now, I can tell you that this concept builds on what you learned in the previous section. Keep going, you're doing awesome! 🌟",
      "I love your curiosity! This topic is super important because it connects to everything else you'll learn. Want to go over any specific part again?",
      "Hmm, interesting question! The key thing to remember here is that practice makes perfect. Try working through another example and it'll start to click! 💡",
      "Great thinking! That's exactly the kind of question that shows you're really understanding the material. Keep it up!",
      "I'm here to help! While I'm a prototype AI, I can tell you that breaking down complex problems into smaller steps is always a good strategy. You've got this! 🚀"
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b-2 border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <h3 className="font-semibold text-gray-900">Ask Studly (Bob)</h3>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="text-gray-600" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-gray-50">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'bob'
                  ? 'bg-blue-50 border-2 border-blue-200 text-gray-800'
                  : 'bg-white border-2 border-gray-200 text-gray-800'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-blue-50 border-2 border-blue-200 p-3 rounded-lg">
              <div className="flex gap-1">
                <motion.div
                  className="w-2 h-2 bg-blue-400 rounded-full"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 bg-blue-400 rounded-full"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 bg-blue-400 rounded-full"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0, delay: 0.4 }}
                />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t-2 border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Bob a question..."
            className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border-2 border-blue-600"
          >
            <FiSend />
          </button>
        </div>
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
              className="fixed inset-0 bg-black/50 z-40"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-4 bottom-4 top-20 bg-white rounded-2xl z-50 overflow-hidden"
            >
              {chatContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className="h-full bg-white border-l-2 border-gray-200">
      {chatContent}
    </div>
  );
};

export default BobChat;