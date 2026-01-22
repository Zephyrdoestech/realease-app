import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ChevronDown, MapPin, Sparkles } from 'lucide-react-native';
import { PropertyCard } from '../../components/PropertyCard';
import { FilterChip } from '../../components/FilterChip';
import { mockProperties } from '@/constants/data';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [selectedCity, setSelectedCity] = useState('Cebu');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const router = useRouter();

  const filters = ['Near IT Park', 'Flood Free', 'Pet Friendly', 'With Parking', 'Furnished'];
  const featuredProperties = mockProperties.filter((p) => p.isVerified).slice(0, 3);
  const recentListings = mockProperties;

  // Function to open the AI Chat
  const openAIChat = () => {
    router.push({
      // IMPORTANT: Points to app/(tabs)/chat.tsx
      pathname: '/chat', 
      params: { id: featuredProperties[0]?.id } 
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-4 pt-4 pb-6 bg-white">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-sm text-gray-600 mb-1">Find your home in</Text>
                <TouchableOpacity activeOpacity={0.7} className="flex-row items-center">
                  <MapPin size={18} color="#0F766E" />
                  <Text className="text-xl font-bold text-gray-900 ml-1">{selectedCity}</Text>
                  <ChevronDown size={20} color="#6B7280" className="ml-1" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Search Input */}
            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
              <Search size={20} color="#9CA3AF" />
              <TextInput
                placeholder="Search for condo, house..."
                placeholderTextColor="#9CA3AF"
                className="flex-1 ml-3 text-base text-gray-900"
                editable={false}
              />
            </View>
          </View>

          {/* Filter Chips */}
          <View className="py-4 bg-white border-b border-gray-200">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
              {filters.map((filter) => (
                <FilterChip
                  key={filter}
                  label={filter}
                  selected={selectedFilter === filter}
                  onPress={() => setSelectedFilter(selectedFilter === filter ? null : filter)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Featured Section */}
          <View className="mt-6">
            <View className="px-4 mb-4 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-gray-900">Featured Properties</Text>
              <TouchableOpacity activeOpacity={0.7}><Text className="text-sm font-semibold text-teal-700">See All</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
              {featuredProperties.map((property) => (
                <View key={property.id} style={{ width: 300, marginRight: 16 }}><PropertyCard property={property} /></View>
              ))}
            </ScrollView>
          </View>

          {/* Recent Listings */}
          <View className="mt-6 px-4 pb-10">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-gray-900">Recent Listings</Text>
              <Text className="text-sm text-gray-600">{recentListings.length} properties</Text>
            </View>
            {recentListings.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </View>
        </ScrollView>

        {/* --- AI CHATBOT FLOATING BUTTON --- */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={openAIChat}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: '#0F766E', // Teal-700
            width: 60,
            height: 60,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center', // Corrected from align_items
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
          }}
        >
          <View>
            <Sparkles size={24} color="white" />
            {/* Red notification dot */}
            <View style={{ 
              position: 'absolute', 
              top: -5, 
              right: -5, 
              backgroundColor: '#EF4444', 
              width: 12, 
              height: 12, 
              borderRadius: 6, 
              borderWidth: 2, // Corrected from border_width
              borderColor: 'white' // Corrected from border_color
            }} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}