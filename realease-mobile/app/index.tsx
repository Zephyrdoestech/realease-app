// app/index.tsx
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, Shield, TrendingUp } from 'lucide-react-native';
import { useAuth } from '@/ctx/AuthContext';

export default function LandingScreen() {
  const router = useRouter();
  const { session, isLoading } = useAuth();

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (!isLoading && session) {
      router.replace('/(tabs)');
    }
  }, [session, isLoading]);

  // Show nothing while checking session
  if (isLoading) {
    return <View className="flex-1 bg-white" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Hero Section */}
      <View className="flex-1 px-6 justify-center">
        {/* Logo */}
        <View className="items-center mb-8">
          <View className="bg-teal-700 rounded-3xl w-32 h-32 items-center justify-center mb-6 shadow-lg">
            <Text className="text-white text-6xl font-bold">R</Text>
          </View>
          
          <Text className="text-5xl font-bold text-gray-900 mb-3">
            RealEase
          </Text>
          
          <Text className="text-xl text-gray-600 text-center px-8 mb-12">
            Your journey home, simplified.
          </Text>
        </View>

        {/* Feature Highlights */}
        <View className="space-y-4 mb-12">
          <View className="flex-row items-center bg-teal-50 rounded-2xl p-4">
            <View className="bg-teal-700 rounded-full p-3 mr-4">
              <Shield size={24} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-gray-900">
                Verified Agents
              </Text>
              <Text className="text-sm text-gray-600">
                Every agent is thoroughly verified
              </Text>
            </View>
          </View>

          <View className="flex-row items-center bg-blue-50 rounded-2xl p-4">
            <View className="bg-blue-600 rounded-full p-3 mr-4">
              <Home size={24} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-gray-900">
                Trusted Properties
              </Text>
              <Text className="text-sm text-gray-600">
                All titles verified and secured
              </Text>
            </View>
          </View>

          <View className="flex-row items-center bg-amber-50 rounded-2xl p-4">
            <View className="bg-amber-600 rounded-full p-3 mr-4">
              <TrendingUp size={24} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-gray-900">
                Secure Transactions
              </Text>
              <Text className="text-sm text-gray-600">
                Escrow-protected payments
              </Text>
            </View>
          </View>
        </View>

        {/* CTA Buttons */}
        <View className="space-y-4">
          {/* Get Started - Primary */}
          <TouchableOpacity
            onPress={() => router.push('/auth/role-selection')}
            activeOpacity={0.8}
            className="bg-teal-700 rounded-2xl py-4 items-center shadow-lg"
          >
            <Text className="text-white text-lg font-bold">
              Get Started
            </Text>
          </TouchableOpacity>

          {/* Login - Secondary */}
          <View className="flex-row items-center justify-center">
            <Text className="text-gray-600 text-base">
              Already have an account?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/auth/sign-in')}
              activeOpacity={0.7}
            >
              <Text className="text-teal-700 text-base font-bold">
                Log In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View className="px-6 pb-6">
        <Text className="text-center text-xs text-gray-500">
          By continuing, you agree to our{' '}
          <Text className="text-teal-700">Terms of Service</Text>
          {' '}and{' '}
          <Text className="text-teal-700">Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}