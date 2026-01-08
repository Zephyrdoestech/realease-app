// components/VerifiedBadge.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Shield } from 'lucide-react-native';

interface VerifiedBadgeProps {
  isVerified: boolean;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ isVerified }) => {
  if (!isVerified) return null;

  return (
    <View className="flex-row items-center bg-teal-700 rounded-full px-3 py-1.5 shadow-sm">
      <Shield size={14} color="#FFFFFF" fill="#FFFFFF" />
      <Text className="text-white text-xs font-semibold ml-1">Verified</Text>
    </View>
  );
};