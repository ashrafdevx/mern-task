import React from 'react';

const StatsSection = () => {
  const stats = [
    {
      number: "305",
      label: "Luxury Rooms"
    },
    {
      number: "650",
      label: "Regular Guests"
    },
    {
      number: "80",
      label: "Team Member"
    },
    {
      number: "75",
      label: "Beaches"
    },
  ];

  return (
    <>
      {/* Google Fonts CDN */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap"
        rel="stylesheet"
      />

      <section
        style={{
          background: 'linear-gradient(135deg, #1a9b87 0%, #16897a 100%)',
          padding: '80px 20px',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '60px',
            alignItems: 'center',
            justifyItems: 'center',
          }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '80px',
                  fontWeight: '800',
                  color: 'transparent',
                  WebkitTextStroke: '2.5px white',
                  textStroke: '2.5px white',
                  letterSpacing: '0.02em',
                  lineHeight: '1',
                }}
              >
                {stat.number} +
              </div>
              <div
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '20px',
                  fontWeight: '400',
                  color: 'white',
                  letterSpacing: '0.01em',
                  opacity: '0.95',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default StatsSection;