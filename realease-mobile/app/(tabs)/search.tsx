// app/(tabs)/search.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin } from 'lucide-react-native';

export default function SearchScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 items-center justify-center px-6">
        <View className="bg-teal-100 rounded-full p-6 mb-4">
          <MapPin size={48} color="#0F766E" />
        </View>
        <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Map Search
        </Text>
        <Text className="text-base text-gray-600 text-center">
          Search screen with map integration coming soon
        </Text>
      </View>
    </SafeAreaView>
  );
}