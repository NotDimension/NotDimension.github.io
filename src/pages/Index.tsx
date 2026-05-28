import { useState, useCallback } from "react";
import { m } from "framer-motion";
import IntroAnimation from "@/components/IntroAnimation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import RolesSection from "@/components/RolesSection";
import SkillsSection from "@/components/SkillsSection";
import SpotifySection from "@/components/SpotifySection";
import LearningSection from "@/components/LearningSection";
import ExploreSection from "@/components/ExploreSection";
import ConnectSection from "@/components/ConnectSection";

const Index = () => {
  const [introComplete, setIntroComplete] = useState(false);
  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);

  return (
    <>
      {/* Show IntroAnimation until it completes */}
      {!introComplete && <IntroAnimation onComplete={handleIntroComplete} />}

      {/* Main content fades in after intro */}
      {introComplete && (
        <m.div
          className="relative noise-overlay app-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative z-10">
            <HeroSection />
            <div className="mx-auto"><AboutSection /></div>
            <div className="mx-auto section-divider"><RolesSection /></div>
            <div className="mx-auto section-divider"><SkillsSection /></div>
            <div className="mx-auto section-divider"><SpotifySection /></div>
            <div className="mx-auto section-divider"><LearningSection /></div>
            <div className="mx-auto section-divider"><ExploreSection /></div>
            <div className="mx-auto section-divider"><ConnectSection /></div>
          </div>
        </m.div>
      )}
    </>
  );
};

export default Index;
