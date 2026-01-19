import React, { createContext, useContext, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { useUI } from "./UIContext";
import { useFeed } from "./FeedContext";

const StudyGramContext = createContext();

export const useStudyGram = () => {
  const context = useContext(StudyGramContext);
  if (!context) {
    throw new Error("useStudyGram must be used within StudyGramProvider");
  }
  return context;
};

export const StudyGramProvider = ({ children }) => {
  const auth = useAuth();
  const ui = useUI();
  const feed = useFeed();

  // Unified value for backward compatibility
  // This allows legacy components to still function while we migrate them
  const value = useMemo(
    () => ({
      ...auth,
      ...ui,
      ...feed,
      // Handle any specific mapping or overrides needed for legacy support
      getCommentsForPost: feed.getCommentsForPost
    }),
    [auth, ui, feed]
  );

  return (
    <StudyGramContext.Provider value={value}>
      {children}
    </StudyGramContext.Provider>
  );
};
