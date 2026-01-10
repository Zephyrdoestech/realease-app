import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Plus, Eye, MapPin } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/ctx/AuthContext';

export default function SellerDashboard() {
  const { session, profile, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch data
  const fetchProperties = async () => {
    // 🛡️ CRITICAL FIX: Don't run query if no user ID
    if (!session?.user.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('agent_id', session.user.id) // Use session ID directly, it's faster than profile
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.log('Error fetching properties:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Reload when screen comes into focus (e.g. after adding a property)
  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, [session?.user.id])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchProperties();
  };

  if (authLoading || loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0F766E" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="bg-white px-6 py-5 border-b border-gray-200">
        <Text className="text-sm text-gray-500 font-medium">Welcome back,</Text>
        <Text className="text-2xl font-bold text-gray-900">{profile?.full_name || 'Agent'}</Text>
        
        {/* Stats Row */}
        <View className="flex-row mt-4 gap-4">
          <View className="flex-1 bg-teal-50 p-3 rounded-xl border border-teal-100">
            <Text className="text-teal-800 text-xs font-bold uppercase">Active Listings</Text>
            <Text className="text-teal-900 text-2xl font-bold">{properties.length}</Text>
          </View>
          <View className="flex-1 bg-blue-50 p-3 rounded-xl border border-blue-100">
            <Text className="text-blue-800 text-xs font-bold uppercase">Total Views</Text>
            <Text className="text-blue-900 text-2xl font-bold">
              {properties.reduce((acc, curr) => acc + (curr.views_count || 0), 0)}
            </Text>
          </View>
        </View>
      </View>

      {/* Property List */}
      <FlatList
        data={properties}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <Text className="text-gray-400">No listings yet.</Text>
            <Text className="text-gray-400 text-sm">Tap + to add your first property.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl mb-4 shadow-sm overflow-hidden border border-gray-100">
            <View className="flex-row">
              <Image 
                source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150' }} 
                className="w-24 h-24 bg-gray-200" 
                resizeMode="cover"
              />
              <View className="flex-1 p-3 justify-center">
                <Text className="font-bold text-gray-900 text-base" numberOfLines={1}>{item.title}</Text>
                <Text className="text-teal-700 font-bold mt-1">₱{item.price.toLocaleString()}</Text>
                <View className="flex-row items-center mt-2">
                  <MapPin size={12} color="#6B7280" />
                  <Text className="text-gray-500 text-xs ml-1" numberOfLines={1}>{item.location_text}</Text>
                </View>
              </View>
            </View>
            <View className="flex-row border-t border-gray-100 p-2 bg-gray-50 justify-between items-center px-4">
               <View className="flex-row items-center">
                 <Eye size={14} color="#6B7280" />
                 <Text className="text-gray-500 text-xs ml-1">{item.views_count || 0} Views</Text>
               </View>
               <Text className={`text-xs font-bold ${item.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                 {item.status.toUpperCase()}
               </Text>
            </View>
          </View>
        )}
      />

      {/* FAB (Add Button) */}
      <TouchableOpacity 
        onPress={() => router.push('/seller/add')}
        className="absolute bottom-6 right-6 bg-teal-700 w-14 h-14 rounded-full items-center justify-center shadow-lg z-50"
      >
        <Plus size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}