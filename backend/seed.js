const mongoose = require('mongoose');
require('dotenv').config();

const Staff = require('./models/Staff');
const Hotel = require('./models/Hotel');

// Sample Staff Data
const staffData = [
  {
    name: 'Sarah Johnson',
    position: 'CEO & Founder',
    department: 'Executive',
    bio: 'Sarah founded our company with a vision to revolutionize the hospitality industry. With over 20 years of experience in luxury hotel management, she leads our team with passion and innovation.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop',
    email: 'sarah.johnson@hotelbook.com',
    phone: '+1 (555) 123-4567',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      twitter: 'https://twitter.com/sarahjohnson'
    }
  },
  {
    name: 'Michael Chen',
    position: 'Chief Technology Officer',
    department: 'Technology',
    bio: 'Michael brings cutting-edge technology solutions to enhance our booking experience. His expertise in AI and machine learning has transformed how we serve our customers.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
    email: 'michael.chen@hotelbook.com',
    phone: '+1 (555) 234-5678',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/michaelchen',
      twitter: 'https://twitter.com/michaelchen'
    }
  },
  {
    name: 'Emily Rodriguez',
    position: 'Head of Customer Experience',
    department: 'Customer Service',
    bio: 'Emily ensures every guest receives exceptional service. Her dedication to customer satisfaction has earned us numerous industry awards and loyal customers worldwide.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop',
    email: 'emily.rodriguez@hotelbook.com',
    phone: '+1 (555) 345-6789',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/emilyrodriguez',
      instagram: 'https://instagram.com/emilyrodriguez'
    }
  },
  {
    name: 'David Williams',
    position: 'Director of Operations',
    department: 'Operations',
    bio: 'David oversees all operational aspects of our partner hotels. His strategic approach ensures seamless booking processes and optimal guest experiences.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    email: 'david.williams@hotelbook.com',
    phone: '+1 (555) 456-7890',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/davidwilliams'
    }
  },
  {
    name: 'Jennifer Park',
    position: 'Marketing Director',
    department: 'Marketing',
    bio: 'Jennifer crafts compelling marketing strategies that connect travelers with their perfect accommodations. Her creative campaigns have expanded our global reach.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
    email: 'jennifer.park@hotelbook.com',
    phone: '+1 (555) 567-8901',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/jenniferpark',
      twitter: 'https://twitter.com/jenniferpark',
      instagram: 'https://instagram.com/jenniferpark'
    }
  },
  {
    name: 'Robert Thompson',
    position: 'Senior Travel Consultant',
    department: 'Consulting',
    bio: 'Robert provides personalized travel recommendations to our premium clients. His extensive knowledge of global destinations makes him an invaluable resource.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
    email: 'robert.thompson@hotelbook.com',
    phone: '+1 (555) 678-9012',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/robertthompson'
    }
  }
];

// Sample Hotel Data
const hotelData = [
  {
    name: 'The Grand Palace Hotel',
    description: 'Experience luxury like never before at The Grand Palace Hotel. Our 5-star property offers world-class amenities, stunning city views, and impeccable service that will make your stay unforgettable.',
    location: {
      address: '123 Luxury Avenue',
      city: 'New York',
      country: 'USA'
    },
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop'
    ],
    pricePerNight: 450,
    rating: 4.9,
    amenities: ['Free WiFi', 'Spa', 'Pool', 'Gym', 'Restaurant', 'Bar', 'Room Service', 'Concierge'],
    roomTypes: ['Standard', 'Deluxe', 'Suite', 'Presidential Suite'],
    totalRooms: 200,
    availableRooms: 45
  },
  {
    name: 'Seaside Resort & Spa',
    description: 'Escape to paradise at Seaside Resort & Spa. Located on pristine beaches with crystal-clear waters, enjoy our private beach access, rejuvenating spa treatments, and gourmet dining.',
    location: {
      address: '456 Beach Boulevard',
      city: 'Miami',
      country: 'USA'
    },
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop'
    ],
    pricePerNight: 380,
    rating: 4.7,
    amenities: ['Beach Access', 'Spa', 'Pool', 'Water Sports', 'Restaurant', 'Bar', 'Kids Club'],
    roomTypes: ['Ocean View', 'Garden View', 'Beach Villa', 'Overwater Bungalow'],
    totalRooms: 150,
    availableRooms: 32
  },
  {
    name: 'Mountain Lodge Retreat',
    description: 'Discover tranquility at Mountain Lodge Retreat. Nestled in the heart of the mountains, our cozy lodge offers breathtaking views, outdoor adventures, and a peaceful escape from city life.',
    location: {
      address: '789 Summit Road',
      city: 'Aspen',
      country: 'USA'
    },
    image: 'https://images.unsplash.com/photo-1518602164578-cd0074062767?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600&fit=crop'
    ],
    pricePerNight: 295,
    rating: 4.8,
    amenities: ['Ski Access', 'Fireplace', 'Spa', 'Restaurant', 'Hiking Trails', 'Hot Tub'],
    roomTypes: ['Standard Room', 'Mountain View Suite', 'Cabin', 'Chalet'],
    totalRooms: 80,
    availableRooms: 18
  },
  {
    name: 'Urban Boutique Hotel',
    description: 'Stay in style at Urban Boutique Hotel. Our trendy downtown location puts you steps away from shopping, dining, and entertainment. Modern design meets comfort in every room.',
    location: {
      address: '321 Downtown Street',
      city: 'San Francisco',
      country: 'USA'
    },
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop'
    ],
    pricePerNight: 225,
    rating: 4.5,
    amenities: ['Free WiFi', 'Rooftop Bar', 'Gym', 'Restaurant', 'Business Center', 'Valet Parking'],
    roomTypes: ['Standard', 'Superior', 'Executive Suite'],
    totalRooms: 120,
    availableRooms: 28
  },
  {
    name: 'Heritage Castle Hotel',
    description: 'Live like royalty at Heritage Castle Hotel. This restored 18th-century castle combines historic charm with modern luxury. Experience the grandeur of a bygone era.',
    location: {
      address: '1 Castle Way',
      city: 'Edinburgh',
      country: 'UK'
    },
    image: 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop'
    ],
    pricePerNight: 520,
    rating: 4.9,
    amenities: ['Historic Tours', 'Fine Dining', 'Spa', 'Gardens', 'Library', 'Afternoon Tea'],
    roomTypes: ['Classic Room', 'Tower Suite', 'Royal Suite', 'Castle Wing'],
    totalRooms: 60,
    availableRooms: 12
  },
  {
    name: 'Tropical Paradise Resort',
    description: 'Your dream vacation awaits at Tropical Paradise Resort. Surrounded by lush gardens and pristine beaches, enjoy world-class dining, water activities, and ultimate relaxation.',
    location: {
      address: '100 Paradise Lane',
      city: 'Bali',
      country: 'Indonesia'
    },
    image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop'
    ],
    pricePerNight: 340,
    rating: 4.8,
    amenities: ['Private Beach', 'Infinity Pool', 'Spa', 'Yoga Classes', 'Snorkeling', 'Cultural Tours'],
    roomTypes: ['Garden Villa', 'Pool Villa', 'Beach Villa', 'Cliff Villa'],
    totalRooms: 100,
    availableRooms: 22
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Staff.deleteMany({});
    await Hotel.deleteMany({});
    console.log('Cleared existing data');

    // Insert new data
    await Staff.insertMany(staffData);
    console.log(`Inserted ${staffData.length} staff members`);

    await Hotel.insertMany(hotelData);
    console.log(`Inserted ${hotelData.length} hotels`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
