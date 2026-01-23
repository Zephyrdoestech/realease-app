import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
}) => {
  const getVariantStyles = () => {
    if (disabled) {
      return 'bg-gray-300';
    }
    
    switch (variant) {
      case 'primary':
        return 'bg-teal-700';
      case 'secondary':
        return 'bg-amber-500';
      case 'outline':
        return 'bg-transparent border-2 border-teal-700';
      default:
        return 'bg-teal-700';
    }
  };

  const getTextStyles = () => {
    if (disabled) {
      return 'text-gray-500';
    }
    
    switch (variant) {
      case 'outline':
        return 'text-teal-700';
      default:
        return 'text-white';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2';
      case 'md':
        return 'px-6 py-3';
      case 'lg':
        return 'px-8 py-4';
      default:
        return 'px-6 py-3';
    }
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'md':
        return 'text-base';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      className={`
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${fullWidth ? 'w-full' : ''}
        rounded-xl
        flex-row
        items-center
        justify-center
        shadow-sm
      `}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? '#0F766E' : '#FFFFFF'}
          size="small"
        />
      ) : (
        <>
          {icon && <View className="mr-2">{icon}</View>}
          <Text className={`${getTextStyles()} ${getTextSizeStyles()} font-semibold`}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};