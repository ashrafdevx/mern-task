import { CheckCircle, ArrowRight } from "lucide-react";

// SVG Icons matching the design
const SwimmingIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#1a9876]">
    <path d="M4 40c1.8 1.8 4.2 2.8 6.6 2.8s4.8-1 6.6-2.8c.8-.8 2-.8 2.8 0 1.8 1.8 4.2 2.8 6.6 2.8s4.8-1 6.6-2.8c.8-.8 2-.8 2.8 0 1.8 1.8 4.2 2.8 6.6 2.8" />
    <path d="M4 32c1.8 1.8 4.2 2.8 6.6 2.8s4.8-1 6.6-2.8c.8-.8 2-.8 2.8 0 1.8 1.8 4.2 2.8 6.6 2.8s4.8-1 6.6-2.8c.8-.8 2-.8 2.8 0 1.8 1.8 4.2 2.8 6.6 2.8" />
    <circle cx="17" cy="12" r="5" />
    <path d="M12 21L17 17L24 24" />
  </svg>
);

const BikeIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#1a9876]">
    <circle cx="10" cy="34" r="6" />
    <circle cx="38" cy="34" r="6" />
    <path d="M24 34V10" />
    <path d="M16 10h16" />
    <path d="M10 34l6-12h16l6 12" />
    <path d="M24 10l8 24" />
  </svg>
);

const UtensilsIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
    <circle cx="24" cy="24" r="18" />
    <path d="M16 12v6c0 2 1 3 2 4v12" />
    <path d="M16 12c.6 0 1 .4 1 1v4c0 .6-.4 1-1 1" />
    <path d="M32 12v22" />
    <path d="M32 12c1 0 2 1 2 3v4c0 2-1 3-2 3" />
    <ellipse cx="24" cy="15" rx="2.4" ry="4" />
    <path d="M24 19v15" />
  </svg>
);

const ActivitiesSection = () => {
  const checkItems = [
    "It is a long fact that a reader will be distracted by the readable",
    "Lorem Ipsum is simply dummy of the printing and industry",
    "There are many variations of Lorem Ipsum majority",
  ];

  return (
    <section className="py-20 md:py-24 bg-[#e8f4ef]">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Content */}
          <div className="pt-4">
            {/* Label */}
            <span className="inline-block bg-[#d4ece3] text-[#1a9876] text-[13px] font-semibold uppercase tracking-[2px] px-3 py-1.5 mb-4">
              LUXURY HOTEL
            </span>

            <h2
              className="text-[32px] md:text-[40px] font-bold leading-[1.2] mb-5 text-[#1e1e1e]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              We Provide Outdoor Activities<br />To All Visitors
            </h2>

            <p className="text-[#777777] text-[15px] leading-[1.8] mb-8 max-w-[480px]">
              There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even.
            </p>

            {/* Feature Items - Grid */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Swimming Pool Feature */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <img src={"/icon-04.png"} alt="Swimming" className="w-10 h-10" />
                </div>
                <div>
                  <h3
                    className="font-semibold text-[#1e1e1e] text-[17px] leading-tight"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    The Best Swiming<br />Pool
                  </h3>
                </div>
              </div>

              {/* Stationary Bike Feature */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <img src={"/icon-03.png"} alt="Bike" className="w-10 h-10" />
                </div>
                <div>
                  <h3
                    className="font-semibold text-[#1e1e1e] text-[17px] leading-tight"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    The Best<br />Stationary Bike
                  </h3>
                </div>
              </div>
            </div>

            {/* Check Items */}
            <div className="space-y-3 mb-8">
              {checkItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <img src={"/icon-05.png"} alt="Check" className="" />
                  <span className="text-[#777777] text-[14px]">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1a9876] text-white font-medium text-[15px] rounded-[4px] hover:bg-[#147a5f] transition-colors">
              Discover More
              <ArrowRight className="w-4 h-4 -rotate-45" />
            </button>
          </div>

          {/* Right Image Collage */}
          <div className="relative h-[520px] md:h-[560px]">
            {/* Main Image (Top Right) - Indoor Fireplace/Living Room */}
            <div className="absolute top-0 right-0 w-[70%] md:w-[380px] h-[280px] md:h-[440px]
  rounded-lg overflow-hidden
  shadow-[0_8px_30px_rgba(0,0,0,0.12)]
  translate-x-8
  [transform:perspective(1000px)_rotateY(-15deg)]
  [transform-origin:left_right]">

              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80"
                alt="Cozy indoor living room with fireplace"
                className="w-full h-full object-cover"
              />
            </div>


            {/* Secondary Image (Bottom Left) - Pool/Night Scene */}
            <div className="absolute bottom-[20px] left-36 w-[55%] md:w-[200px] h-[200px] md:h-[240px] rounded-lg overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-10">
              <img
                src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=80"
                alt="Outdoor pool at night"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Restaurant Card - Overlapping Bottom Right */}
            <div className="absolute bottom-[40px] left-[40%] md:right-[60px] z-20 w-[170px] md:w-[180px]">
              <div className="rounded-xl p-5 text-white text-center bg-[#2b2b2b] shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
                <div className="flex justify-center mb-1">
                  <div className="w-14 h-14 rounded-full border border-gray-500/50 flex items-center justify-center">
                    <UtensilsIcon />
                  </div>
                </div>
                <h3
                  className="font-bold text-[18px] mb-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Restaurants
                </h3>
                <p className="text-[12px] text-white/70 leading-none">
                  Donec in quis the asd pellentesque velit. Donec id velit arcu posuere blane.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActivitiesSection;
