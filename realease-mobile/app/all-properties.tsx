import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, ArrowLeft, SlidersHorizontal } from 'lucide-react-native';
import { PropertyCard } from '@/components/PropertyCard';
import { FilterChip } from '@/components/FilterChip';
import { mockProperties } from '@/constants/data';

export default function AllPropertiesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const filters = ['Near IT Park', 'Flood Free', 'Pet Friendly', 'With Parking', 'Furnished', 'Verified Only'];

  // Filter properties based on search and selected filter
  const filteredProperties = mockProperties.filter((property) => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = !selectedFilter || 
      (selectedFilter === 'Verified Only' ? property.isVerified : true);
    
    return matchesSearch && matchesFilter;
  });

  // Sort by verified first, then by price
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (a.isVerified && !b.isVerified) return -1;
    if (!a.isVerified && b.isVerified) return 1;
    return b.price - a.price;
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white px-4 pt-4 pb-3 border-b border-gray-200">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity 
            onPress={() => router.back()} 
            activeOpacity={0.7}
            className="mr-3"
          >
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900">All Properties</Text>
            <Text className="text-sm text-gray-600 mt-0.5">
              {sortedProperties.length} {sortedProperties.length === 1 ? 'property' : 'properties'} available
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search properties..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-base text-gray-900"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
              <Text className="text-teal-700 font-semibold">Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Chips */}
      <View className="py-3 bg-white border-b border-gray-200">
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
              onPress={() => setSelectedFilter(selectedFilter === filter ? null : filter)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Properties List */}
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        {sortedProperties.length > 0 ? (
          sortedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))
        ) : (
          <View className="items-center justify-center py-20">
            <SlidersHorizontal size={48} color="#D1D5DB" />
            <Text className="text-gray-500 text-base mt-4">No properties found</Text>
            <Text className="text-gray-400 text-sm mt-1">Try adjusting your filters</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}