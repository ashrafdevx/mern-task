import heroImage from "@/assets/hero-lobby.jpg";
import { ChevronRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative h-[180px] md:h-[220px] overflow-hidden">
      {/* Background Image */}
      <img 
        src={heroImage} 
        alt="Home Banner"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Dark Overlay - on top of image, below text */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content - on top of overlay */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
        <h1 
          className="text-3xl md:text-4xl lg:text-[42px] font-bold text-white mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Home
        </h1>
        <div className="flex items-center gap-1 text-sm">
          <a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-white">Welcome</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
