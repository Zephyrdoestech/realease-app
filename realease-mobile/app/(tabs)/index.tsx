import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ChevronDown, MapPin, Sparkles, MessageSquare, User, X } from 'lucide-react-native';
import { PropertyCard } from '../../components/PropertyCard';
import { FilterChip } from '../../components/FilterChip';
import { mockProperties } from '@/constants/data';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/ctx/AuthContext';

interface Inquiry {
  property_id: string;
  sender_id: string;
  buyer_name: string;
  property_title: string;
  latest_message: string;
  latest_timestamp: string;
  message_count: number;
}

// ============= BUYER HOME SCREEN =============
function BuyerHomeScreen() {
  const [selectedCity, setSelectedCity] = useState('Cebu');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const filters = ['Near IT Park', 'Flood Free', 'Pet Friendly', 'With Parking', 'Furnished'];
  
  // Filter properties based on search query
  const filteredProperties = searchQuery.trim() 
    ? mockProperties.filter(property => 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockProperties;

  const featuredProperties = mockProperties.filter((p) => p.isVerified).slice(0, 3);
  const recentListings = filteredProperties;

  const openAIChat = () => {
    router.push({
      pathname: '/chat', 
      params: { id: featuredProperties[0]?.id } 
    });
  };

  const navigateToAllProperties = () => {
    router.push('/all-properties');
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setIsSearching(text.trim().length > 0);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
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
                value={searchQuery}
                onChangeText={handleSearchChange}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearSearch} activeOpacity={0.7}>
                  <X size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>

            {/* Search Results Count */}
            {isSearching && (
              <View className="mt-3">
                <Text className="text-sm text-gray-600">
                  {filteredProperties.length} {filteredProperties.length === 1 ? 'result' : 'results'} found
                </Text>
              </View>
            )}
          </View>

          {/* Filter Chips - Hide when searching */}
          {!isSearching && (
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
          )}

          {/* Featured Section - Hide when searching */}
          {!isSearching && (
            <View className="mt-6">
              <View className="px-4 mb-4 flex-row items-center justify-between">
                <Text className="text-xl font-bold text-gray-900">Featured Properties</Text>
                <TouchableOpacity 
                  activeOpacity={0.7}
                  onPress={navigateToAllProperties}
                >
                  <Text className="text-sm font-semibold text-teal-700">See All</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                {featuredProperties.map((property) => (
                  <View key={property.id} style={{ width: 300, marginRight: 16 }}><PropertyCard property={property} /></View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Search Results or Recent Listings */}
          <View className="mt-6 px-4 pb-10">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-gray-900">
                {isSearching ? 'Search Results' : 'Recent Listings'}
              </Text>
              <Text className="text-sm text-gray-600">{recentListings.length} properties</Text>
            </View>
            
            {recentListings.length > 0 ? (
              recentListings.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            ) : (
              <View className="items-center justify-center py-16">
                <View className="bg-gray-200 p-6 rounded-full mb-4">
                  <Search size={48} color="#9CA3AF" />
                </View>
                <Text className="text-lg font-semibold text-gray-700 mb-2">
                  No properties found
                </Text>
                <Text className="text-sm text-gray-500 text-center px-8">
                  Try adjusting your search or browse all properties
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* AI CHATBOT FLOATING BUTTON */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={openAIChat}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: '#0F766E',
            width: 60,
            height: 60,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
          }}
        >
          <View>
            <Sparkles size={24} color="white" />
            <View style={{ 
              position: 'absolute', 
              top: -5, 
              right: -5, 
              backgroundColor: '#EF4444', 
              width: 12, 
              height: 12, 
              borderRadius: 6, 
              borderWidth: 2,
              borderColor: 'white'
            }} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ============= SELLER HOME SCREEN =============
function SellerHomeScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInquiries = async () => {
    try {
      if (!session?.user?.id) {
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const sellerProperties = mockProperties;
      const propertyIds = sellerProperties.map(p => p.id);

      if (propertyIds.length === 0) {
        setInquiries([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .in('property_id', propertyIds)
        .eq('sender_type', 'user')
        .order('created_at', { ascending: false });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      if (!messages || messages.length === 0) {
        setInquiries([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const senderIds = [...new Set(messages.map(m => m.sender_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', senderIds);

      const profilesMap = new Map(profiles?.map(p => [p.id, p.full_name]) || []);

      const inquiriesMap = new Map<string, Inquiry>();

      messages.forEach((msg: any) => {
        const key = `${msg.property_id}-${msg.sender_id}`;
        
        if (!inquiriesMap.has(key)) {
          const property = sellerProperties.find(p => p.id === msg.property_id);
          
          inquiriesMap.set(key, {
            property_id: msg.property_id,
            sender_id: msg.sender_id,
            buyer_name: profilesMap.get(msg.sender_id) || 'Unknown Buyer',
            property_title: property?.title || 'Property',
            latest_message: msg.text,
            latest_timestamp: msg.created_at,
            message_count: 1,
          });
        } else {
          const existing = inquiriesMap.get(key)!;
          existing.message_count += 1;
          if (new Date(msg.created_at) > new Date(existing.latest_timestamp)) {
            existing.latest_message = msg.text;
            existing.latest_timestamp = msg.created_at;
          }
        }
      });

      const inquiriesArray = Array.from(inquiriesMap.values())
        .sort((a, b) => new Date(b.latest_timestamp).getTime() - new Date(a.latest_timestamp).getTime());
      
      setInquiries(inquiriesArray);
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    fetchInquiries();

    const channel = supabase
      .channel('seller-inbox-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_type=eq.user`,
        },
        (payload) => {
          console.log('New message received:', payload);
          fetchInquiries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchInquiries();
  };

  const handleReply = (propertyId: string) => {
    router.push(`/chat/${propertyId}`);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const renderInquiryItem = ({ item }: { item: Inquiry }) => (
    <TouchableOpacity
      onPress={() => handleReply(item.property_id)}
      activeOpacity={0.7}
      className="bg-white rounded-xl p-4 mb-3 shadow-sm"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-row items-center flex-1 mr-3">
          <View className="bg-teal-100 p-2.5 rounded-full mr-3">
            <User size={20} color="#0F766E" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900 mb-0.5">
              {item.buyer_name}
            </Text>
            <Text className="text-xs text-gray-500" numberOfLines={1}>
              {item.property_title}
            </Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-xs text-gray-400 mb-1">
            {formatTimestamp(item.latest_timestamp)}
          </Text>
          {item.message_count > 1 && (
            <View className="bg-teal-700 px-2 py-0.5 rounded-full">
              <Text className="text-white text-[10px] font-semibold">
                {item.message_count}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <Text className="text-sm text-gray-600 ml-11" numberOfLines={2}>
        {item.latest_message}
      </Text>
      
      <View className="flex-row items-center justify-end mt-2">
        <MessageSquare size={14} color="#0F766E" />
        <Text className="text-xs text-teal-700 font-semibold ml-1">Reply</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0F766E" />
          <Text className="text-gray-600 mt-4 text-sm">Loading inquiries...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1">
        <View className="bg-white px-5 pt-4 pb-5 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            Recent Inquiries
          </Text>
          <Text className="text-sm text-gray-600">
            {inquiries.length} active conversation{inquiries.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <FlatList
          data={inquiries}
          keyExtractor={(item) => `${item.property_id}-${item.sender_id}`}
          renderItem={renderInquiryItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh}
              tintColor="#0F766E"
              colors={['#0F766E']}
            />
          }
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center pt-32">
              <View className="bg-gray-200 p-6 rounded-full mb-4">
                <MessageSquare size={48} color="#9CA3AF" />
              </View>
              <Text className="text-lg font-semibold text-gray-700 mb-2">
                No inquiries yet
              </Text>
              <Text className="text-sm text-gray-500 text-center px-8 leading-5">
                When buyers message you about your properties, their conversations will appear here
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

// ============= MAIN COMPONENT WITH ROLE CHECK =============
export default function HomeScreen() {
  const { session } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!session?.user?.id) {
        setUserRole('client');
        setLoading(false);
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        setUserRole(profile?.role || 'client');
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('client');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [session?.user?.id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0F766E" />
        </View>
      </SafeAreaView>
    );
  }

  if (userRole === 'seller') {
    return <SellerHomeScreen />;
  }

  return <BuyerHomeScreen />;
}