// app/property/[id].tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Square,
  Shield,
  MessageCircle,
  Calendar,
} from 'lucide-react-native';
import { mockProperties } from '../../constants/data';
import { VerifiedBadge } from '../../components/VerifiedBadge';
import { Button } from '../../components/Button';

export default function PropertyDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // Find the property by ID
  const property = mockProperties.find((p) => p.id === id);

  if (!property) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-gray-600">Property not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatPrice = (price: number): string => {
    return `₱${price.toLocaleString('en-PH')}`;
  };

  // Mock PRC License (in real app, this would come from property data)
  const prcLicense = property.isVerified ? 'PRC-00' + property.id + '2345' : 'Not Verified';

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header with Back Button */}
      <View className="absolute top-12 left-4 z-10">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="bg-white rounded-full p-2 shadow-lg"
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Full-width Image */}
        <View className="relative">
          <Image
            source={{ uri: property.imageUrl }}
            className="w-full h-96"
            resizeMode="cover"
          />
          {/* Verified Badge on Image */}
          <View className="absolute top-4 right-4">
            <VerifiedBadge isVerified={property.isVerified} />
          </View>
        </View>

        {/* Content Container */}
        <View className="px-6 pt-6 pb-32">
          {/* Title */}
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            {property.title}
          </Text>

          {/* Price */}
          <Text className="text-4xl font-bold text-teal-700 mb-4">
            {formatPrice(property.price)}
          </Text>

          {/* Location */}
          <View className="flex-row items-center mb-6">
            <MapPin size={20} color="#6B7280" />
            <Text className="text-base text-gray-600 ml-2">
              {property.location}
            </Text>
          </View>

          {/* Property Details */}
          <View className="flex-row items-center mb-8 gap-6">
            <View className="flex-row items-center">
              <Bed size={24} color="#0F766E" />
              <View className="ml-2">
                <Text className="text-lg font-bold text-gray-900">
                  {property.bedrooms}
                </Text>
                <Text className="text-xs text-gray-600">Bedrooms</Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <Bath size={24} color="#0F766E" />
              <View className="ml-2">
                <Text className="text-lg font-bold text-gray-900">
                  {property.bathrooms}
                </Text>
                <Text className="text-xs text-gray-600">Bathrooms</Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <Square size={24} color="#0F766E" />
              <View className="ml-2">
                <Text className="text-lg font-bold text-gray-900">120</Text>
                <Text className="text-xs text-gray-600">sq m</Text>
              </View>
            </View>
          </View>

          {/* Trust Section */}
          <View className="bg-teal-50 border-2 border-teal-700 rounded-2xl p-6 mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-gray-900">
                Verified Agent
              </Text>
              <View className="bg-teal-700 rounded-full px-4 py-2">
                <Text className="text-white text-sm font-bold">
                  {Math.round(property.agentTrustScore * 10)}% Trust Score
                </Text>
              </View>
            </View>

            <View className="border-t border-teal-200 pt-4">
              <View className="flex-row items-start mb-3">
                <View className="bg-teal-700 rounded-full w-12 h-12 items-center justify-center mr-3">
                  <Text className="text-white text-lg font-bold">
                    {property.agentName.charAt(0)}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900 mb-1">
                    {property.agentName}
                  </Text>
                  <Text className="text-sm text-gray-600">Licensed Agent</Text>
                </View>
              </View>

              <View className="flex-row items-center bg-white rounded-lg p-3 mb-3">
                <Shield size={20} color="#0F766E" />
                <View className="ml-3 flex-1">
                  <Text className="text-xs text-gray-600 mb-1">
                    PRC License Number
                  </Text>
                  <Text className="text-sm font-bold text-gray-900">
                    {prcLicense}
                  </Text>
                </View>
              </View>

              {property.isVerified && (
                <View className="flex-row items-start bg-white rounded-lg p-3">
                  <Shield size={20} color="#0F766E" fill="#0F766E" />
                  <View className="ml-3 flex-1">
                    <Text className="text-sm font-semibold text-teal-700 mb-1">
                      Title Verified
                    </Text>
                    <Text className="text-xs text-gray-600">
                      Property title has been verified by RealEase
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Description Section */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-3">
              Description
            </Text>
            <Text className="text-base text-gray-700 leading-6">
              This stunning property offers modern living at its finest. Located in a prime area with easy access to business districts, schools, and shopping centers. Perfect for families or professionals looking for a convenient and comfortable lifestyle.
            </Text>
          </View>

          {/* Amenities Section */}
          <View>
            <Text className="text-xl font-bold text-gray-900 mb-3">
              Amenities
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {['Swimming Pool', 'Gym', '24/7 Security', 'Parking', 'Playground', 'Function Room'].map((amenity) => (
                <View
                  key={amenity}
                  className="bg-gray-100 rounded-lg px-4 py-2"
                >
                  <Text className="text-sm text-gray-700">{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Action Bar at Bottom */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button
              title="Message"
              onPress={() => console.log('Message agent')}
              variant="outline"
              icon={<MessageCircle size={20} color="#0F766E" />}
            />
          </View>
          <View className="flex-1">
            <Button
              title="Quick Reserve"
              onPress={() => router.push(`/checkout/${property.id}`)}
              variant="primary"
              icon={<Calendar size={20} color="#FFFFFF" />}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}