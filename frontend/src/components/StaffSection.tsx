import { Plus } from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  position: string;
  image: string;
}

interface StaffSectionProps {
  staff?: StaffMember[];
  isLoading?: boolean;
}

const StaffCard = ({ member }: { member: StaffMember }) => (
  <div className="group bg-white rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300">
    {/* Image Container */}
    <div className="relative aspect-[4/5] overflow-hidden">
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {/* Badge */}
      <div className="absolute bottom-4 right-4 w-10 h-10 bg-[#1a9876] rounded-md flex items-center justify-center shadow-lg">
        <Plus className="w-5 h-5 text-white" />
      </div>
    </div>

    {/* Content */}
    <div className="p-6 text-start">
      <h3
        className="font-bold text-[20px] text-[#2d2d2d] mb-2"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {member.name}
      </h3>
      <p className="text-[#6b7280] text-[14px]">{member.position}</p>
    </div>
  </div>
);

const StaffSection = ({ staff, isLoading }: StaffSectionProps) => {
  const defaultStaff: StaffMember[] = [
    {
      id: '1',
      name: "Michael Dean",
      position: "Chef Master",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: '2',
      name: "Arnold Taylor",
      position: "Room Service",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: '3',
      name: "Michael Dean",
      position: "Assistant Chef",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: '4',
      name: "Michael Dean",
      position: "Support Lead",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80"
    },
  ];

  const displayStaff = staff && staff.length > 0 ? staff : defaultStaff;

  return (
    <section className="py-20 md:py-24 bg-[#f7f7f7]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-[#1a9876] text-[14px] font-semibold uppercase tracking-[1px] mb-3">
            POPULAR STAFF
          </span>
          <h2
            className="text-[32px] md:text-[42px] font-bold text-[#2d2d2d]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Expert Staff Persons
          </h2>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-[4/5] bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Staff Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayStaff.slice(0, 4).map((member) => (
              <StaffCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default StaffSection;
