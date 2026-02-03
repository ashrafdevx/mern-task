import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import ActivitiesSection from "@/components/ActivitiesSection";
import StatsSection from "@/components/StatsSection";
import SkillsSection from "@/components/SkillsSection";
import VideoSection from "@/components/VideoSection";
import StaffSection from "@/components/StaffSection";
import ClientsSection from "@/components/ClientsSection";
import Footer from "@/components/Footer";
import { fetchStaff } from "@/lib/api";

// Staff Section with API Integration
const StaffSectionWithAPI = () => {
  const { data: staff, isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: fetchStaff,
  });

  // Map API data (DB or JSON fallback) to component format
  const mappedStaff = staff?.map((member: any) => ({
    id: member._id || member.id,
    name: member.name,
    position: member.position || member.role,
    image:
      member.image ||
      `https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80`,
  }));

  return <StaffSection staff={mappedStaff} isLoading={isLoading} />;
};

const About = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section - About Us */}
        <section className="relative h-[300px] md:h-[400px] overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&auto=format&fit=crop&q=80')`
            }}
          />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Content - Centered */}
          <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
            <h1 
              className="text-[42px] md:text-[56px] font-bold text-white mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              About Us
            </h1>
            <div className="flex items-center gap-2 text-[14px]">
              <a href="/" className="text-white hover:text-[#1a9876] transition-colors">
                Home
              </a>
              <ChevronRight className="w-4 h-4 text-white/60" />
              <span className="text-white/80">About Us</span>
            </div>
          </div>
        </section>

        {/* Outdoor Activities Section */}
        <ActivitiesSection />

        {/* Stats Counter Section */}
        <StatsSection />

        {/* Why Choose Us / Skills Section */}
        <SkillsSection />

        {/* Video Section */}
        <VideoSection />

        {/* Expert Staff Section */}
        <StaffSectionWithAPI />

        {/* Global Clients Section */}
        <ClientsSection />
      </main>
      <Footer />
    </div>
  );
};

export default About;
