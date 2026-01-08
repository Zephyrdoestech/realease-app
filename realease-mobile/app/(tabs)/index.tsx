// app/(tabs)/index.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ChevronDown, MapPin } from 'lucide-react-native';
import { PropertyCard } from '../components/PropertyCard';
import { FilterChip } from '../components/FilterChip';
import { mockProperties } from '@/constants/data';

export default function HomeScreen() {
  const [selectedCity, setSelectedCity] = useState('Cebu');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const filters = [
    'Near IT Park',
    'Flood Free',
    'Pet Friendly',
    'With Parking',
    'Furnished',
  ];

  const featuredProperties = mockProperties.filter((p) => p.isVerified).slice(0, 3);
  const recentListings = mockProperties;

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-4 pb-6 bg-white">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-sm text-gray-600 mb-1">Find your home in</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                className="flex-row items-center"
              >
                <MapPin size={18} color="#0F766E" />
                <Text className="text-xl font-bold text-gray-900 ml-1">
                  {selectedCity}
                </Text>
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {filters.map((filter) => (
              <FilterChip
                key={filter}
                label={filter}
                selected={selectedFilter === filter}
                onPress={() =>
                  setSelectedFilter(selectedFilter === filter ? null : filter)
                }
              />
            ))}
          </ScrollView>
        </View>

        {/* Featured Section */}
        <View className="mt-6">
          <View className="px-4 mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-900">
              Featured Properties
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="text-sm font-semibold text-teal-700">
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {featuredProperties.map((property) => (
              <View key={property.id} style={{ width: 300, marginRight: 16 }}>
                <PropertyCard property={property} />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Recent Listings */}
        <View className="mt-6 px-4 pb-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-900">
              Recent Listings
            </Text>
            <Text className="text-sm text-gray-600">
              {recentListings.length} properties
            </Text>
          </View>

          {recentListings.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}