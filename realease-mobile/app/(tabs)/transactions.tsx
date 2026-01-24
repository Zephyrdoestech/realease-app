import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Shield,
  CheckCircle,
  Clock,
  Calendar,
  ArrowRight,
} from 'lucide-react-native';
import { mockProperties } from '../../constants/data';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/ctx/AuthContext';

interface Transaction {
  id: string;
  client_id: string;
  agent_id: string;
  property_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  payment_method: string;
  reference_number: string;
  created_at: string;
}

export default function TransactionsScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user's transactions
  const fetchTransactions = async () => {
    try {
      if (!session?.user?.id) {
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // Cast to any to bypass TypeScript type checking for now
      const { data, error } = await (supabase
        .from('transactions')
        .select('*')
        .eq('client_id', session.user.id)
        .order('created_at', { ascending: false }) as any);

      if (error) {
        console.error('Error fetching transactions:', error);
        setTransactions([]);
      } else {
        setTransactions(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setTransactions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Subscribe to real-time transaction updates
  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    fetchTransactions();

    // Cast to any to bypass TypeScript type checking
    const channel = supabase
      .channel('user-transactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `client_id=eq.${session.user.id}`,
        } as any,
        (payload) => {
          console.log('Transaction update:', payload);
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  const formatPrice = (price: number): string => {
    return `₱${price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusConfig = (status: Transaction['status']) => {
    switch (status) {
      case 'pending':
        return {
          label: 'In Escrow',
          bgColor: 'bg-teal-50',
          textColor: 'text-teal-700',
          borderColor: 'border-teal-700',
          icon: <Shield size={14} color="#0F766E" fill="#0F766E" />,
        };
      case 'completed':
        return {
          label: 'Completed',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          borderColor: 'border-green-300',
          icon: <CheckCircle size={14} color="#059669" />,
        };
      case 'cancelled':
        return {
          label: 'Refunded',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-300',
          icon: <CheckCircle size={14} color="#3B82F6" />,
        };
      default:
        return {
          label: 'Unknown',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-300',
          icon: <Clock size={14} color="#6B7280" />,
        };
    }
  };

  const getPaymentMethodLabel = (method: string): string => {
    switch (method) {
      case 'gcash':
        return 'GCash';
      case 'paymaya':
        return 'PayMaya';
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'credit_card':
        return 'Credit Card';
      default:
        return 'Payment';
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const property = mockProperties.find((p) => p.id === item.property_id);
    const statusConfig = getStatusConfig(item.status);

    if (!property) {
      return (
        <View className="bg-white rounded-2xl overflow-hidden shadow-sm mb-4 mx-4 p-4">
          <Text className="text-gray-500">Property not found</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => router.push(`/property/${property.id}`)}
        activeOpacity={0.7}
        className="bg-white rounded-2xl overflow-hidden shadow-sm mb-4 mx-4"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
        }}
      >
        <View className="flex-row">
          {/* Property Image */}
          <Image
            source={{ uri: property.imageUrl }}
            className="w-28 h-full"
            resizeMode="cover"
          />

          {/* Transaction Details */}
          <View className="flex-1 p-4">
            {/* Status Badge */}
            <View
              className={`
                ${statusConfig.bgColor} 
                ${statusConfig.borderColor}
                border rounded-full px-2.5 py-1 flex-row items-center self-start mb-2
              `}
            >
              {statusConfig.icon}
              <Text className={`text-xs font-bold ${statusConfig.textColor} ml-1`}>
                {statusConfig.label}
              </Text>
            </View>

            {/* Payment Method */}
            <Text className="text-base font-bold text-gray-900 mb-1">
              {getPaymentMethodLabel(item.payment_method)}
            </Text>

            {/* Property Title */}
            <Text className="text-sm text-gray-600 mb-2" numberOfLines={1}>
              {property.title}
            </Text>

            {/* Amount and Date */}
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold text-teal-700">
                {formatPrice(item.amount)}
              </Text>
              <View className="flex-row items-center">
                <Calendar size={14} color="#9CA3AF" />
                <Text className="text-xs text-gray-500 ml-1">
                  {formatDate(item.created_at)}
                </Text>
              </View>
            </View>

            {/* Reference Number */}
            <Text className="text-xs text-gray-400 mt-2">
              Ref: {item.reference_number}
            </Text>
          </View>

          {/* Arrow Icon */}
          <View className="justify-center pr-4">
            <ArrowRight size={20} color="#D1D5DB" />
          </View>
        </View>

        {/* Escrow Notice for Pending Transactions */}
        {item.status === 'pending' && (
          <View className="bg-teal-50 px-4 py-3 border-t border-teal-100">
            <Text className="text-xs text-teal-700">
              💡 Funds are held securely in escrow until transaction is confirmed
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-6 pt-20">
      <View className="bg-gray-100 rounded-full p-6 mb-4">
        <Shield size={48} color="#9CA3AF" />
      </View>
      <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
        No Transactions Yet
      </Text>
      <Text className="text-base text-gray-600 text-center">
        Your payment history and escrow status will appear here
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View className="px-4 pt-4 pb-2">
      <Text className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
        Recent Activity
      </Text>
    </View>
  );

  // Calculate totals
  const inEscrowTotal = transactions
    .filter((t) => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const completedTotal = transactions
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0F766E" />
          <Text className="text-gray-600 mt-4 text-sm">Loading transactions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!session?.user) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
        <View className="flex-1 justify-center items-center px-6">
          <View className="bg-teal-100 p-6 rounded-full mb-4">
            <Shield size={48} color="#0F766E" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Sign In Required
          </Text>
          <Text className="text-gray-600 text-center leading-5 mb-6">
            Please sign in to view your transaction history
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/sign-in')}
            className="bg-teal-700 px-8 py-3 rounded-xl"
          >
            <Text className="text-white font-semibold text-base">Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="px-4 pt-6 pb-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Activity</Text>
        <Text className="text-sm text-gray-600 mt-1">
          Track your payments and escrow status
        </Text>
      </View>

      {/* Summary Cards */}
      <View className="px-4 py-4 flex-row gap-3">
        <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
          <Text className="text-xs text-gray-600 mb-1">In Escrow</Text>
          <Text className="text-2xl font-bold text-teal-700">
            {formatPrice(inEscrowTotal)}
          </Text>
        </View>
        <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
          <Text className="text-xs text-gray-600 mb-1">Total Spent</Text>
          <Text className="text-2xl font-bold text-gray-900">
            {formatPrice(completedTotal)}
          </Text>
        </View>
      </View>

      {/* Transactions List */}
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#0F766E"
            colors={['#0F766E']}
          />
        }
        contentContainerStyle={{
          paddingBottom: 20,
          flexGrow: 1,
        }}
      />
    </SafeAreaView>
  );
}