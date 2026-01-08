// components/FilterChip.tsx
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({ 
  label, 
  selected = false, 
  onPress 
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`
        px-4 py-2.5 rounded-full mr-2
        ${selected ? 'bg-teal-700' : 'bg-white border border-gray-300'}
      `}
    >
      <Text className={`
        text-sm font-semibold
        ${selected ? 'text-white' : 'text-gray-700'}
      `}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};