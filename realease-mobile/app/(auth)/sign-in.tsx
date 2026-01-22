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
import { useAuth } from '@/ctx/AuthContext';
import { supabase } from '@/lib/supabase';

export default function SignInScreen() {
  const router = useRouter();
  const { session } = useAuth(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ✅ IMPROVED BACK NAVIGATION: Checks if history exists
  const handleBackNavigation = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // If no history, redirect to the landing page or home
      router.replace('/'); 
    }
  };

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
    console.log("Attempting login with:", email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error("Supabase detailed error:", error);
        Alert.alert('Login Error', error.message);
      } else {
        // ✅ Navigate to main app on success
        router.replace('/(tabs)');
      }
    } catch (err) {
      Alert.alert('System Error', 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
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
            {/* ✅ UPDATED ONPRESS */}
            <TouchableOpacity
              onPress={handleBackNavigation}
              activeOpacity={0.7}
              className="mb-6"
            >
              <ArrowLeft size={24} color="#1F2937" />
            </TouchableOpacity>

            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </Text>
            <Text className="text-base text-gray-600">
              Sign in to continue to RealEase
            </Text>
          </View>

          {/* Logo */}
          <View className="items-center mb-8">
            <Image 
              source={require('../../assets/logo.png')} 
              className="w-65 h-64 mb-0" 
              resizeMode="contain"
            />
          </View>

          {/* Form */}
          <View className="px-6 flex-1">
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Email</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
                <Mail size={20} color="#9CA3AF" />
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 ml-3 text-base text-gray-900"
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Password</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
                <Lock size={20} color="#9CA3AF" />
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  className="flex-1 ml-3 text-base text-gray-900"
                />
              </View>
            </View>

            <TouchableOpacity activeOpacity={0.7} className="mb-6">
              <Text className="text-sm font-semibold text-teal-700 text-right">
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSignIn}
              disabled={isLoading}
              activeOpacity={0.8}
              className="bg-teal-700 rounded-xl py-4 items-center shadow-sm mb-6"
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white text-base font-bold">Sign In</Text>
              )}
            </TouchableOpacity>

            <View className="flex-row items-center justify-center">
              <Text className="text-gray-600 text-sm">Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => router.push('/sign-up')}
                activeOpacity={0.7}
              >
                <Text className="text-teal-700 text-sm font-bold">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}