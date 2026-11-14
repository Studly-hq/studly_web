import React from "react";
import Header from "../components/sections/Header";
import Hero from "../components/sections/Hero";
import Problem from "../components/sections/Problem";
import LearningPath from "../components/sections/LearningPath";
import HowStudlySolvesIt from "../components/sections/HowStudlySolvesIt";
import Features from "../components/sections/Features";
import BossSessions from "../components/sections/BossSessions";
import MeetWobble from "../components/sections/MeetWobble";
import Testimonials from "../components/sections/Testimonials";
import Pricing from "../components/sections/Pricing";
import FAQ from "../components/sections/FAQ";
import CTA from "../components/sections/CTA";
import FooterNav from "../components/sections/FooterNav";
import HalftoneWordmarkFooter from "../components/ui/halftone-wordmark-footer";
import useSmoothScroll from "../hooks/useSmoothScroll";

const LandingPage = () => {
  // Inertial drift so the scroll-linked sections are actually readable at a
  // human scroll speed. Wheel only — touch keeps native momentum.
  useSmoothScroll();

  return (
    <div className="relative min-h-dvh overflow-x-clip bg-[#fffcf0] text-[#141414] [color-scheme:light]">
      <Header />
      <Hero />
      <Problem />
      <LearningPath />
      <HowStudlySolvesIt />
      <Features />
      <BossSessions />
      <MeetWobble />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <FooterNav />
      <HalftoneWordmarkFooter
        columns={[]}
        backToTop={true}
      />
    </div>
  );
};

export default LandingPage;