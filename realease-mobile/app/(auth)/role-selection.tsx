import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Briefcase, Search, ArrowRight, ChevronRight, Moon, Sun } from 'lucide-react-native';
// ✅ Import NativeWind Hook
import { useColorScheme } from 'nativewind';

export default function RoleSelectionScreen() {
  const router = useRouter();
  // ✅ Use Hook
  const { colorScheme, toggleColorScheme, setColorScheme } = useColorScheme();

  const handleRoleSelection = (role: 'client' | 'seller') => {
    router.push({
      pathname: '/(auth)/sign-up',
      params: { role },
    });
  };

  // Helper for icon colors
  const iconColor = colorScheme === 'dark' ? '#FFFFFF' : '#1F2937';

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 relative">
      
      {/* 🌙 DARK MODE TOGGLE (Floating Top Right) */}
      <View className="absolute top-6 right-6 z-50 flex-row items-center bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm">
        {colorScheme === 'dark' ? (
          <Moon size={16} color="#E5E7EB" className="mr-2" />
        ) : (
          <Sun size={16} color="#F59E0B" className="mr-2" />
        )}
        <Switch 
          value={colorScheme === 'dark'} 
          onValueChange={(value) => setColorScheme(value ? 'dark' : 'light')}
          trackColor={{ false: '#D1D5DB', true: '#0F766E' }}
          thumbColor={'#FFFFFF'}
        />
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} className="mb-6">
          <ArrowRight size={24} color={iconColor} style={{ transform: [{ rotate: '180deg' }]}} />
        </TouchableOpacity>

        <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to RealEase</Text>
        <Text className="text-gray-500 dark:text-gray-400 mb-8 text-base">
          How do you plan to use RealEase?
        </Text>

        {/* Option 1: Client Card */}
        <TouchableOpacity 
          onPress={() => handleRoleSelection('client')}
          activeOpacity={0.9}
          className="bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-600 dark:border-teal-500 p-6 rounded-3xl mb-6 shadow-sm"
        >
          <View className="flex-row justify-between items-start mb-4">
            <View className="bg-teal-600 p-4 rounded-2xl">
              <Search size={32} color="white" />
            </View>
            <View className="bg-teal-600 rounded-full p-2">
              <ChevronRight size={20} color="white" />
            </View>
          </View>

          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">I want to Buy/Rent</Text>
          <Text className="text-gray-600 dark:text-gray-300 mb-6 leading-5">
            Find your dream home from verified properties. Browse listings, contact agents, and make secure offers.
          </Text>

          <View className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4">
            <Text className="text-teal-800 dark:text-teal-300 font-bold mb-2">Perfect for:</Text>
            <View className="space-y-1">
              <Text className="text-gray-700 dark:text-gray-400">• Home buyers and renters</Text>
              <Text className="text-gray-700 dark:text-gray-400">• First-time buyers</Text>
              <Text className="text-gray-700 dark:text-gray-400">• Property investors</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Option 2: Seller Card */}
        <TouchableOpacity 
          onPress={() => handleRoleSelection('seller')}
          activeOpacity={0.9}
          className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-500 dark:border-orange-400 p-6 rounded-3xl mb-8 shadow-sm"
        >
          <View className="flex-row justify-between items-start mb-4">
            <View className="bg-orange-600 p-4 rounded-2xl">
              <Briefcase size={32} color="white" />
            </View>
            <View className="bg-orange-600 rounded-full p-2">
              <ChevronRight size={20} color="white" />
            </View>
          </View>

          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">I am an Agent/Seller</Text>
          <Text className="text-gray-600 dark:text-gray-300 mb-6 leading-5">
            List your properties, connect with serious buyers, and grow your business with verified credentials.
          </Text>

          <View className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4">
            <Text className="text-orange-800 dark:text-orange-300 font-bold mb-2">Perfect for:</Text>
            <View className="space-y-1">
              <Text className="text-gray-700 dark:text-gray-400">• Real estate agents & brokers</Text>
              <Text className="text-gray-700 dark:text-gray-400">• Property owners</Text>
              <Text className="text-gray-700 dark:text-gray-400">• Developers</Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text className="text-center text-gray-400 dark:text-gray-500 text-xs mb-8">
          You can change this later in your profile settings.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}