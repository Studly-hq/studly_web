import React, { useEffect } from "react";
import { changelogData } from "../data/changelog";
import Changelog from "../components/ui/changelog";
import SEO from "../components/common/SEO";

const ReleaseNotes = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="Changelog"
        description="See what's new in Studly. Follow along as we ship new features, improvements, and fixes."
        canonical="/releases"
      />

      <div className="min-h-screen bg-reddit-bg">
        <Changelog
          title="What's new in Studly"
          description="Follow along as we continuously improve Studly. Here are the latest features, improvements, and updates to the platform."
          entries={changelogData}
        />
      </div>
    </>
  );
};

export default ReleaseNotes;
