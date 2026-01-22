import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Briefcase, Search, ArrowLeft, ChevronRight } from 'lucide-react-native';

export default function RoleSelectionScreen() {
  const router = useRouter();

  // ✅ ADDED: Smart Back Navigation
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/'); // Fallback to landing if no history
    }
  };

  const selectRole = (role: 'client' | 'seller') => {
    router.push(`/(auth)/sign-up?role=${role}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ✅ UPDATED: Back Button with handleBack */}
        <TouchableOpacity onPress={handleBack} className="mb-6">
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>

        <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome to RealEase</Text>
        <Text className="text-gray-500 mb-8 text-base">
          How do you plan to use RealEase?
        </Text>

        {/* Option 1: Client Card */}
        <TouchableOpacity 
          onPress={() => selectRole('client')}
          activeOpacity={0.9}
          className="bg-teal-50 border-2 border-teal-600 p-6 rounded-3xl mb-6 shadow-sm"
        >
          <View className="flex-row justify-between items-start mb-4">
            <View className="bg-teal-600 p-4 rounded-2xl">
              <Search size={32} color="white" />
            </View>
            <View className="bg-teal-600 rounded-full p-2">
              <ChevronRight size={20} color="white" />
            </View>
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-2">I want to Buy/Rent</Text>
          <Text className="text-gray-600 mb-6 leading-5">
            Find your dream home from verified properties. Browse listings, contact agents, and make secure offers.
          </Text>

          <View className="bg-white/60 rounded-xl p-4">
            <Text className="text-teal-800 font-bold mb-2">Perfect for:</Text>
            <View className="space-y-1">
              <Text className="text-gray-700">• Home buyers and renters</Text>
              <Text className="text-gray-700">• First-time buyers</Text>
              <Text className="text-gray-700">• Property investors</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Option 2: Seller Card */}
        <TouchableOpacity 
          onPress={() => selectRole('seller')}
          activeOpacity={0.9}
          className="bg-orange-50 border-2 border-orange-500 p-6 rounded-3xl mb-8 shadow-sm"
        >
          <View className="flex-row justify-between items-start mb-4">
            <View className="bg-orange-600 p-4 rounded-2xl">
              <Briefcase size={32} color="white" />
            </View>
            <View className="bg-orange-600 rounded-full p-2">
              <ChevronRight size={20} color="white" />
            </View>
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-2">I am an Agent/Seller</Text>
          <Text className="text-gray-600 mb-6 leading-5">
            List your properties, connect with serious buyers, and grow your business with verified credentials.
          </Text>

          <View className="bg-white/60 rounded-xl p-4">
            <Text className="text-orange-800 font-bold mb-2">Perfect for:</Text>
            <View className="space-y-1">
              <Text className="text-gray-700">• Real estate agents & brokers</Text>
              <Text className="text-gray-700">• Property owners</Text>
              <Text className="text-gray-700">• Developers</Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text className="text-center text-gray-400 text-xs mb-8">
          You can change this later in your profile settings.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}


