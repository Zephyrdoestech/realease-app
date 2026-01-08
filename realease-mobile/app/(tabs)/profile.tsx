// app/(tabs)/profile.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from 'lucide-react-native';

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 items-center justify-center px-6">
        <View className="bg-amber-100 rounded-full p-6 mb-4">
          <User size={48} color="#F59E0B" />
        </View>
        <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Profile
        </Text>
        <Text className="text-base text-gray-600 text-center">
          User profile and settings coming soon
        </Text>
      </View>
    </SafeAreaView>
  );
}