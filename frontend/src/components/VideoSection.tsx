import { Play } from "lucide-react";

const VideoSection = () => {
  return (
    <section className="relative py-28 md:py-32 overflow-hidden bg-[#1a9876]">
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Label Box */}
        <span 
          className="inline-block bg-white text-[#1a9876] text-[14px] font-semibold px-6 py-2 rounded mb-6"
        >
          WELCOME TO FLEYLAND
        </span>
        
        <h2 
          className="text-[32px] md:text-[48px] font-bold text-white leading-[1.3] max-w-[600px] mx-auto mb-16"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Relax And Enjoy With Our<br />Hotel & Resort
        </h2>

        {/* Play Button */}
        <button className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform duration-300 group">
          <Play className="w-8 h-8 md:w-10 md:h-10 text-[#1a9876] ml-1 group-hover:scale-110 transition-transform" fill="#1a9876" />
        </button>
      </div>
    </section>
  );
};

export default VideoSection;
