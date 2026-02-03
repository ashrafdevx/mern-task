import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ActivitiesSection from "@/components/ActivitiesSection";
import StatsSection from "@/components/StatsSection";
import SkillsSection from "@/components/SkillsSection";
import VideoSection from "@/components/VideoSection";
import StaffSection from "@/components/StaffSection";
import ClientsSection from "@/components/ClientsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ActivitiesSection />
        <StatsSection />
        <SkillsSection />
        <VideoSection />
        <StaffSection />
        <ClientsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
