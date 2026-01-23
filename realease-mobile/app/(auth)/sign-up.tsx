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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, User as UserIcon, Mail, Lock, CheckCircle } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

export default function SignUpScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: 'client' | 'seller' }>();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const validateInputs = () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return;
    if (!role) {
      Alert.alert('Error', 'Role not specified. Please go back and select your role.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned from signup');

      // 2. Insert profile with role
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        full_name: fullName.trim(),
        role: role,
        is_verified: false,
        trust_score: 0,
      });

      if (profileError) throw profileError;

      //SILENT REDIRECT: Clear session and move to sign-in immediately
      await supabase.auth.signOut();
      router.replace('/sign-in');

    } catch (error: any) {
      console.error('Sign up error:', error);
      
      if (error.message?.includes('already registered')) {
        Alert.alert(
          'Email Already Exists',
          'This email is already registered. Please sign in instead.',
          [
            { text: 'Go to Sign In', onPress: () => router.push('/sign-in') },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
      } else {
        Alert.alert('Sign Up Failed', error.message || 'An error occurred during sign up');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadge = () => {
    if (!role) return null;
    return (
      <View className={`flex-row items-center px-4 py-2 rounded-full mb-6 ${role === 'client' ? 'bg-teal-50' : 'bg-amber-50'}`}>
        <CheckCircle size={16} color={role === 'client' ? '#0F766E' : '#D97706'} />
        <Text className={`text-sm font-semibold ml-2 ${role === 'client' ? 'text-teal-700' : 'text-amber-700'}`}>
          Creating {role === 'client' ? 'Buyer' : 'Agent/Seller'} Account
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="px-6 pt-4 pb-6">
            <TouchableOpacity onPress={handleBack} activeOpacity={0.7} className="mb-6">
              <ArrowLeft size={24} color="#1F2937" />
            </TouchableOpacity>

            <Text className="text-3xl font-bold text-gray-900 mb-2">Create Account</Text>
            <Text className="text-base text-gray-600 mb-4">Join thousands of users on RealEase</Text>
            {getRoleBadge()}
          </View>

          <View className="px-6 flex-1">
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Full Name *</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
                <UserIcon size={20} color="#9CA3AF" />
                <TextInput
                  placeholder="Enter your full name"
                  placeholderTextColor="#9CA3AF"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  className="flex-1 ml-3 text-base text-gray-900"
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Email *</Text>
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
              <Text className="text-sm font-semibold text-gray-700 mb-2">Password *</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
                <Lock size={20} color="#9CA3AF" />
                <TextInput
                  placeholder="Create a password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  className="flex-1 ml-3 text-base text-gray-900"
                />
              </View>
              <Text className="text-xs text-gray-500 mt-1">Must be at least 6 characters</Text>
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Confirm Password *</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
                <Lock size={20} color="#9CA3AF" />
                <TextInput
                  placeholder="Re-enter your password"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  className="flex-1 ml-3 text-base text-gray-900"
                />
              </View>
            </View>

            <TouchableOpacity onPress={handleSignUp} disabled={isLoading} activeOpacity={0.8} className="bg-teal-700 rounded-xl py-4 items-center shadow-sm mb-6">
              {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text className="text-white text-base font-bold">Create Account</Text>}
            </TouchableOpacity>

            <View className="flex-row items-center justify-center mb-6">
              <Text className="text-gray-600 text-sm">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/sign-in')} activeOpacity={0.7}>
                <Text className="text-teal-700 text-sm font-bold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}