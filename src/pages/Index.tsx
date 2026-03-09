import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import RolesSection from "@/components/RolesSection";
import SkillsSection from "@/components/SkillsSection";
import LearningSection from "@/components/LearningSection";
import ConnectSection from "@/components/ConnectSection";
import ExploreSection from "@/components/ExploreSection";

const Index = () => {
  return (
    <div className="relative noise-overlay">
      <div className="relative z-10">
        <HeroSection />
        <AboutSection />
        <RolesSection />
        <SkillsSection />
        <LearningSection />
        <ExploreSection />
        <ConnectSection />
      </div>
    </div>
  );
};

export default Index;
