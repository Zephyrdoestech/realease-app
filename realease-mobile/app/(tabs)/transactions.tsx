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
// Note: In a real app, you would fetch real properties here, not mock
import { mockProperties } from '@/constants/data';

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
          bgColor: 'bg-teal-50 dark:bg-teal-900/30',
          textColor: 'text-teal-700 dark:text-teal-300',
          borderColor: 'border-teal-700 dark:border-teal-500',
          icon: <Shield size={14} color="#0F766E" fill="#0F766E" />,
        };
      case 'completed':
        return {
          label: 'Completed',
          bgColor: 'bg-gray-100 dark:bg-gray-700',
          textColor: 'text-gray-700 dark:text-gray-300',
          borderColor: 'border-gray-300 dark:border-gray-600',
          icon: <CheckCircle size={14} color="#6B7280" />,
        };
      case 'pending':
        return {
          label: 'Pending',
          bgColor: 'bg-amber-50 dark:bg-amber-900/30',
          textColor: 'text-amber-700 dark:text-amber-400',
          borderColor: 'border-amber-300 dark:border-amber-600',
          icon: <Clock size={14} color="#F59E0B" />,
        };
      case 'refunded':
        return {
          label: 'Refunded',
          bgColor: 'bg-blue-50 dark:bg-blue-900/30',
          textColor: 'text-blue-700 dark:text-blue-400',
          borderColor: 'border-blue-300 dark:border-blue-600',
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
      case 'reservation': return 'Reservation Fee';
      case 'viewing': return 'Viewing Fee';
      case 'deposit': return 'Security Deposit';
      default: return 'Payment';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="px-5 pt-4 pb-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">My Transactions</Text>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => {
          const property = mockProperties.find((p) => p.id === item.propertyId);
          const statusConfig = getStatusConfig(item.status);

          if (!property) return null;

          return (
            <TouchableOpacity
              onPress={() => router.push(`/property/${property.id}`)}
              activeOpacity={0.7}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm mb-4 border border-gray-100 dark:border-gray-700"
            >
              <View className="flex-row">
                {/* Property Image */}
                <Image
                  source={{ uri: property.imageUrl }}
                  className="w-28 h-full bg-gray-200"
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
                  <Text className="text-base font-bold text-gray-900 dark:text-white mb-1">
                    {getTransactionType(item.type)}
                  </Text>

                  {/* Property Title */}
                  <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2" numberOfLines={1}>
                    {property.title}
                  </Text>

                  {/* Amount and Date */}
                  <View className="flex-row items-center justify-between">
                    <Text className="text-lg font-bold text-teal-700 dark:text-teal-400">
                      {formatPrice(item.amount)}
                    </Text>
                    <View className="flex-row items-center">
                      <Calendar size={14} color="#9CA3AF" />
                      <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        {formatDate(item.date)}
                      </Text>
                    </View>
                  </View>

                  {/* Reference Number */}
                  <Text className="text-xs text-gray-400 mt-2 font-mono">
                    Ref: {item.referenceNumber}
                  </Text>
                </View>

                {/* Arrow Icon */}
                <View className="justify-center pr-4">
                  <ArrowRight size={20} color="#6B7280" />
                </View>
              </View>

              {/* Escrow Notice for Active Transactions */}
              {item.status === 'in_escrow' && (
                <View className="bg-teal-50 dark:bg-teal-900/20 px-4 py-3 border-t border-teal-100 dark:border-teal-800">
                  <Text className="text-xs text-teal-700 dark:text-teal-300 font-medium">
                    💡 Funds are held securely until viewing is confirmed
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center px-6 pt-20">
            <View className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
              <Shield size={48} color="#9CA3AF" />
            </View>
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
              No Transactions Yet
            </Text>
            <Text className="text-base text-gray-600 dark:text-gray-400 text-center">
              Your payment history and escrow status will appear here
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}