import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Bed, Bath, Square, Shield, MessageCircle, Calendar } from 'lucide-react-native';
import { supabase } from '@/lib/supabase'; // ✅ Use Supabase
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { Button } from '@/components/Button';

export default function PropertyDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Real Data
  useEffect(() => {
    async function fetchDetails() {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*, agent:profiles(*)')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setProperty(data);
      } catch (e) {
        console.log("Error loading property:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <ActivityIndicator size="large" color="#0F766E" />
      </View>
    );
  }

  if (!property) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 items-center justify-center">
        <Text className="text-lg text-gray-600 dark:text-gray-400">Property not found</Text>
      </SafeAreaView>
    );
  }

  const formatPrice = (price: number) => `₱${price.toLocaleString('en-PH')}`;
  const prcLicense = property.agent?.prc_license_number || 'Pending Verification';
  const imageUrl = property.images?.[0] || 'https://via.placeholder.com/400';
  const isVerified = property.is_title_verified;

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={['top']}>
      {/* Back Button */}
      <View className="absolute top-12 left-4 z-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg"
        >
          <ArrowLeft size={24} className="text-gray-900 dark:text-white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View className="relative">
          <Image source={{ uri: imageUrl }} className="w-full h-96" resizeMode="cover" />
          <View className="absolute top-4 right-4">
            <VerifiedBadge isVerified={isVerified} />
          </View>
        </View>

        {/* Content */}
        <View className="px-6 pt-6 pb-32">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {property.title}
          </Text>

          <Text className="text-4xl font-bold text-teal-700 dark:text-teal-400 mb-4">
            {formatPrice(property.price)}
          </Text>

          <View className="flex-row items-center mb-6">
            <MapPin size={20} color="#6B7280" />
            <Text className="text-base text-gray-600 dark:text-gray-400 ml-2">
              {property.location_text}
            </Text>
          </View>

          {/* Stats */}
          <View className="flex-row items-center mb-8 gap-6">
            <View className="flex-row items-center">
              <Bed size={24} color="#0F766E" />
              <Text className="ml-2 font-bold text-gray-900 dark:text-white">{property.bedrooms} Beds</Text>
            </View>
            <View className="flex-row items-center">
              <Bath size={24} color="#0F766E" />
              <Text className="ml-2 font-bold text-gray-900 dark:text-white">{property.bathrooms} Bath</Text>
            </View>
            <View className="flex-row items-center">
              <Square size={24} color="#0F766E" />
              <Text className="ml-2 font-bold text-gray-900 dark:text-white">120 sq m</Text>
            </View>
          </View>

          {/* Trust Section */}
          <View className="bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-700 dark:border-teal-500 rounded-2xl p-6 mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-gray-900 dark:text-white">Verified Agent</Text>
              <View className="bg-teal-700 rounded-full px-4 py-2">
                <Text className="text-white text-sm font-bold">{property.agent?.trust_score || 0}% Trust</Text>
              </View>
            </View>

            <View className="border-t border-teal-200 dark:border-teal-700 pt-4">
              <View className="flex-row items-start mb-3">
                <View className="bg-teal-700 rounded-full w-12 h-12 items-center justify-center mr-3">
                  <Text className="text-white text-lg font-bold">{property.agent?.full_name?.charAt(0) || 'A'}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900 dark:text-white">{property.agent?.full_name}</Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">Licensed Agent</Text>
                </View>
              </View>

              <View className="flex-row items-center bg-white dark:bg-gray-800 rounded-lg p-3 mb-3">
                <Shield size={20} color="#0F766E" />
                <View className="ml-3 flex-1">
                  <Text className="text-xs text-gray-600 dark:text-gray-400 mb-1">PRC License Number</Text>
                  <Text className="text-sm font-bold text-gray-900 dark:text-white">{prcLicense}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-3">Description</Text>
            <Text className="text-base text-gray-700 dark:text-gray-300 leading-6">
              {property.description || "No description provided."}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button
              title="Message"
              onPress={() => router.push(`/chat/${property.id}`)}
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