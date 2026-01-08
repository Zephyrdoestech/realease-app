// components/MapMarker.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface MapMarkerProps {
  price: number;
  isSelected?: boolean;
}

export const MapMarker: React.FC<MapMarkerProps> = ({ 
  price, 
  isSelected = false 
}) => {
  const formatPrice = (price: number): string => {
    if (price >= 1000000) {
      return `₱${(price / 1000000).toFixed(1)}M`;
    }
    return `₱${(price / 1000).toFixed(0)}k`;
  };

  return (
    <View className="items-center">
      {/* Main Price Bubble */}
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
      
      {/* Arrow - Rotated Square (NO BORDER HACKS) */}
      <View className="relative" style={{ marginTop: -6 }}>
        <View
          className={`
            w-3 h-3 transform rotate-45
            ${isSelected ? 'bg-teal-700' : 'bg-white border-2 border-teal-700 border-t-0 border-l-0'}
          `}
        />
      </View>
    </View>
  );
};