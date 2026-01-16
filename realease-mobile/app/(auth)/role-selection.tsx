// app/auth/role-selection.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, Home, ChevronRight } from 'lucide-react-native';

export default function RoleSelectionScreen() {
  const router = useRouter();

  const handleRoleSelection = (role: 'client' | 'seller') => {
    router.push({
      pathname: '/auth/sign-up',
      params: { role },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-4 pb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="mb-6"
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>

        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to RealEase
        </Text>
        <Text className="text-base text-gray-600">
          How do you plan to use RealEase?
        </Text>
      </View>

      {/* Role Options */}
      <View className="flex-1 px-6">
        {/* Client Option */}
        <TouchableOpacity
          onPress={() => handleRoleSelection('client')}
          activeOpacity={0.7}
          className="bg-gradient-to-br from-blue-50 to-teal-50 border-2 border-teal-700 rounded-3xl p-8 mb-6 shadow-lg"
        >
          <View className="flex-row items-start justify-between mb-4">
            <View className="bg-teal-700 rounded-2xl p-4">
              <Search size={40} color="#FFFFFF" />
            </View>
            <View className="bg-teal-700 rounded-full p-2">
              <ChevronRight size={24} color="#FFFFFF" />
            </View>
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-3">
            I want to Buy/Rent
          </Text>
          
          <Text className="text-base text-gray-700 leading-6 mb-4">
            Find your dream home from verified properties. Browse listings, 
            contact agents, and make secure offers.
          </Text>

          <View className="bg-white/50 rounded-xl p-4">
            <Text className="text-sm font-semibold text-teal-900 mb-2">
              Perfect for:
            </Text>
            <Text className="text-sm text-gray-700">
              • Home buyers and renters{'\n'}
              • First-time buyers{'\n'}
              • Property investors
            </Text>
          </View>
        </TouchableOpacity>

        {/* Seller/Agent Option */}
        <TouchableOpacity
          onPress={() => handleRoleSelection('seller')}
          activeOpacity={0.7}
          className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-600 rounded-3xl p-8 shadow-lg"
        >
          <View className="flex-row items-start justify-between mb-4">
            <View className="bg-amber-600 rounded-2xl p-4">
              <Home size={40} color="#FFFFFF" />
            </View>
            <View className="bg-amber-600 rounded-full p-2">
              <ChevronRight size={24} color="#FFFFFF" />
            </View>
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-3">
            I am an Agent/Seller
          </Text>
          
          <Text className="text-base text-gray-700 leading-6 mb-4">
            List your properties, connect with serious buyers, and grow your 
            business with verified credentials.
          </Text>

          <View className="bg-white/50 rounded-xl p-4">
            <Text className="text-sm font-semibold text-amber-900 mb-2">
              Perfect for:
            </Text>
            <Text className="text-sm text-gray-700">
              • Real estate agents{'\n'}
              • Property owners{'\n'}
              • Licensed brokers
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View className="px-6 pb-6">
        <Text className="text-center text-sm text-gray-600">
          You can change this later in your profile settings
        </Text>
      </View>
    </SafeAreaView>
  );
}