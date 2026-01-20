import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail, Lock } from 'lucide-react-native';
import { supabase } from '@/lib/supabase'; // Import Supabase directly

export default function SignInScreen() {
  const router = useRouter();
  
  // Pre-fill for easier testing (Optional)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateInputs = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;

      // Success! AuthContext will handle the redirect to /(tabs) automatically.
      
    } catch (error: any) {
      Alert.alert(
        'Sign In Failed',
        error.message || 'Invalid email or password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="px-6 pt-4 pb-6">
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              className="mb-6"
            >
              <ArrowLeft size={24} className="text-gray-900 dark:text-white" />
            </TouchableOpacity>

            <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back
            </Text>
            <Text className="text-base text-gray-600 dark:text-gray-400">
              Sign in to continue to RealEase
            </Text>
          </View>

          {/* Logo */}
          <View className="items-center mb-8">
            <Image 
              source={require('../../assets/logo.png')} 
              className="w-64 h-64" 
              resizeMode="contain"
            />
          </View>

          {/* Form */}
          <View className="px-6 flex-1">
            {/* Email */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email
              </Text>
              <View className="flex-row items-center bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3">
                <Mail size={20} color="#9CA3AF" />
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  className="flex-1 ml-3 text-base text-gray-900 dark:text-white"
                />
              </View>
            </View>

            {/* Password */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </Text>
              <View className="flex-row items-center bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3">
                <Lock size={20} color="#9CA3AF" />
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password"
                  className="flex-1 ml-3 text-base text-gray-900 dark:text-white"
                />
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity activeOpacity={0.7} className="mb-6">
              <Text className="text-sm font-semibold text-teal-700 dark:text-teal-400 text-right">
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* ✅ THE SIGN IN BUTTON IS HERE */}
            <TouchableOpacity
              onPress={handleSignIn}
              disabled={isLoading}
              activeOpacity={0.8}
              className="bg-teal-700 rounded-xl py-4 items-center shadow-sm mb-6"
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white text-base font-bold">
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View className="flex-row items-center justify-center">
              <Text className="text-gray-600 dark:text-gray-400 text-sm">
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity
                // ✅ Points to Role Selection (Important!)
                onPress={() => router.push('/(auth)/role-selection')}
                activeOpacity={0.7}
              >
                <Text className="text-teal-700 dark:text-teal-400 text-sm font-bold">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}