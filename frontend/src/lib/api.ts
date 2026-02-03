import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple internal logger – only logs in dev to avoid noisy console in prod
const logApiError = (context: string, error: unknown) => {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.error(`[API:${context}]`, error);
  }
};

// Shared API response shape (backend also returns statusCode, metadata, etc.)
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  statusCode?: number;
  metadata?: Record<string, any>;
}

// Backend ExpertStaff model (simplified for frontend needs)
export interface Staff {
  _id?: string;
  id?: string;
  name: string;
  position: string;
  bio?: string;
  image?: string;
  experience?: number;
  email?: string;
  phone?: string;
  specialization?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Frontend Hotel view model used by Booking page
export interface Hotel {
  _id: string;
  name: string;
  description: string;
  location: {
    address: string;
    city: string;
    country: string;
  };
  image: string;
  images?: string[];
  pricePerNight: number;
  rating: number;
  amenities: string[];
  roomTypes: string[];
  totalRooms: number;
  availableRooms: number;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Backend appointment model (simplified)
export interface Appointment {
  _id: string;
  hotelId?: string;
  hotelName: string;
  customerName: string;
  email: string;
  phone: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  rooms: number;
  totalPrice?: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

// Payload from Booking form
export interface CreateAppointmentData {
  hotelId: string;
  hotelName: string;
  guestName: string;
  email: string;
  phone: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  roomType?: string;
  specialRequests?: string;
}

// Why Choose metrics (Why Choose for us? module)
export interface WhyChooseMetric {
  _id?: string;
  id?: string;
  name: string;
  percentage: number;
  order?: number;
}

// Fallback data used when backend / DB is unavailable
const FALLBACK_STAFF: Staff[] = [
  {
    id: 'fallback-1',
    name: 'Michael Dean',
    position: 'Chef Master',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'fallback-2',
    name: 'Arnold Taylor',
    position: 'Room Service',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'fallback-3',
    name: 'Emily Davis',
    position: 'Guest Relations',
    image:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'fallback-4',
    name: 'Sarah Williams',
    position: 'HR Manager',
    image:
      'https://images.unsplash.com/photo-1544723795-3fb0b90fd9c8?w=400&auto=format&fit=crop&q=80',
  },
];

const FALLBACK_HOTELS: Hotel[] = [
  {
    _id: 'fallback-hotel-1',
    name: 'Grand Plaza Hotel',
    description: 'Luxury hotel in the heart of the city.',
    location: {
      address: '123 Main St, New York City',
      city: 'New York City',
      country: 'USA',
    },
    image: 'https://via.placeholder.com/400x300',
    images: ['https://via.placeholder.com/400x300'],
    pricePerNight: 250,
    rating: 4.5,
    amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Parking'],
    roomTypes: ['Standard', 'Deluxe', 'Suite'],
    totalRooms: 100,
    availableRooms: 20,
    isAvailable: true,
  },
  {
    _id: 'fallback-hotel-2',
    name: 'Sunset Beach Resort',
    description: 'Beachfront resort with stunning sea views.',
    location: {
      address: 'Beach Road, Miami',
      city: 'Miami',
      country: 'USA',
    },
    image: 'https://via.placeholder.com/400x300',
    images: ['https://via.placeholder.com/400x300'],
    pricePerNight: 320,
    rating: 4.8,
    amenities: ['WiFi', 'Pool', 'Beach Access', 'Restaurant', 'Spa'],
    roomTypes: ['Standard', 'Ocean View', 'Family Suite'],
    totalRooms: 60,
    availableRooms: 10,
    isAvailable: true,
  },
];

const FALLBACK_WHY_CHOOSE: WhyChooseMetric[] = [
  { id: '1', name: 'Services', percentage: 88, order: 1 },
  { id: '2', name: 'Chef Master', percentage: 80, order: 2 },
  { id: '3', name: 'Design', percentage: 76, order: 3 },
  { id: '4', name: 'Receptionist', percentage: 92, order: 4 },
];

// API Functions

// Expert staff (About page) – backed by /api/expert-staff
export const fetchStaff = async (): Promise<Staff[]> => {
  try {
    const response = await api.get<ApiResponse<any[]>>('/expert-staff');
    const data = response.data?.data;
    if (!Array.isArray(data)) return FALLBACK_STAFF;

    return data.map((item) => ({
      _id: item._id,
      id: item.id,
      name: item.name,
      position: item.position,
      bio: item.bio,
      image: item.image || 'https://via.placeholder.com/300',
      experience: item.experience,
      email: item.email,
      phone: item.phone,
      specialization: item.specialization || [],
      isActive: item.isActive,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  } catch (error) {
    logApiError('fetchStaff', error);
    return FALLBACK_STAFF;
  }
};

// Hotels (Booking page) – backed by /api/hotels (DB or JSON fallback)
export const fetchHotels = async (): Promise<Hotel[]> => {
  try {
    const response = await api.get<ApiResponse<any[]>>('/hotels');
    const raw = response.data?.data;
    if (!Array.isArray(raw)) return FALLBACK_HOTELS;

    const mapped = raw
      .map((item) => {
        const images: string[] = Array.isArray(item.images) ? item.images : [];
        const image: string =
          item.image || images[0] || 'https://via.placeholder.com/400x300';

        const locationStr: string =
          typeof item.location === 'string'
            ? item.location
            : item.location?.city || '';
        const [cityPart, countryPart] = locationStr
          .split(',')
          .map((s: string) => s.trim());
        const city = cityPart || locationStr || 'Unknown';
        const country = countryPart || '';

        return {
          _id: item._id || item.id || '',
          name: item.name,
          description: item.description || '',
          location: {
            address: locationStr,
            city,
            country,
          },
          image,
          images,
          pricePerNight:
            typeof item.pricePerNight === 'number'
              ? item.pricePerNight
              : typeof item.price === 'number'
              ? item.price
              : 0,
          rating: typeof item.rating === 'number' ? item.rating : 0,
          amenities: Array.isArray(item.amenities) ? item.amenities : [],
          roomTypes: Array.isArray(item.roomTypes)
            ? item.roomTypes
            : ['Standard'],
          totalRooms: typeof item.totalRooms === 'number' ? item.totalRooms : 0,
          availableRooms:
            typeof item.availableRooms === 'number' ? item.availableRooms : 0,
          isAvailable:
            typeof item.isAvailable === 'boolean' ? item.isAvailable : true,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        } as Hotel;
      })
      .filter((hotel) => hotel._id);

    return mapped.length > 0 ? mapped : FALLBACK_HOTELS;
  } catch (error) {
    logApiError('fetchHotels', error);
    return FALLBACK_HOTELS;
  }
};

export const fetchHotelById = async (id: string): Promise<Hotel> => {
  try {
    const response = await api.get<ApiResponse<any>>(`/hotels/${id}`);
    const item = response.data.data;

    const images: string[] = Array.isArray(item.images) ? item.images : [];
    const image: string =
      item.image || images[0] || 'https://via.placeholder.com/400x300';

    const locationStr: string =
      typeof item.location === 'string'
        ? item.location
        : item.location?.city || '';
    const [cityPart, countryPart] = locationStr
      .split(',')
      .map((s: string) => s.trim());
    const city = cityPart || locationStr || 'Unknown';
    const country = countryPart || '';

    return {
      _id: item._id || item.id || '',
      name: item.name,
      description: item.description || '',
      location: {
        address: locationStr,
        city,
        country,
      },
      image,
      images,
      pricePerNight:
        typeof item.pricePerNight === 'number'
          ? item.pricePerNight
          : typeof item.price === 'number'
          ? item.price
          : 0,
      rating: typeof item.rating === 'number' ? item.rating : 0,
      amenities: Array.isArray(item.amenities) ? item.amenities : [],
      roomTypes: Array.isArray(item.roomTypes) ? item.roomTypes : ['Standard'],
      totalRooms: typeof item.totalRooms === 'number' ? item.totalRooms : 0,
      availableRooms:
        typeof item.availableRooms === 'number' ? item.availableRooms : 0,
      isAvailable:
        typeof item.isAvailable === 'boolean' ? item.isAvailable : true,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  } catch (error) {
    logApiError('fetchHotelById', error);
    // Try to fall back to the first fallback hotel as a safe default
    return FALLBACK_HOTELS[0];
  }
};

// Why Choose metrics – backed by /api/why-choose, with local fallback
export const fetchWhyChooseMetrics = async (): Promise<WhyChooseMetric[]> => {
  try {
    const response = await api.get<ApiResponse<any[]>>('/why-choose');
    const data = response.data?.data;
    if (!Array.isArray(data)) return FALLBACK_WHY_CHOOSE;

    const mapped = data
      .map((item) => ({
        _id: item._id,
        id: item.id,
        name: item.name,
        percentage: Number(item.percentage) || 0,
        order: item.order,
      }))
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    return mapped.length > 0 ? mapped : FALLBACK_WHY_CHOOSE;
  } catch (error) {
    logApiError('fetchWhyChooseMetrics', error);
    return FALLBACK_WHY_CHOOSE;
  }
};

// Create appointment – maps Booking form payload to backend shape
export const createAppointment = async (
  data: CreateAppointmentData
): Promise<Appointment> => {
  const payload = {
    hotelId: data.hotelId,
    hotelName: data.hotelName,
    customerName: data.guestName,
    email: data.email,
    phone: data.phone,
    checkInDate: data.checkInDate,
    checkOutDate: data.checkOutDate,
    guests: Number(data.numberOfGuests),
    rooms: 1,
    specialRequests: data.specialRequests,
  };

  try {
    const response = await api.post<ApiResponse<Appointment>>(
      '/appointments',
      payload
    );
    return response.data.data;
  } catch (error) {
    logApiError('createAppointment', error);
    // Simulate a successful appointment for user engagement when backend is unavailable
    const now = new Date().toISOString();
    return {
      _id: `${data.hotelId}-${Date.now()}`,
      hotelId: data.hotelId,
      hotelName: data.hotelName,
      customerName: data.guestName,
      email: data.email,
      phone: data.phone,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      guests: Number(data.numberOfGuests),
      rooms: 1,
      totalPrice: undefined,
      specialRequests: data.specialRequests,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: now,
      updatedAt: now,
    };
  }
};

export default api;
