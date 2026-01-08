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
}

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Avida Towers Riala - 1BR',
    price: 4500000,
    location: 'IT Park, Cebu City',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    bedrooms: 1,
    bathrooms: 1,
    isVerified: true,
    agentName: 'Maria Santos',
    agentTrustScore: 9.8,
  },
  {
    id: '2',
    title: 'Modern House & Lot in Talisay',
    price: 8500000,
    location: 'Talisay City, Cebu',
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    bedrooms: 3,
    bathrooms: 2,
    isVerified: true,
    agentName: 'Juan Dela Cruz',
    agentTrustScore: 9.5,
  },
  {
    id: '3',
    title: 'Studio Unit near Ayala',
    price: 3200000,
    location: 'Cebu Business Park',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    bedrooms: 0,
    bathrooms: 1,
    isVerified: false,
    agentName: 'New Agent',
    agentTrustScore: 5.0,
  },
  {
    id: '4',
    title: 'Family Home in Banilad',
    price: 12000000,
    location: 'Banilad, Cebu City',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-22b891d59418?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    bedrooms: 4,
    bathrooms: 3,
    isVerified: true,
    agentName: 'Sarah Go',
    agentTrustScore: 9.9,
  },
];