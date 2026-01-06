import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';

const TextScene = ({ content, typedContent, showCursor, isTyping }) => {
  const containerRef = useRef(null);

  // Auto-scroll to keep typed content in view
  useEffect(() => {
    if (containerRef.current && isTyping) {
      const container = containerRef.current;
      const shouldScroll = container.scrollHeight - container.scrollTop - container.clientHeight < 100;

      if (shouldScroll) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [typedContent, isTyping]);

  return (
    <div
      ref={containerRef}
      className="prose prose-invert max-w-none overflow-y-auto"
    >
      <ReactMarkdown
        components={{
          // Code blocks with syntax highlighting
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-lg !bg-white/5 !my-6"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-white/10 px-1.5 py-0.5 rounded text-reddit-orange font-mono" {...props}>
                {children}
              </code>
            );
          },
          // Headings
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-white mb-6 mt-8 tracking-tight">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-white/95 mb-4 mt-6 tracking-tight">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-white/90 mb-3 mt-5">{children}</h3>
          ),
          // Paragraphs
          p: ({ children }) => (
            <p className="text-reddit-textMuted leading-7 mb-6 text-lg">{children}</p>
          ),
          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-4 mb-6 space-y-2 text-reddit-textMuted leading-relaxed">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-4 mb-6 space-y-2 text-reddit-textMuted leading-relaxed">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="pl-1">{children}</li>
          ),
          // Strong and emphasis
          strong: ({ children }) => (
            <strong className="text-white font-semibold">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="text-reddit-orange not-italic">{children}</em>
          ),
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-reddit-blue hover:text-white transition-colors underline decoration-reddit-blue/30 hover:decoration-white/50"
            >
              {children}
            </a>
          ),
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-reddit-orange pl-6 my-6 italic text-white/70">
              {children}
            </blockquote>
          )
        }}
      >
        {typedContent}
      </ReactMarkdown>

      {/* Blinking cursor */}
      {showCursor && isTyping && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-block w-0.5 h-6 bg-reddit-orange ml-1 align-middle"
        />
      )}
    </div>
  );
};

export default TextScene;
