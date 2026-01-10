// app/(tabs)/seller-dashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, Eye, Home, Shield, TrendingUp } from 'lucide-react-native';
import { useAuth } from '@/ctx/AuthContext';
import { supabase } from '@/lib/supabase';

interface Property {
  id: string;
  title: string;
  price: number;
  location_text: string;
  images: string[];
  status: string;
  views_count: number;
  favorites_count: number;
  created_at: string;
}

export default function SellerDashboardScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('agent_id', profile?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchProperties();
  };

  const formatPrice = (price: number): string => {
    return `₱${price.toLocaleString('en-PH')}`;
  };

  const activeListings = properties.filter((p) => p.status === 'active').length;
  const totalViews = properties.reduce((sum, p) => sum + (p.views_count || 0), 0);
  const totalFavorites = properties.reduce((sum, p) => sum + (p.favorites_count || 0), 0);

  const StatCard = ({
    icon,
    label,
    value,
    color,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
  }) => (
    <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
      <View className={`bg-${color}-100 rounded-full w-10 h-10 items-center justify-center mb-3`}>
        {icon}
      </View>
      <Text className="text-2xl font-bold text-gray-900 mb-1">{value}</Text>
      <Text className="text-sm text-gray-600">{label}</Text>
    </View>
  );

  const PropertyCard = ({ property }: { property: Property }) => (
    <TouchableOpacity
      onPress={() => router.push(`/property/${property.id}`)}
      activeOpacity={0.7}
      className="bg-white rounded-2xl overflow-hidden shadow-sm mb-4"
    >
      <View className="flex-row">
        {/* Property Image */}
        {property.images && property.images.length > 0 ? (
          <Image
            source={{ uri: property.images[0] }}
            className="w-32 h-32"
            resizeMode="cover"
          />
        ) : (
          <View className="w-32 h-32 bg-gray-200 items-center justify-center">
            <Home size={32} color="#9CA3AF" />
          </View>
        )}

        {/* Property Info */}
        <View className="flex-1 p-4">
          <View className="flex-row items-center mb-2">
            <View
              className={`
                px-2 py-1 rounded-full
                ${property.status === 'active' ? 'bg-green-100' : 'bg-gray-100'}
              `}
            >
              <Text
                className={`
                  text-xs font-semibold
                  ${property.status === 'active' ? 'text-green-700' : 'text-gray-600'}
                `}
              >
                {property.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text className="text-base font-bold text-gray-900 mb-1" numberOfLines={1}>
            {property.title}
          </Text>

          <Text className="text-lg font-bold text-teal-700 mb-2">
            {formatPrice(property.price)}
          </Text>

          <Text className="text-sm text-gray-600 mb-2" numberOfLines={1}>
            {property.location_text}
          </Text>

          {/* Stats */}
          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center">
              <Eye size={14} color="#6B7280" />
              <Text className="text-xs text-gray-600 ml-1">
                {property.views_count || 0} views
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-xs text-gray-600">
                ❤️ {property.favorites_count || 0}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0F766E" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Agent Dashboard
          </Text>

          {/* Agent Info */}
          <View className="flex-row items-center">
            <View className="bg-teal-700 rounded-full w-12 h-12 items-center justify-center mr-3">
              <Text className="text-white text-lg font-bold">
                {profile?.full_name?.charAt(0)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">
                {profile?.full_name}
              </Text>
              <View className="flex-row items-center mt-1">
                {profile?.is_verified && (
                  <View className="flex-row items-center mr-3">
                    <Shield size={14} color="#0F766E" fill="#0F766E" />
                    <Text className="text-xs text-teal-700 ml-1 font-semibold">
                      Verified
                    </Text>
                  </View>
                )}
                <View className="flex-row items-center">
                  <TrendingUp size={14} color="#F59E0B" />
                  <Text className="text-xs text-gray-600 ml-1">
                    {profile?.trust_score || 0}% Trust Score
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View className="px-6 py-4 flex-row gap-3">
          <StatCard
            icon={<Home size={20} color="#0F766E" />}
            label="Active Listings"
            value={activeListings}
            color="teal"
          />
          <StatCard
            icon={<Eye size={20} color="#3B82F6" />}
            label="Total Views"
            value={totalViews}
            color="blue"
          />
          <StatCard
            icon={<Text className="text-xl">❤️</Text>}
            label="Favorites"
            value={totalFavorites}
            color="red"
          />
        </View>

        {/* My Listings */}
        <View className="px-6 py-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-gray-900">
              My Listings
            </Text>
            <Text className="text-sm text-gray-600">
              {properties.length} {properties.length === 1 ? 'property' : 'properties'}
            </Text>
          </View>

          {properties.length === 0 ? (
            <View className="bg-white rounded-2xl p-8 items-center">
              <View className="bg-gray-100 rounded-full p-6 mb-4">
                <Home size={48} color="#9CA3AF" />
              </View>
              <Text className="text-lg font-bold text-gray-900 mb-2">
                No Listings Yet
              </Text>
              <Text className="text-sm text-gray-600 text-center mb-6">
                Start by adding your first property listing
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/seller/add')}
                activeOpacity={0.7}
                className="bg-teal-700 rounded-xl px-6 py-3"
              >
                <Text className="text-white font-semibold">
                  Add Your First Listing
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          )}
        </View>

        {/* Bottom Padding */}
        <View className="h-24" />
      </ScrollView>

      {/* Floating Action Button */}
      {properties.length > 0 && (
        <View className="absolute bottom-6 right-6">
          <TouchableOpacity
            onPress={() => router.push('/seller/add')}
            activeOpacity={0.8}
            className="bg-teal-700 rounded-full w-16 h-16 items-center justify-center shadow-lg"
          >
            <Plus size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}