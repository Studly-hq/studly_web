import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { changelogData } from "../data/changelog";
import Changelog from "../components/ui/changelog";
import SEO from "../components/common/SEO";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";

const ReleaseNotes = () => {
  const navigate = useNavigate();

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
        {/* Sticky top nav */}
        <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-reddit-border bg-reddit-bg/90 px-4 py-3 backdrop-blur-md">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex size-9 items-center justify-center rounded-full border border-reddit-border bg-reddit-card text-reddit-text transition-colors hover:bg-reddit-cardHover"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={18} strokeWidth={1.8} />
          </button>
          <h2 className="text-base font-semibold text-reddit-text">What's new</h2>
        </div>

        <Changelog
          title="What's new in Studly"
          entries={changelogData}
        />
      </div>
    </>
  );
};

export default ReleaseNotes;
