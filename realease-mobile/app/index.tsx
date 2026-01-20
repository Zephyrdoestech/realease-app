import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Home, Shield, TrendingUp } from 'lucide-react-native';

export default function LandingScreen() {
  const router = useRouter();
  
  // NOTE: No auth logic here. _layout.tsx handles the protection.

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Hero Section */}
      <View className="flex-1 px-6 justify-center">
        {/* Logo Section */}
        <View className="items-center mb-8">
          <Image 
            // Ensure this file exists in assets!
            source={require('../assets/logo.png')} 
            className="w-64 h-64 mb-0" 
            resizeMode="contain"
          />
          
          <Text className="text-xl text-gray-600 text-center px-8 mb-12">
            Your journey home, simplified.
          </Text>
        </View>

        {/* Feature Highlights */}
        <View className="space-y-4 mb-12">
          <View className="flex-row items-center bg-teal-50 rounded-2xl p-4 mb-4">
            <View className="bg-teal-700 rounded-full p-3 mr-4">
              <Shield size={24} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-gray-900">Verified Agents</Text>
              <Text className="text-sm text-gray-600">Every agent is thoroughly verified</Text>
            </View>
          </View>

          <View className="flex-row items-center bg-blue-50 rounded-2xl p-4 mb-4">
            <View className="bg-blue-600 rounded-full p-3 mr-4">
              <Home size={24} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-gray-900">Trusted Properties</Text>
              <Text className="text-sm text-gray-600">All titles verified and secured</Text>
            </View>
          </View>

          <View className="flex-row items-center bg-amber-50 rounded-2xl p-4">
            <View className="bg-amber-600 rounded-full p-3 mr-4">
              <TrendingUp size={24} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-gray-900">Secure Transactions</Text>
              <Text className="text-sm text-gray-600">Escrow-protected payments</Text>
            </View>
          </View>
        </View>

        {/* CTA Buttons */}
        <View className="space-y-4">
          <TouchableOpacity
            // ✅ FIX: Explicit path to (auth) folder
            onPress={() => router.push('/(auth)/role-selection')}
            activeOpacity={0.8}
            className="bg-teal-700 rounded-2xl py-4 items-center shadow-lg mb-4"
          >
            <Text className="text-white text-lg font-bold">Get Started</Text>
          </TouchableOpacity>

          <View className="flex-row items-center justify-center">
            <Text className="text-gray-600 text-base">Already have an account? </Text>
            <TouchableOpacity 
              // ✅ FIX: Explicit path to (auth) folder
              onPress={() => router.push('/(auth)/sign-in')} 
              activeOpacity={0.7}
            >
              <Text className="text-teal-700 text-base font-bold">Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View className="px-6 pb-6">
        <Text className="text-center text-xs text-gray-500">
          By continuing, you agree to our{' '}
          <Text className="text-teal-700">Terms of Service</Text> and{' '}
          <Text className="text-teal-700">Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}