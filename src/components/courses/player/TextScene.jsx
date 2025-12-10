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
                className="rounded-lg !bg-reddit-cardHover !my-4"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-reddit-cardHover px-1.5 py-0.5 rounded text-reddit-orange" {...props}>
                {children}
              </code>
            );
          },
          // Headings
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-white mb-4 mt-6">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-white mb-3 mt-5">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-white mb-2 mt-4">{children}</h3>
          ),
          // Paragraphs
          p: ({ children }) => (
            <p className="text-reddit-placeholder leading-relaxed mb-4">{children}</p>
          ),
          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-2 text-reddit-placeholder">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2 text-reddit-placeholder">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="ml-2">{children}</li>
          ),
          // Strong and emphasis
          strong: ({ children }) => (
            <strong className="text-white font-semibold">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="text-reddit-orange">{children}</em>
          ),
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-reddit-blue hover:underline"
            >
              {children}
            </a>
          ),
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-reddit-orange pl-4 italic text-reddit-placeholder my-4">
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
          className="inline-block w-0.5 h-5 bg-reddit-orange ml-0.5 align-middle"
        />
      )}
    </div>
  );
};

export default TextScene;
