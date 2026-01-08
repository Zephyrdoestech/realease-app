// components/MapMarker.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface MapMarkerProps {
  price: number;
  isSelected?: boolean;
}

export const MapMarker: React.FC<MapMarkerProps> = ({ price, isSelected = false }) => {
  const formatPrice = (price: number): string => {
    if (price >= 1000000) {
      return `₱${(price / 1000000).toFixed(1)}M`;
    }
    return `₱${(price / 1000).toFixed(0)}k`;
  };

  return (
    <View className="items-center">
      <View
        className={`
          px-3 py-1.5 rounded-full shadow-lg
          ${isSelected ? 'bg-teal-700' : 'bg-white border-2 border-teal-700'}
        `}
      >
        <Text
          className={`
            text-sm font-bold
            ${isSelected ? 'text-white' : 'text-teal-700'}
          `}
        >
          {formatPrice(price)}
        </Text>
      </View>
      {/* Arrow pointing down */}
      <View
        className={`
          w-0 h-0 border-l-8 border-r-8 border-t-8
          border-l-transparent border-r-transparent
          ${isSelected ? 'border-t-teal-700' : 'border-t-white'}
        `}
        style={{
          marginTop: -1,
        }}
      />
    </View>
  );
};