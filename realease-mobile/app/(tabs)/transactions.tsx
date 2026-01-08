// app/(tabs)/transactions.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
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

interface Transaction {
  id: string;
  propertyId: string;
  type: 'reservation' | 'viewing' | 'deposit';
  amount: number;
  status: 'in_escrow' | 'completed' | 'pending' | 'refunded';
  date: string;
  referenceNumber: string;
}

export default function TransactionsScreen() {
  const router = useRouter();

  // Mock transaction data
  const transactions: Transaction[] = [
    {
      id: 'txn_001',
      propertyId: '1',
      type: 'reservation',
      amount: 5150,
      status: 'in_escrow',
      date: '2026-01-09',
      referenceNumber: 'RE-2026-1XYZ',
    },
    {
      id: 'txn_002',
      propertyId: '2',
      type: 'viewing',
      amount: 150,
      status: 'completed',
      date: '2026-01-05',
      referenceNumber: 'RE-2026-2ABC',
    },
    {
      id: 'txn_003',
      propertyId: '3',
      type: 'reservation',
      amount: 5150,
      status: 'completed',
      date: '2025-12-28',
      referenceNumber: 'RE-2025-3DEF',
    },
    {
      id: 'txn_004',
      propertyId: '4',
      type: 'viewing',
      amount: 150,
      status: 'refunded',
      date: '2025-12-20',
      referenceNumber: 'RE-2025-4GHI',
    },
  ];

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
      case 'in_escrow':
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
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-300',
          icon: <CheckCircle size={14} color="#6B7280" />,
        };
      case 'pending':
        return {
          label: 'Pending',
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-700',
          borderColor: 'border-amber-300',
          icon: <Clock size={14} color="#F59E0B" />,
        };
      case 'refunded':
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

  const getTransactionType = (type: Transaction['type']): string => {
    switch (type) {
      case 'reservation':
        return 'Reservation Fee';
      case 'viewing':
        return 'Viewing Fee';
      case 'deposit':
        return 'Security Deposit';
      default:
        return 'Payment';
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const property = mockProperties.find((p) => p.id === item.propertyId);
    const statusConfig = getStatusConfig(item.status);

    if (!property) {
      return null;
    }

    return (
      <TouchableOpacity
        onPress={() => router.push(`/property/${property.id}`)}
        activeOpacity={0.7}
        className="bg-white rounded-2xl overflow-hidden shadow-sm mb-4 mx-4"
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

            {/* Transaction Type */}
            <Text className="text-base font-bold text-gray-900 mb-1">
              {getTransactionType(item.type)}
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
                  {formatDate(item.date)}
                </Text>
              </View>
            </View>

            {/* Reference Number */}
            <Text className="text-xs text-gray-400 mt-2">
              Ref: {item.referenceNumber}
            </Text>
          </View>

          {/* Arrow Icon */}
          <View className="justify-center pr-4">
            <ArrowRight size={20} color="#D1D5DB" />
          </View>
        </View>

        {/* Escrow Notice for Active Transactions */}
        {item.status === 'in_escrow' && (
          <View className="bg-teal-50 px-4 py-3 border-t border-teal-100">
            <Text className="text-xs text-teal-700">
              💡 Funds are held securely until viewing is confirmed
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
            {formatPrice(
              transactions
                .filter((t) => t.status === 'in_escrow')
                .reduce((sum, t) => sum + t.amount, 0)
            )}
          </Text>
        </View>
        <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
          <Text className="text-xs text-gray-600 mb-1">Total Spent</Text>
          <Text className="text-2xl font-bold text-gray-900">
            {formatPrice(
              transactions
                .filter((t) => t.status === 'completed')
                .reduce((sum, t) => sum + t.amount, 0)
            )}
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
        contentContainerStyle={{
          paddingBottom: 20,
          flexGrow: 1,
        }}
      />
    </SafeAreaView>
  );
}