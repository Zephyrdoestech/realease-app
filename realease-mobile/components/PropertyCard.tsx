import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Bed, Bath, MapPin } from 'lucide-react-native';
import { VerifiedBadge } from './VerifiedBadge';

// Interface matching your data
interface PropertyCardProps {
  property: any; // Using any for flexibility with DB/Mock data types
  onPress?: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onPress }) => {
  const router = useRouter();
  
  const formatPrice = (price: number) => `₱${price.toLocaleString('en-PH')}`;

  const handlePress = () => {
    if (onPress) onPress();
    else router.push(`/property/${property.id}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      // ✅ DARK MODE: Background & Border
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm mb-4 border border-gray-100 dark:border-gray-700"
    >
      <View className="relative">
        <Image
          source={{ uri: property.imageUrl }}
          className="w-full h-48"
          resizeMode="cover"
        />
        <View className="absolute top-3 right-3">
          <VerifiedBadge isVerified={property.isVerified} />
        </View>
      </View>

      <View className="p-4">
        {/* ✅ DARK MODE: Text Colors */}
        <Text className="text-2xl font-bold text-teal-700 dark:text-teal-400 mb-1">
          {formatPrice(property.price)}
        </Text>

        <Text className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1" numberOfLines={1}>
          {property.title}
        </Text>

        <View className="flex-row items-center mb-3">
          <MapPin size={14} color="#6B7280" />
          <Text className="text-sm text-gray-600 dark:text-gray-400 ml-1" numberOfLines={1}>
            {property.location}
          </Text>
        </View>

        <View className="flex-row items-center gap-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center">
            <Bed size={16} color="#0F766E" />
            <Text className="text-sm text-gray-600 dark:text-gray-300 ml-1.5">
              {property.bedrooms} Beds
            </Text>
          </View>
          <View className="flex-row items-center">
            <Bath size={16} color="#0F766E" />
            <Text className="text-sm text-gray-600 dark:text-gray-300 ml-1.5">
              {property.bathrooms} Baths
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};