import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { changelogData } from "../data/changelog";
import ReleaseItem from "../components/ReleaseItem";
import { Helmet } from "react-helmet-async";

const ReleaseNotes = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Release Notes | Studly</title>
        <meta name="description" content="Discover what's new and what has changed in Studly." />
      </Helmet>

      <div className="min-h-screen bg-reddit-bg text-white pb-24 overflow-x-hidden">
        {/* Header Section */}
        <div className="relative pt-20 pb-16 overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-reddit-orange/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-reddit-card/80 backdrop-blur-sm border border-reddit-border/50 text-sm font-medium text-reddit-textMuted mb-6"
            >
              <Sparkles className="w-4 h-4 text-reddit-orange" />
              <span>Product Updates</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-5xl md:text-6xl font-heading font-black tracking-tight mb-6">
                What's new in <span className="text-transparent bg-clip-text bg-gradient-to-r from-reddit-orange to-yellow-500">Studly</span>
              </h1>
              <p className="text-lg md:text-xl text-reddit-textMuted max-w-2xl mx-auto leading-relaxed">
                Follow along as we continuously improve Studly. Here are the latest features, improvements, and updates to the platform.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="max-w-4xl mx-auto px-4 relative">
          {/* Vertical Line */}
          <div className="absolute left-[27px] sm:left-[143px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-reddit-orange/50 via-reddit-border/80 to-transparent" />
          
          <div className="flex flex-col gap-0">
            {changelogData.map((release, index) => (
              <ReleaseItem key={release.version} release={release} index={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReleaseNotes;
