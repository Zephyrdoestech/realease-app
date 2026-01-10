import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Platform, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Search as SearchIcon, List, Map as MapIcon } from 'lucide-react-native';

// ✅ NEW IMPORTS
import { useProperties } from '@/hooks/useProperties'; // <--- Your new Real Data Hook
import { MapMarker } from '@/components/MapMarker';
import { PropertyCard } from '@/components/PropertyCard';

type ViewMode = 'map' | 'list';

export default function SearchScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  
  // ✅ USE THE HOOK
  const { properties, loading } = useProperties();
  
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const initialRegion = {
    latitude: 10.3157,
    longitude: 123.8854,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  };

  // ✅ FILTER LOGIC (Applied to Real Data)
  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.location_text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to map DB data to UI format
  const mapToUI = (dbProp: any) => ({
    id: dbProp.id,
    title: dbProp.title,
    price: dbProp.price,
    location: dbProp.location_text, // Map DB column to UI prop
    imageUrl: dbProp.images?.[0] || 'https://via.placeholder.com/400', // Handle array
    bedrooms: dbProp.bedrooms,
    bathrooms: dbProp.bathrooms,
    isVerified: dbProp.is_title_verified,
    agentName: dbProp.agent?.full_name || 'Unknown Agent',
    agentTrustScore: dbProp.agent?.trust_score || 0,
    latitude: dbProp.latitude,
    longitude: dbProp.longitude
  });

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#0F766E" />
        <Text className="text-gray-500 mt-2">Loading properties...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['top']}>
      {/* Header */}
      <View className="absolute top-12 left-4 right-4 z-10">
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-lg">
          <SearchIcon size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search location..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-base text-gray-900"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Main View */}
      {viewMode === 'map' ? (
        <MapView
          ref={mapRef}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          style={{ flex: 1 }}
          initialRegion={initialRegion}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {filteredProperties.map((dbProp) => {
            // Safety Check
            if (!dbProp.latitude || !dbProp.longitude) return null;
            
            // Convert to UI format
            const uiProp = mapToUI(dbProp);

            return (
              <Marker
                key={uiProp.id}
                coordinate={{
                  latitude: uiProp.latitude,
                  longitude: uiProp.longitude,
                }}
                onPress={() => setSelectedPropertyId(uiProp.id)}
                tracksViewChanges={false}
              >
                <MapMarker
                  price={uiProp.price}
                  isSelected={selectedPropertyId === uiProp.id}
                />
                
                <Callout tooltip onPress={() => router.push(`/property/${uiProp.id}`)}>
                  <TouchableOpacity className="bg-white rounded-xl shadow-lg overflow-hidden w-60">
                    <Image source={{ uri: uiProp.imageUrl }} className="w-full h-32" resizeMode="cover" />
                    <View className="p-3">
                      <Text className="text-lg font-bold text-teal-700">₱{(uiProp.price/1000000).toFixed(1)}M</Text>
                      <Text className="text-sm font-semibold text-gray-900" numberOfLines={1}>{uiProp.title}</Text>
                      {uiProp.isVerified && (
                        <Text className="text-xs text-teal-700 mt-1 font-bold">✓ Verified</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </Callout>
              </Marker>
            );
          })}
        </MapView>
      ) : (
        <FlatList
          data={filteredProperties.map(mapToUI)}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingTop: 80, paddingBottom: 100 }}
          renderItem={({ item }) => <PropertyCard property={item} />}
        />
      )}

      {/* Toggle Button */}
      <View className="absolute bottom-6 left-0 right-0 items-center z-10">
        <TouchableOpacity
          onPress={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
          activeOpacity={0.8}
          className="bg-teal-700 rounded-full px-6 py-3 shadow-lg flex-row items-center"
        >
          {viewMode === 'map' ? (
            <><List size={20} color="white" /><Text className="text-white font-semibold ml-2">List View</Text></>
          ) : (
            <><MapIcon size={20} color="white" /><Text className="text-white font-semibold ml-2">Map View</Text></>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}