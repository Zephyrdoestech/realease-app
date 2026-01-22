// constants/data.ts

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
    id: '550e8400-e29b-41d4-a716-446655440000', // Valid UUID
    title: 'Avida Towers Cebu',
    price: 4500000,
    location: 'Cebu Business Park, Cebu City',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
    bedrooms: 2,
    bathrooms: 2,
    isVerified: true,
    agentName: 'Maria Santos',
    agentTrustScore: 9.2,
    latitude: 10.3181,
    longitude: 123.9059,
  },
  {
    id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', // Valid UUID
    title: 'Modern House in Talisay',
    price: 8750000,
    location: 'Talisay City, Cebu',
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop',
    bedrooms: 4,
    bathrooms: 3,
    isVerified: true,
    agentName: 'Juan dela Cruz',
    agentTrustScore: 8.8,
    latitude: 10.2449,
    longitude: 123.8492,
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', // Valid UUID
    title: 'Ayala Land Premier Condo',
    price: 12500000,
    location: 'Cebu IT Park, Cebu City',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
    bedrooms: 3,
    bathrooms: 2,
    isVerified: true,
    agentName: 'Sofia Reyes',
    agentTrustScore: 9.5,
    latitude: 10.3269,
    longitude: 123.9066,
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174000', // Valid UUID
    title: 'Townhouse in Lahug',
    price: 6200000,
    location: 'Lahug, Cebu City',
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
    bedrooms: 3,
    bathrooms: 2,
    isVerified: false,
    agentName: 'Pedro Garcia',
    agentTrustScore: 6.5,
    latitude: 10.3308,
    longitude: 123.8987,
  },
  {
    id: '987f6543-e21b-76d5-c432-109876543210', // Valid UUID
    title: 'Luxury Condo near SM Seaside',
    price: 15000000,
    location: 'South Road Properties, Cebu City',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
    bedrooms: 5,
    bathrooms: 4,
    isVerified: false,
    agentName: 'Carmen Lopez',
    agentTrustScore: 7.1,
    latitude: 10.2776,
    longitude: 123.8819,
  },
];