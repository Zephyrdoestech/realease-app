import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Plus, Eye, MapPin, Home, Shield, TrendingUp } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/ctx/AuthContext';

// ✅ FIX: Updated interface to match Database response loosely
interface Property {
  id: string;
  title: string;
  price: number;
  location_text: string;
  images: string[] | null;
  status: string;
  views_count: number;
  favorites_count: number;
  created_at: string;
  // Add optional fields to prevent type errors
  agent_id?: string;
  amenities?: string[] | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  description?: string | null;
}

export default function SellerDashboard() {
  const { session, profile, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProperties = async (userId: string) => {
    try {
      if (!userId) return;

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('agent_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // ✅ FIX: Cast data to 'any' to avoid strict type mismatch errors
      setProperties((data as any) || []);
    } catch (error) {
      console.log('Error fetching properties:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Reload when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (session?.user.id) {
        fetchProperties(session.user.id);
      }
    }, [session?.user.id])
  );

  const onRefresh = () => {
    setRefreshing(true);
    if (session?.user.id) fetchProperties(session.user.id);
  };

  const formatPrice = (price: number) => {
    return `₱${price.toLocaleString('en-PH')}`;
  };

  if (authLoading || (loading && !refreshing)) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0F766E" />
      </View>
    );
  }

  const activeListings = properties.filter((p) => p.status === 'active').length;
  const totalViews = properties.reduce((acc, curr) => acc + (curr.views_count || 0), 0);

  // Header Component
  const DashboardHeader = () => (
    <View className="bg-white px-6 py-5 border-b border-gray-200">
      <Text className="text-sm text-gray-500 font-medium">Welcome back,</Text>
      <Text className="text-2xl font-bold text-gray-900 mb-4">{profile?.full_name || 'Agent'}</Text>
      
      {/* Agent Stats Badge */}
      <View className="flex-row items-center mb-6 bg-gray-50 p-2 rounded-lg self-start">
        {profile?.is_verified && (
          <View className="flex-row items-center mr-3">
            <Shield size={14} color="#0F766E" fill="#0F766E" />
            <Text className="text-xs text-teal-700 ml-1 font-bold">Verified</Text>
          </View>
        )}
        <View className="flex-row items-center">
          <TrendingUp size={14} color="#F59E0B" />
          <Text className="text-xs text-gray-600 ml-1 font-medium">{profile?.trust_score || 0}% Trust</Text>
        </View>
      </View>

      {/* Stats Row */}
      <View className="flex-row gap-4">
        <View className="flex-1 bg-teal-50 p-3 rounded-xl border border-teal-100">
          <Text className="text-teal-800 text-xs font-bold uppercase">Active Listings</Text>
          <Text className="text-teal-900 text-2xl font-bold">{activeListings}</Text>
        </View>
        <View className="flex-1 bg-blue-50 p-3 rounded-xl border border-blue-100">
          <Text className="text-blue-800 text-xs font-bold uppercase">Total Views</Text>
          <Text className="text-blue-900 text-2xl font-bold">{totalViews}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <FlatList
        data={properties}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={DashboardHeader}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View className="items-center justify-center py-10 px-6">
            <View className="bg-white rounded-full p-6 mb-4 shadow-sm">
              <Home size={48} color="#D1D5DB" />
            </View>
            <Text className="text-lg font-bold text-gray-900">No listings yet</Text>
            <Text className="text-gray-400 text-sm text-center mt-1 mb-6">
              Start by adding your first property listing to reach thousands of buyers.
            </Text>
            <TouchableOpacity 
              onPress={() => router.push('/seller/add')}
              className="bg-teal-700 px-6 py-3 rounded-xl shadow-sm"
            >
              <Text className="text-white font-bold">Add First Property</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => router.push(`/property/${item.id}`)}
            className="bg-white mx-6 mb-4 rounded-2xl shadow-sm overflow-hidden border border-gray-100"
          >
            <View className="flex-row">
              <Image 
                source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150' }} 
                className="w-28 h-28 bg-gray-200" 
                resizeMode="cover"
              />
              <View className="flex-1 p-3 justify-between">
                <View>
                  <Text className="font-bold text-gray-900 text-base" numberOfLines={1}>{item.title}</Text>
                  <Text className="text-teal-700 font-bold mt-1">{formatPrice(item.price)}</Text>
                </View>
                
                <View className="flex-row items-center justify-between mt-2">
                  <View className="flex-row items-center flex-1 mr-2">
                    <MapPin size={12} color="#6B7280" />
                    <Text className="text-gray-500 text-xs ml-1" numberOfLines={1}>{item.location_text}</Text>
                  </View>
                  <View className="flex-row items-center bg-gray-100 px-2 py-1 rounded-md">
                    <Eye size={10} color="#6B7280" />
                    <Text className="text-gray-500 text-xs ml-1 font-medium">{item.views_count || 0}</Text>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Status Bar */}
            <View className={`h-1 w-full ${item.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
          </TouchableOpacity>
        )}
      />

      {/* FAB (Add Button) - Only show if list is not empty (since empty state has a button) */}
      {properties.length > 0 && (
        <TouchableOpacity 
          onPress={() => router.push('/seller/add')}
          className="absolute bottom-6 right-6 bg-teal-700 w-14 h-14 rounded-full items-center justify-center shadow-lg z-50 elevation-5"
        >
          <Plus size={28} color="white" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}