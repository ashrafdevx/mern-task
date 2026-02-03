require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const { ExpertStaff } = require('../models/expertStaff.model');
const { Hotel } = require('../models/hotel.model');
const { Appointment } = require('../models/appointment.model');
const { WhyChoose } = require('../models/whyChoose.model');

const expertStaffData = [
  {
    name: 'John Doe',
    position: 'Senior Full Stack Developer',
    bio: 'Experienced developer specializing in MERN stack and cloud architecture.',
    image: 'https://via.placeholder.com/300',
    experience: 7,
    email: 'john.doe@example.com',
    phone: '+1234567890',
    specialization: ['React', 'Node.js', 'MongoDB', 'AWS'],
    isActive: true,
  },
  {
    name: 'Jane Smith',
    position: 'UX/UI Designer',
    bio: 'Award-winning designer with a focus on user-centered design.',
    image: 'https://via.placeholder.com/300',
    experience: 5,
    email: 'jane.smith@example.com',
    phone: '+1987654321',
    specialization: ['Figma', 'User Research', 'Prototyping'],
    isActive: true,
  },
  {
    name: 'Michael Chen',
    position: 'DevOps Engineer',
    bio: 'Infrastructure and CI/CD expert.',
    image: 'https://via.placeholder.com/300',
    experience: 6,
    email: 'michael.chen@example.com',
    phone: '+1555123456',
    specialization: ['Docker', 'Kubernetes', 'AWS'],
    isActive: true,
  },
  {
    name: 'Sarah Williams',
    position: 'HR Manager',
    bio: 'Dedicated to building inclusive teams. 10 years in people operations.',
    image: 'https://via.placeholder.com/300',
    experience: 10,
    email: 'sarah.williams@example.com',
    phone: '+1555987654',
    specialization: ['Recruitment', 'Employee Relations', 'Training'],
    isActive: true,
  },
  {
    name: 'David Brown',
    position: 'Sales Lead',
    bio: 'Results-driven sales professional with B2B expertise.',
    image: 'https://via.placeholder.com/300',
    experience: 4,
    email: 'david.brown@example.com',
    phone: '+1555333444',
    specialization: ['Enterprise Sales', 'Negotiation', 'CRM'],
    isActive: true,
  },
  {
    name: 'Emily Davis',
    position: 'Backend Developer',
    bio: 'Specializes in high-performance APIs and database design.',
    image: 'https://via.placeholder.com/300',
    experience: 3,
    email: 'emily.davis@example.com',
    phone: '+1555666777',
    specialization: ['Node.js', 'PostgreSQL', 'Redis'],
    isActive: true,
  },
];

const hotelData = [
  {
    name: 'Grand Plaza Hotel',
    location: 'New York City',
    price: 250,
    rating: 4.5,
    amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Parking', 'Spa'],
    images: ['https://via.placeholder.com/400'],
    description: 'Luxury hotel in the heart of Manhattan.',
    availableRooms: 25,
    totalRooms: 100,
    isAvailable: true,
    category: 'luxury',
    contactEmail: 'info@grandplaza.com',
    contactPhone: '+12125551234',
    checkInTime: '15:00',
    checkOutTime: '11:00',
  },
  {
    name: 'Sunset Beach Resort',
    location: 'Miami Beach',
    price: 320,
    rating: 4.8,
    amenities: ['WiFi', 'Pool', 'Beach Access', 'Restaurant', 'Bar', 'Spa'],
    images: ['https://via.placeholder.com/400'],
    description: 'Beachfront resort with private beach.',
    availableRooms: 18,
    totalRooms: 50,
    isAvailable: true,
    category: 'luxury',
    contactEmail: 'reservations@sunsetbeach.com',
    contactPhone: '+13055551234',
    checkInTime: '15:00',
    checkOutTime: '11:00',
  },
  {
    name: 'City Center Inn',
    location: 'Chicago',
    price: 120,
    rating: 4.0,
    amenities: ['WiFi', 'Gym', 'Restaurant', 'Parking'],
    images: ['https://via.placeholder.com/400'],
    description: 'Comfortable mid-town hotel.',
    availableRooms: 35,
    totalRooms: 80,
    isAvailable: true,
    category: 'standard',
    contactEmail: 'info@citycenterinn.com',
    contactPhone: '+13125551234',
    checkInTime: '14:00',
    checkOutTime: '11:00',
  },
  {
    name: 'Budget Stay Motel',
    location: 'Los Angeles',
    price: 65,
    rating: 3.5,
    amenities: ['WiFi', 'Parking'],
    images: ['https://via.placeholder.com/400'],
    description: 'Affordable accommodation near the highway.',
    availableRooms: 40,
    totalRooms: 50,
    isAvailable: true,
    category: 'budget',
    contactEmail: 'book@budgetstay.com',
    contactPhone: '+13235551234',
    checkInTime: '15:00',
    checkOutTime: '11:00',
  },
  {
    name: 'Mountain View Lodge',
    location: 'Denver',
    price: 180,
    rating: 4.6,
    amenities: ['WiFi', 'Restaurant', 'Parking', 'Ski Storage'],
    images: ['https://via.placeholder.com/400'],
    description: 'Cozy lodge with mountain views.',
    availableRooms: 12,
    totalRooms: 25,
    isAvailable: true,
    category: 'standard',
    contactEmail: 'hello@mountainviewlodge.com',
    contactPhone: '+13035551234',
    checkInTime: '16:00',
    checkOutTime: '10:00',
  },
  {
    name: 'Harbor Lights Hotel',
    location: 'San Francisco',
    price: 220,
    rating: 4.4,
    amenities: ['WiFi', 'Gym', 'Restaurant', 'Bar', 'Bay View'],
    images: ['https://via.placeholder.com/400'],
    description: 'Waterfront hotel with bay views.',
    availableRooms: 28,
    totalRooms: 75,
    isAvailable: true,
    category: 'luxury',
    contactEmail: 'reservations@harborlights.com',
    contactPhone: '+14155551234',
    checkInTime: '15:00',
    checkOutTime: '11:00',
  },
  {
    name: 'Riverside Inn',
    location: 'Austin',
    price: 95,
    rating: 3.8,
    amenities: ['WiFi', 'Pool', 'Parking', 'Breakfast'],
    images: ['https://via.placeholder.com/400'],
    description: 'Family-friendly inn by the river.',
    availableRooms: 22,
    totalRooms: 40,
    isAvailable: true,
    category: 'standard',
    contactEmail: 'info@riversideinn.com',
    contactPhone: '+15125551234',
    checkInTime: '15:00',
    checkOutTime: '11:00',
  },
  {
    name: 'Royal Palace Hotel',
    location: 'Las Vegas',
    price: 450,
    rating: 4.9,
    amenities: ['WiFi', 'Pool', 'Gym', 'Spa', 'Casino', 'Restaurant', 'Valet'],
    images: ['https://via.placeholder.com/400'],
    description: 'Five-star luxury on the Strip.',
    availableRooms: 50,
    totalRooms: 500,
    isAvailable: true,
    category: 'luxury',
    contactEmail: 'concierge@royalpalace.com',
    contactPhone: '+17025551234',
    checkInTime: '15:00',
    checkOutTime: '11:00',
  },
  {
    name: 'Green Valley Motel',
    location: 'Portland',
    price: 75,
    rating: 3.6,
    amenities: ['WiFi', 'Parking', 'Pet Friendly'],
    images: ['https://via.placeholder.com/400'],
    description: 'Eco-friendly budget option.',
    availableRooms: 15,
    totalRooms: 30,
    isAvailable: true,
    category: 'budget',
    contactEmail: 'stay@greenvalleymotel.com',
    contactPhone: '+15035551234',
    checkInTime: '15:00',
    checkOutTime: '11:00',
  },
  {
    name: 'Lakeside Resort',
    location: 'Seattle',
    price: 195,
    rating: 4.3,
    amenities: ['WiFi', 'Pool', 'Restaurant', 'Lake View', 'Kayaks'],
    images: ['https://via.placeholder.com/400'],
    description: 'Peaceful resort on the lake.',
    availableRooms: 20,
    totalRooms: 45,
    isAvailable: true,
    category: 'standard',
    contactEmail: 'info@lakesideresort.com',
    contactPhone: '+12065551234',
    checkInTime: '16:00',
    checkOutTime: '11:00',
  },
];

const whyChooseData = [
  {
    name: 'Services',
    slug: 'services',
    percentage: 88,
    order: 1,
    isActive: true,
  },
  {
    name: 'Chef Master',
    slug: 'chef-master',
    percentage: 80,
    order: 2,
    isActive: true,
  },
  {
    name: 'Design',
    slug: 'design',
    percentage: 76,
    order: 3,
    isActive: true,
  },
  {
    name: 'Receptionist',
    slug: 'receptionist',
    percentage: 92,
    order: 4,
    isActive: true,
  },
];

async function clearData() {
  await ExpertStaff.deleteMany({});
  await Hotel.deleteMany({});
  await Appointment.deleteMany({});
  await WhyChoose.deleteMany({});
  console.log('[Seed] Cleared existing data');
}

async function seedExpertStaff() {
  const created = await ExpertStaff.insertMany(expertStaffData);
  console.log(`[Seed] ExpertStaff: ${created.length} records`);
}

async function seedHotels() {
  const created = await Hotel.insertMany(hotelData);
  console.log(`[Seed] Hotels: ${created.length} records`);
}

async function seedWhyChoose() {
  const created = await WhyChoose.insertMany(whyChooseData);
  console.log(`[Seed] WhyChoose: ${created.length} records`);
}

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-interview';
  try {
    await mongoose.connect(uri);
    console.log('[Seed] Connected to MongoDB');
  } catch (err) {
    console.error('[Seed] MongoDB connection failed:', err.message);
    process.exit(1);
  }

  await clearData();
  await seedExpertStaff();
  await seedHotels();
  await seedWhyChoose();
  console.log('[Seed] Done');
  process.exit(0);
}

seed().catch((err) => {
  console.error('[Seed] Error:', err);
  process.exit(1);
});
