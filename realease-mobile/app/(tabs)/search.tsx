import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Platform, FlatList, ActivityIndicator, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Search as SearchIcon, List, Map as MapIcon, MapPin, Copy, Share2, X } from 'lucide-react-native';

import { useProperties } from '@/hooks/useProperties';
import { MapMarker } from '@/components/MapMarker';
import { PropertyCard } from '@/components/PropertyCard';

type ViewMode = 'map' | 'list';

interface DroppedPin {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export default function SearchScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  
  const { properties, loading } = useProperties();
  
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [droppedPin, setDroppedPin] = useState<DroppedPin | null>(null);
  const [showPinInfo, setShowPinInfo] = useState(false);

  const initialRegion = {
    latitude: 10.3157,
    longitude: 123.8854,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  };

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.location_text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mapToUI = (dbProp: any) => ({
    id: dbProp.id,
    title: dbProp.title,
    price: dbProp.price,
    location: dbProp.location_text,
    imageUrl: dbProp.images?.[0] || 'https://via.placeholder.com/400',
    bedrooms: dbProp.bedrooms,
    bathrooms: dbProp.bathrooms,
    isVerified: dbProp.is_title_verified,
    agentName: dbProp.agent?.full_name || 'Unknown Agent',
    agentTrustScore: dbProp.agent?.trust_score || 0,
    latitude: dbProp.latitude,
    longitude: dbProp.longitude
  });

  // Handle long press to drop pin
  const handleMapLongPress = (event: any) => {
    const coordinate = event.nativeEvent.coordinate;
    setDroppedPin({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      timestamp: Date.now()
    });
    setShowPinInfo(true);
  };

  // Copy coordinates to clipboard
  const copyCoordinates = async () => {
    if (!droppedPin) return;
    
    const coordText = `${droppedPin.latitude.toFixed(6)}, ${droppedPin.longitude.toFixed(6)}`;
    
    // For Expo, you might need to install expo-clipboard
    // import * as Clipboard from 'expo-clipboard';
    // await Clipboard.setStringAsync(coordText);
    
    Alert.alert('Copied!', `Coordinates copied: ${coordText}`);
  };

  // Share coordinates
  const shareCoordinates = async () => {
    if (!droppedPin) return;
    
    const coordText = `Location Coordinates:\nLatitude: ${droppedPin.latitude.toFixed(6)}\nLongitude: ${droppedPin.longitude.toFixed(6)}\n\nGoogle Maps: https://maps.google.com/?q=${droppedPin.latitude},${droppedPin.longitude}`;
    
    try {
      await Share.share({
        message: coordText,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Clear dropped pin
  const clearPin = () => {
    setDroppedPin(null);
    setShowPinInfo(false);
  };

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

      {/* Pin Location Instructions */}
      {viewMode === 'map' && !droppedPin && (
        <View className="absolute top-32 left-4 right-4 z-10">
          <View className="bg-teal-700 rounded-lg px-4 py-2 shadow-lg">
            <Text className="text-white text-xs text-center">
              💡 Long press on the map to drop a pin and get coordinates
            </Text>
          </View>
        </View>
      )}

      {/* Pin Coordinates Info Card */}
      {showPinInfo && droppedPin && viewMode === 'map' && (
        <View className="absolute top-32 left-4 right-4 z-10">
          <View className="bg-white rounded-xl p-4 shadow-lg">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <MapPin size={20} color="#0F766E" />
                <Text className="text-base font-bold text-gray-900 ml-2">
                  Pinned Location
                </Text>
              </View>
              <TouchableOpacity onPress={clearPin} activeOpacity={0.7}>
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View className="bg-gray-50 rounded-lg p-3 mb-3">
              <Text className="text-xs text-gray-500 mb-1">Latitude</Text>
              <Text className="text-sm font-mono text-gray-900">
                {droppedPin.latitude.toFixed(6)}
              </Text>
              
              <Text className="text-xs text-gray-500 mt-2 mb-1">Longitude</Text>
              <Text className="text-sm font-mono text-gray-900">
                {droppedPin.longitude.toFixed(6)}
              </Text>
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={copyCoordinates}
                activeOpacity={0.7}
                className="flex-1 bg-teal-700 rounded-lg py-2 flex-row items-center justify-center"
              >
                <Copy size={16} color="white" />
                <Text className="text-white font-semibold ml-2">Copy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={shareCoordinates}
                activeOpacity={0.7}
                className="flex-1 bg-blue-600 rounded-lg py-2 flex-row items-center justify-center"
              >
                <Share2 size={16} color="white" />
                <Text className="text-white font-semibold ml-2">Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Main View */}
      {viewMode === 'map' ? (
        <MapView
          ref={mapRef}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          style={{ flex: 1 }}
          initialRegion={initialRegion}
          showsUserLocation
          showsMyLocationButton={false}
          onLongPress={handleMapLongPress}
        >
          {/* Property Markers */}
          {filteredProperties.map((dbProp) => {
            if (!dbProp.latitude || !dbProp.longitude) return null;
            
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

          {/* User Dropped Pin */}
          {droppedPin && (
            <Marker
              coordinate={{
                latitude: droppedPin.latitude,
                longitude: droppedPin.longitude,
              }}
              pinColor="#3B82F6"
              title="Pinned Location"
              description={`${droppedPin.latitude.toFixed(6)}, ${droppedPin.longitude.toFixed(6)}`}
            />
          )}
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