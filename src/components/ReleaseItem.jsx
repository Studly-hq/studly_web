import React from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Sparkles, ArrowRightCircle } from "lucide-react";

const getTagColor = (tag) => {
  switch (tag.toLowerCase()) {
    case "upcoming":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "improvement":
    case "ux":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "major":
    case "launch":
      return "bg-reddit-orange/20 text-reddit-orange border-reddit-orange/30";
    default:
      return "bg-green-500/20 text-green-400 border-green-500/30";
  }
};

const ReleaseItem = ({ release, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative pl-8 sm:pl-32 py-10 group"
    >
      {/* Timeline Node */}
      <div className="absolute left-[11px] sm:left-[111px] top-[48px] w-4 h-4 rounded-full bg-reddit-card border-4 border-reddit-bg z-10 group-hover:border-reddit-orange transition-colors duration-300" />
      
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Date and Version (Desktop - Left Side) */}
        <div className="hidden sm:flex w-24 flex-col items-end pt-1">
          <span className="text-sm font-semibold text-reddit-textMuted uppercase tracking-wider">{release.date}</span>
          <span className="text-xl font-heading font-bold text-reddit-text mt-1">{release.version}</span>
        </div>

        {/* Date and Version (Mobile - Top) */}
        <div className="flex sm:hidden flex-row items-center gap-3">
          <span className="text-xl font-heading font-bold text-reddit-text">{release.version}</span>
          <span className="text-sm font-semibold text-reddit-textMuted uppercase tracking-wider">{release.date}</span>
        </div>

        {/* Content Card */}
        <div className="flex-1 bg-reddit-card/50 backdrop-blur-md border border-reddit-border/50 rounded-2xl p-6 sm:p-8 hover:border-reddit-border hover:bg-reddit-card transition-all duration-300 shadow-xl shadow-black/20">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-3">
              {release.title}
            </h2>
            <div className="flex flex-wrap gap-2">
              {release.tags?.map((tag, i) => (
                <span
                  key={i}
                  className={\`px-3 py-1 text-xs font-semibold rounded-full border \${getTagColor(tag)}\`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Markdown Content */}
          <div className="prose prose-invert max-w-none text-reddit-text">
            <ReactMarkdown
              components={{
                p: ({node, ...props}) => <p className="mb-4 leading-relaxed whitespace-pre-wrap" {...props} />,
                ul: ({node, ...props}) => <ul className="space-y-2 mb-4 list-disc pl-5" {...props} />,
                li: ({node, ...props}) => <li className="pl-1" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-bold text-white mt-6 mb-3 flex items-center gap-2" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
                em: ({node, ...props}) => <em className="italic text-reddit-textMuted" {...props} />
              }}
            >
              {release.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReleaseItem;
