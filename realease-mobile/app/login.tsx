// app/login.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, Lock, X } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleEmailLogin = () => {
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    
    // Simulate connecting to Google
    setTimeout(() => {
      setIsLoading(false);
      setShowAccountPicker(true);
    }, 1500);
  };

  const handleFacebookLogin = () => {
    setIsLoading(true);
    
    // Simulate Facebook login
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  const handleAccountSelect = () => {
    setShowAccountPicker(false);
    setIsSigningIn(true);
    
    // Simulate signing in
    setTimeout(() => {
      setIsSigningIn(false);
      router.replace('/(tabs)');
    }, 1000);
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
          <View className="flex-1 px-6 pt-8">
            {/* Header Section */}
            <View className="items-center mb-8">
              {/* Logo/Brand */}
              <View className="bg-teal-700 rounded-3xl w-20 h-20 items-center justify-center mb-4">
                <Text className="text-white text-4xl font-bold">R</Text>
              </View>
              
              <Text className="text-4xl font-bold text-gray-900 mb-2">
                RealEase
              </Text>
              
              <Text className="text-base text-gray-600 text-center">
                Your journey home, simplified.
              </Text>
            </View>

            {/* Login Form */}
            <View className="mb-6">
              <Text className="text-2xl font-bold text-gray-900 mb-6">
                Welcome Back
              </Text>

              {/* Email Input */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Email
                </Text>
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

              {/* Password Input */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Password
                </Text>
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

              {/* Forgot Password */}
              <TouchableOpacity activeOpacity={0.7} className="mb-6">
                <Text className="text-sm font-semibold text-teal-700 text-right">
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {/* Sign In Button */}
              <TouchableOpacity
                onPress={handleEmailLogin}
                disabled={isLoading}
                activeOpacity={0.8}
                className="bg-teal-700 rounded-xl py-4 items-center shadow-sm"
              >
                {isLoading && !showAccountPicker && !isSigningIn ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white text-base font-bold">
                    Sign In
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="px-4 text-sm text-gray-500">Or continue with</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Social Login Buttons */}
            <View className="mb-6">
              {/* Google Button */}
              <TouchableOpacity
                onPress={handleGoogleLogin}
                disabled={isLoading}
                activeOpacity={0.7}
                className="bg-white border border-gray-300 rounded-xl py-3 px-4 flex-row items-center justify-center mb-3 shadow-sm"
              >
                <Image
                  source={{ uri: 'https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-suite-everything-you-need-know-about-google-newest-0.png' }}
                  style={{ width: 24, height: 24 }}
                  resizeMode="contain"
                />
                <Text className="text-gray-900 text-base font-semibold ml-3">
                  Continue with Google
                </Text>
              </TouchableOpacity>

              {/* Facebook Button */}
              <TouchableOpacity
                onPress={handleFacebookLogin}
                disabled={isLoading}
                activeOpacity={0.7}
                className="bg-blue-600 rounded-xl py-3 px-4 flex-row items-center justify-center shadow-sm"
              >
                <Image
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png' }}
                  style={{ width: 24, height: 24 }}
                  resizeMode="contain"
                />
                <Text className="text-white text-base font-semibold ml-3">
                  Continue with Facebook
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View className="flex-row items-center justify-center mb-6">
              <Text className="text-gray-600 text-sm">
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="text-teal-700 text-sm font-bold">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Google Account Picker Modal */}
      <Modal
        visible={showAccountPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAccountPicker(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-3xl w-full max-w-sm overflow-hidden">
            {/* Modal Header */}
            <View className="flex-row items-center justify-between p-6 border-b border-gray-200">
              <Text className="text-xl font-bold text-gray-900">
                Choose an account
              </Text>
              <TouchableOpacity
                onPress={() => setShowAccountPicker(false)}
                activeOpacity={0.7}
                className="p-1"
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Account List */}
            <View className="p-4">
              {/* Demo Account */}
              <TouchableOpacity
                onPress={handleAccountSelect}
                activeOpacity={0.7}
                className="flex-row items-center p-4 rounded-xl bg-gray-50 mb-3"
              >
                {/* Avatar */}
                <View className="bg-teal-700 rounded-full w-12 h-12 items-center justify-center mr-4">
                  <Text className="text-white text-lg font-bold">D</Text>
                </View>
                
                {/* Account Info */}
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-900 mb-1">
                    Demo User
                  </Text>
                  <Text className="text-sm text-gray-600">
                    demo@realease.ph
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Use Another Account */}
              <TouchableOpacity
                onPress={() => {
                  setShowAccountPicker(false);
                  // In a real app, this would open another auth flow
                }}
                activeOpacity={0.7}
                className="flex-row items-center p-4 rounded-xl border border-gray-300"
              >
                <View className="bg-gray-200 rounded-full w-12 h-12 items-center justify-center mr-4">
                  <Text className="text-gray-600 text-2xl font-bold">+</Text>
                </View>
                
                <Text className="text-base font-semibold text-gray-900">
                  Use another account
                </Text>
              </TouchableOpacity>
            </View>

            {/* Privacy Notice */}
            <View className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <Text className="text-xs text-gray-600 text-center leading-5">
                To continue, RealEase will share your name, email address, and profile picture with Google.
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Signing In Modal */}
      <Modal
        visible={isSigningIn}
        transparent
        animationType="fade"
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-3xl p-8 items-center">
            <ActivityIndicator size="large" color="#0F766E" />
            <Text className="text-lg font-bold text-gray-900 mt-4">
              Signing in...
            </Text>
            <Text className="text-sm text-gray-600 mt-2">
              Please wait a moment
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}