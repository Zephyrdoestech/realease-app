export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  imageUrl: string;
  bedrooms: number;
  bathrooms: number;
  isVerified: boolean;
  agentName: string;
  agentTrustScore: number;
  latitude: number;
  longitude: number;
}

export const mockProperties: Property[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Avida Towers Riala - Studio',
    price: 4200000,
    location: 'Cebu IT Park, Lahug',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000&auto=format&fit=crop',
    bedrooms: 1,
    bathrooms: 1,
    isVerified: true,
    agentName: 'Maria Santos',
    agentTrustScore: 9.2,
    latitude: 10.3295,
    longitude: 123.9056,
  },
  {
    id: 'a1b2c3d4-e5f6-4001-a1b2-c3d4e5f6a1b2',
    title: 'Modern Villa with Pool',
    price: 15500000,
    location: 'Amihan, Talisay City',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop',
    bedrooms: 4,
    bathrooms: 3,
    isVerified: true,
    agentName: 'Juan dela Cruz',
    agentTrustScore: 8.8,
    latitude: 10.2449,
    longitude: 123.8492,
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    title: 'Solinea Resort Residence',
    price: 9800000,
    location: 'Cebu Business Park',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop',
    bedrooms: 2,
    bathrooms: 2,
    isVerified: true,
    agentName: 'Sofia Reyes',
    agentTrustScore: 9.5,
    latitude: 10.3175,
    longitude: 123.9060,
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Lahug Family Townhouse',
    price: 6800000,
    location: 'Beverly Hills, Lahug',
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000&auto=format&fit=crop',
    bedrooms: 3,
    bathrooms: 2,
    isVerified: false,
    agentName: 'Pedro Garcia',
    agentTrustScore: 6.5,
    latitude: 10.3358,
    longitude: 123.8947,
  },
  {
    id: '987f6543-e21b-76d5-c432-109876543210',
    title: 'Sea-view Condo SRP',
    price: 12000000,
    location: 'South Road Properties',
    imageUrl: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?q=80&w=1000&auto=format&fit=crop',
    bedrooms: 2,
    bathrooms: 2,
    isVerified: true,
    agentName: 'Carmen Lopez',
    agentTrustScore: 9.1,
    latitude: 10.2776,
    longitude: 123.8819,
  },
  {
    id: 'e0e0e0e0-e0e0-e0e0-e0e0-e0e0e0e0e0e0',
    title: 'Beachfront Villa Mactan',
    price: 28000000,
    location: 'Punta Engaño, Lapu-Lapu',
    imageUrl: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=1000&auto=format&fit=crop',
    bedrooms: 5,
    bathrooms: 5,
    isVerified: true,
    agentName: 'Elena White',
    agentTrustScore: 9.9,
    latitude: 10.3105,
    longitude: 123.9854,
  }
];