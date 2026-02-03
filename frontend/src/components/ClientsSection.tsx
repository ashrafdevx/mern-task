
const ClientsSection = () => {

  const clients = [
    { icon: "/icon-08.png", name: "Ocean Tours" },
    { icon: "/icon-09.png", name: "Mountain Resort" },
    { icon: "/icon-10.png", name: "Palm Beach" },
    { icon: "/icon-11.png", name: "Villa Homes" },
    { icon: "/icon-12.png", name: "Beach Huts" },

  ];

  return (
    <section className="py-16 md:py-20 bg-[#e8f5f1]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-[#1a9876] bg-white py-1 rounded-sm px-6 text-[14px] font-semibold uppercase tracking-[1px] mb-3">
            OUR CLIENTS
          </span>
          <h2
            className="text-[32px] md:text-[42px] font-bold text-[#2d2d2d]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            We Have More Than 150+<br />Global Clients
          </h2>
        </div>

        {/* Client Logos */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {clients.map((client, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 text-[#9ca3af] opacity-60 hover:opacity-100 hover:text-[#1a9876] transition-all duration-300 cursor-pointer"
            >
              <img src={client.icon} alt={client.name} className="w-16 h-16 object-contain" />
              <span className="text-[12px] md:text-[14px] mt-1">{client.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
