import React from 'react';
import { View, Text, TouchableOpacity, Image, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Home, Shield, TrendingUp, Moon, Sun } from 'lucide-react-native';
// ✅ IMPORT NativeWind Hook
import { useColorScheme } from 'nativewind';

export default function LandingScreen() {
  const router = useRouter();
  // ✅ USE THE HOOK
  const { colorScheme, toggleColorScheme } = useColorScheme();
  
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 relative">
      
      {/* 🌙 DARK MODE TOGGLE (Floating Top Right) */}
      <View className="absolute top-12 right-6 z-50 flex-row items-center bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm">
        {colorScheme === 'dark' ? (
          <Moon size={16} color="#E5E7EB" className="mr-2" />
        ) : (
          <Sun size={16} color="#F59E0B" className="mr-2" />
        )}
        <Switch 
          value={colorScheme === 'dark'} 
          onValueChange={toggleColorScheme}
          trackColor={{ false: '#D1D5DB', true: '#0F766E' }}
          thumbColor={'#FFFFFF'}
        />
      </View>

      {/* Hero Section */}
      <View className="flex-1 px-6 justify-center">
        {/* Logo Section */}
        <View className="items-center mb-8">
          <Image 
            source={require('../assets/logo.png')} 
            className="w-64 h-64 mb-0" 
            resizeMode="contain"
          />
          
          <Text className="text-xl text-gray-600 dark:text-gray-300 text-center px-8 mb-12">
            Your journey home, simplified.
          </Text>
        </View>

        {/* Feature Highlights */}
        <View className="space-y-4 mb-12">
          <View className="flex-row items-center bg-teal-50 dark:bg-gray-800 rounded-2xl p-4 mb-4">
            <View className="bg-teal-700 rounded-full p-3 mr-4">
              <Shield size={24} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-gray-900 dark:text-white">Verified Agents</Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">Every agent is thoroughly verified</Text>
            </View>
          </View>

          <View className="flex-row items-center bg-blue-50 dark:bg-gray-800 rounded-2xl p-4 mb-4">
            <View className="bg-blue-600 rounded-full p-3 mr-4">
              <Home size={24} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-gray-900 dark:text-white">Trusted Properties</Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">All titles verified and secured</Text>
            </View>
          </View>

          <View className="flex-row items-center bg-amber-50 dark:bg-gray-800 rounded-2xl p-4">
            <View className="bg-amber-600 rounded-full p-3 mr-4">
              <TrendingUp size={24} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-gray-900 dark:text-white">Secure Transactions</Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">Escrow-protected payments</Text>
            </View>
          </View>
        </View>

        {/* CTA Buttons */}
        <View className="space-y-4">
          <TouchableOpacity
            onPress={() => router.push('/(auth)/role-selection')}
            activeOpacity={0.8}
            className="bg-teal-700 rounded-2xl py-4 items-center shadow-lg mb-4"
          >
            <Text className="text-white text-lg font-bold">Get Started</Text>
          </TouchableOpacity>

          <View className="flex-row items-center justify-center">
            <Text className="text-gray-600 dark:text-gray-400 text-base">Already have an account? </Text>
            <TouchableOpacity 
              onPress={() => router.push('/(auth)/sign-in')} 
              activeOpacity={0.7}
            >
              <Text className="text-teal-700 dark:text-teal-400 text-base font-bold">Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View className="px-6 pb-6">
        <Text className="text-center text-xs text-gray-500 dark:text-gray-500">
          By continuing, you agree to our{' '}
          <Text className="text-teal-700 dark:text-teal-400">Terms of Service</Text> and{' '}
          <Text className="text-teal-700 dark:text-teal-400">Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}