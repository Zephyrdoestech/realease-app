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
import { Search as SearchIcon, List, Map as MapIcon, MapPin } from 'lucide-react-native';
import { mockProperties } from '@/constants/data';
import { PropertyCard } from '@/components/PropertyCard';

// Conditional import for MapView (only on mobile)
let MapView: any = null;
let Marker: any = null;
let Callout: any = null;
let PROVIDER_GOOGLE: any = null;
let MapMarker: any = null;

if (Platform.OS !== 'web') {
  const MapLibrary = require('react-native-maps');
  MapView = MapLibrary.default;
  Marker = MapLibrary.Marker;
  Callout = MapLibrary.Callout;
  PROVIDER_GOOGLE = MapLibrary.PROVIDER_GOOGLE;
  
  const { MapMarker: MapMarkerComponent } = require('@/components/MapMarker');
  MapMarker = MapMarkerComponent;
}

type ViewMode = 'map' | 'list';

export default function SearchScreen() {
  const router = useRouter();
  const mapRef = useRef<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

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

  // WEB FALLBACK - CRITICAL FOR WEB SAFETY
  if (Platform.OS === 'web') {
    return (
      <SafeAreaView className="flex-1 bg-gray-100" edges={['top']}>
        <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">Search</Text>
          <Text className="text-sm text-gray-600 mt-1">
            Find properties in Cebu
          </Text>
        </View>

        {/* Web Fallback Message */}
        <View className="flex-1 items-center justify-center px-6">
          <View className="bg-teal-100 rounded-full p-6 mb-4">
            <MapPin size={48} color="#0F766E" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Map View Available on Mobile
          </Text>
          <Text className="text-base text-gray-600 text-center mb-6">
            The interactive map feature is optimized for mobile devices. View the list below to browse properties.
          </Text>

          {/* Show List on Web */}
          <View className="w-full max-w-2xl">
            <FlatList
              data={mockProperties}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <PropertyCard property={item} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // MOBILE VERSION - FULL MAP FUNCTIONALITY
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
          {mockProperties.map((property) => {
            // CRITICAL SAFETY CHECK - Prevent crashes
            if (!property.latitude || !property.longitude) {
              return null;
            }

            return (
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
            );
          })}
        </MapView>
      ) : (
        <FlatList
          data={mockProperties}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            padding: 16,
            paddingTop: 80,
            paddingBottom: 100,
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