import { useQuery } from "@tanstack/react-query";
import { fetchWhyChooseMetrics, WhyChooseMetric } from "@/lib/api";

const SkillsSection = () => {
  const { data: metrics } = useQuery<WhyChooseMetric[]>({
    queryKey: ['why-choose'],
    queryFn: fetchWhyChooseMetrics,
  });

  const skills: WhyChooseMetric[] = metrics && metrics.length > 0
    ? metrics
    : [
        { id: "1", name: "Services", percentage: 88 },
        { id: "2", name: "Chef Master", percentage: 80 },
        { id: "3", name: "Design", percentage: 76 },
        { id: "4", name: "Receptionist", percentage: 92 },
      ];

  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block text-[#1a9876] text-[14px] font-semibold uppercase tracking-[1px] mb-3">
              OUR SKILLS
            </span>
            <h2
              className="text-[32px] md:text-[42px] font-bold text-[#2d2d2d] mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Why Choose for us?
            </h2>
            <p className="text-[#6b7280] text-[15px] leading-[1.8] mb-10 max-w-md">
              Dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco.
            </p>

            {/* Progress Bars (Why Choose for us? metrics) */}
            <div className="space-y-5  w-[70%]">
              {skills.map((skill) => (
                <div key={skill.id ?? skill.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-[#2d2d2d] text-[15px]">{skill.name}</span>
                    <span className="text-[#1a9876] font-semibold text-[15px]">{skill.percentage}%</span>
                  </div>
                  <div className="h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1a9876] rounded-full transition-all duration-1000"
                      style={{ width: `${skill.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image Collage */}
          <div className="relative  h-[450px] md:h-[500px] flex justify-center items-center">
            {/* Main Image (Center) - Beach with umbrella */}
            <div className="absolute w-[70%] md:w-[450px] h-[350px] md:h-[450px] rounded-lg overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
              <img
                src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=80"
                alt="Beach with wooden deck and umbrella"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Tertiary Image (Left Bottom) - Resort exterior */}
            <div className="absolute bottom-16 left-12 w-[30%] md:w-[150px] h-[100px] md:h-[150px] rounded-lg overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.1)] z-10">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80"
                alt="Resort hotel exterior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
