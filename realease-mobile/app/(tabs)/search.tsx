// app/(tabs)/search.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Search as SearchIcon, List, Map as MapIcon } from 'lucide-react-native';
import { mockProperties } from '@/constants/data';
import { MapMarker } from '../../components/MapMarker';
import { PropertyCard } from '../../components/PropertyCard';

type ViewMode = 'map' | 'list';

export default function SearchScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // Cebu City center coordinates
  const initialRegion = {
    latitude: 10.3157,
    longitude: 123.8854,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  };

  const formatPrice = (price: number): string => {
    if (price >= 1000000) {
      return `₱${(price / 1000000).toFixed(1)}M`;
    }
    return `₱${(price / 1000).toFixed(0)}k`;
  };

  const handleMarkerPress = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
  };

  const handleCalloutPress = (propertyId: string) => {
    router.push(`/property/${propertyId}`);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'map' ? 'list' : 'map');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['top']}>
      {/* Search Bar Overlay */}
      <View className="absolute top-12 left-4 right-4 z-10">
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-lg">
          <SearchIcon size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search location, property..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-base text-gray-900"
          />
        </View>
      </View>

      {/* Map or List View */}
      {viewMode === 'map' ? (
        <MapView
          ref={mapRef}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          style={{ flex: 1 }}
          initialRegion={initialRegion}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {mockProperties.map((property) => (
            <Marker
              key={property.id}
              coordinate={{
                latitude: property.latitude,
                longitude: property.longitude,
              }}
              onPress={() => handleMarkerPress(property.id)}
              tracksViewChanges={false}
            >
              <MapMarker
                price={property.price}
                isSelected={selectedPropertyId === property.id}
              />
              <Callout
                tooltip
                onPress={() => handleCalloutPress(property.id)}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                  style={{ width: 240 }}
                >
                  <Image
                    source={{ uri: property.imageUrl }}
                    className="w-full h-32"
                    resizeMode="cover"
                  />
                  <View className="p-3">
                    <Text className="text-lg font-bold text-teal-700 mb-1">
                      {formatPrice(property.price)}
                    </Text>
                    <Text
                      className="text-sm font-semibold text-gray-900 mb-1"
                      numberOfLines={1}
                    >
                      {property.title}
                    </Text>
                    <Text className="text-xs text-gray-600" numberOfLines={1}>
                      {property.location}
                    </Text>
                    {property.isVerified && (
                      <View className="mt-2 bg-teal-50 rounded-full px-2 py-1 self-start">
                        <Text className="text-xs font-semibold text-teal-700">
                          ✓ Verified
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </Callout>
            </Marker>
          ))}
        </MapView>
      ) : (
        <FlatList
          data={mockProperties}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            padding: 16,
            paddingTop: 80, // Space for search bar
            paddingBottom: 100, // Space for toggle button
          }}
          renderItem={({ item }) => <PropertyCard property={item} />}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* View Toggle Button */}
      <View className="absolute bottom-6 left-0 right-0 items-center z-10">
        <TouchableOpacity
          onPress={toggleViewMode}
          activeOpacity={0.8}
          className="bg-teal-700 rounded-full px-6 py-3 shadow-lg flex-row items-center"
        >
          {viewMode === 'map' ? (
            <>
              <List size={20} color="#FFFFFF" />
              <Text className="text-white font-semibold ml-2">List View</Text>
            </>
          ) : (
            <>
              <MapIcon size={20} color="#FFFFFF" />
              <Text className="text-white font-semibold ml-2">Map View</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}