import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase'; // Adjust path to your Supabase client

interface Conversation {
  id: string;
  property_id: string;
  buyer_id: string;
  agent_id: string;
  created_at: string;
  updated_at: string;
  buyer_name: string;
  property_title: string;
}

export default function SellerHome() {
  const [user, setUser] = useState<any>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch conversations with joined data
  const fetchConversations = async () => {
    try {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          property_id,
          buyer_id,
          agent_id,
          created_at,
          updated_at,
          profiles:buyer_id (
            full_name
          ),
          properties:property_id (
            title
          )
        `)
        .eq('agent_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        return;
      }

      // Transform the data to flatten joined tables
      const transformedData = data?.map((conv: any) => ({
        id: conv.id,
        property_id: conv.property_id,
        buyer_id: conv.buyer_id,
        agent_id: conv.agent_id,
        created_at: conv.created_at,
        updated_at: conv.updated_at,
        buyer_name: conv.profiles?.full_name || 'Unknown Buyer',
        property_title: conv.properties?.title || 'Property',
      })) || [];

      setConversations(transformedData);
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Subscribe to real-time changes
  useEffect(() => {
    if (!user?.id) return;

    fetchConversations();

    // Set up real-time subscription
    const channel = supabase
      .channel('seller-conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `agent_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Real-time update:', payload);
          // Refetch to get joined data
          fetchConversations();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchConversations();
  };

  const handleReply = (propertyId: string) => {
    router.push(`/chat/${propertyId}`);
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <View style={styles.conversationCard}>
      <View style={styles.conversationInfo}>
        <Text style={styles.buyerName}>{item.buyer_name}</Text>
        <Text style={styles.propertyTitle}>{item.property_title}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.updated_at).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.replyButton}
        onPress={() => handleReply(item.property_id)}
      >
        <Text style={styles.replyButtonText}>Reply</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading conversations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Inquiries</Text>
        <Text style={styles.headerSubtitle}>
          {conversations.length} active conversation{conversations.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderConversationItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No active conversations yet</Text>
            <Text style={styles.emptySubtext}>
              New buyer inquiries will appear here
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  conversationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  conversationInfo: {
    flex: 1,
    marginRight: 12,
  },
  buyerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  propertyTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  replyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  replyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});