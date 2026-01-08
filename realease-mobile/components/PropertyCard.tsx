// components/PropertyCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Bed, Bath } from 'lucide-react-native';
import { VerifiedBadge } from './VerifiedBadge';
import { Property } from '@/constants/data';

interface PropertyCardProps {
  property: Property;
  onPress?: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onPress }) => {
  const router = useRouter();
  
  const formatPrice = (price: number): string => {
    return `₱${price.toLocaleString('en-PH')}`;
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/property/${property.id}`);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className="bg-white rounded-2xl overflow-hidden shadow-md mb-4"
    >
      {/* Image Container */}
      <View className="relative">
        <Image
          source={{ uri: property.imageUrl }}
          className="w-full h-48"
          resizeMode="cover"
        />
        {/* Verified Badge Overlay */}
        <View className="absolute top-3 right-3">
          <VerifiedBadge isVerified={property.isVerified} />
        </View>
      </View>

      {/* Content Container */}
      <View className="p-4">
        {/* Price */}
        <Text className="text-2xl font-bold text-gray-900 mb-1">
          {formatPrice(property.price)}
        </Text>

        {/* Title */}
        <Text className="text-base font-semibold text-gray-800 mb-1" numberOfLines={1}>
          {property.title}
        </Text>

        {/* Location */}
        <Text className="text-sm text-gray-600 mb-3" numberOfLines={1}>
          {property.location}
        </Text>

        {/* Bedrooms & Bathrooms */}
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center">
            <Bed size={16} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1.5">
              {property.bedrooms} Beds
            </Text>
          </View>
          <View className="flex-row items-center">
            <Bath size={16} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1.5">
              {property.bathrooms} Baths
            </Text>
          </View>
        </View>

        {/* Agent Info */}
        <View className="mt-3 pt-3 border-t border-gray-200">
          <Text className="text-xs text-gray-500">
            Agent: <Text className="font-medium text-gray-700">{property.agentName}</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};