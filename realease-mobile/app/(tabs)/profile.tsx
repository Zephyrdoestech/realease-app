import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router'; 
import {
  Shield, Upload, FileText, Settings, HelpCircle, Heart, LogOut, AlertCircle, CheckCircle, User
} from 'lucide-react-native';
import { useAuth } from '@/ctx/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';

export default function ProfileScreen() {
  const router = useRouter();
  const { session, role } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch Real Profile Data
  const fetchProfile = async () => {
    // 🛡️ SAFETY CHECK: If no session, stop trying to fetch
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      setProfileData(data);
    } catch (error) {
      console.log('Error fetching profile:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Reload when screen focuses
  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [session]) // Added session as dependency
  );

  // ✅ FIXED LOGOUT: Added loading state and manual redirect to prevent freezing
  const handleLogout = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      // ⚡ Try the root path first, as (auth) groups are ignored in URLs
      router.replace('/sign-in'); 

    } catch (error: any) {
      setLoading(false);
      
      // If '/sign-in' failed, try the explicit auth path as a fallback
      try {
        router.replace('/sign-in');
      } catch (e) {
        Alert.alert("Route Error", "Could not find the Sign In screen. Please check your folder names.");
      }
    }
  };

  // Show loader while fetching or logging out
  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0F766E" />
      </View>
    );
  }

  const isVerified = profileData?.is_verified;
  const isSeller = role === 'seller';

  // Helper for menu items
  const MenuItem = ({ icon, title, subtitle, onPress }: any) => (
    <TouchableOpacity onPress={onPress} className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-sm">
      <View className="bg-gray-100 rounded-full p-3 mr-4">{icon}</View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900">{title}</Text>
        {subtitle && <Text className="text-sm text-gray-600 mt-0.5">{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={() => { setRefreshing(true); fetchProfile(); }} 
            colors={['#0F766E']} 
          />
        }
      >
        {/* Header */}
        <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900 mb-6">Profile</Text>

          <View className="flex-row items-center">
            <View className="bg-teal-700 rounded-full w-20 h-20 items-center justify-center">
              <Text className="text-white text-3xl font-bold">
                {profileData?.full_name?.charAt(0) || 'U'}
              </Text>
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-xl font-bold text-gray-900">{profileData?.full_name || 'User'}</Text>
              <Text className="text-sm text-gray-600 mt-1">{session?.user?.email}</Text>
              
              {isVerified ? (
                <View className="flex-row items-center mt-2 bg-teal-50 self-start px-2 py-1 rounded-full">
                  <CheckCircle size={12} color="#0F766E" />
                  <Text className="text-xs font-semibold text-teal-700 ml-1">Verified Agent</Text>
                </View>
              ) : (
                <Text className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest">{role}</Text>
              )}
            </View>
          </View>
        </View>

        <View className="px-6 pt-6">
          {/* SELLER: Get Verified Card */}
          {isSeller && !isVerified && (
            <View className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
              <View className="flex-row items-start mb-4">
                <AlertCircle size={24} color="#F59E0B" />
                <View className="ml-3 flex-1">
                  <Text className="text-lg font-bold text-amber-900">Get Verified</Text>
                  <Text className="text-sm text-amber-800 mt-1">
                    Upload your PRC License to unlock full selling features and build trust.
                  </Text>
                </View>
              </View>
              <Button 
                title="Upload Documents" 
                onPress={() => router.push('/verification/upload' as any)} 
                variant="outline" 
              />
            </View>
          )}

          {/* SELLER: Verified Stats */}
          {isSeller && isVerified && (
            <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
              <Text className="text-base font-bold text-gray-900 mb-3">Trust Score</Text>
              <View className="flex-row items-center">
                <View className="flex-1 bg-gray-200 rounded-full h-4 mr-4">
                  <View className="bg-teal-700 rounded-full h-4" style={{ width: `${profileData?.trust_score || 0}%` }} />
                </View>
                <Text className="text-2xl font-bold text-teal-700">{profileData?.trust_score || 0}%</Text>
              </View>
            </View>
          )}

          {/* Menu Items */}
          {isSeller && (
            <MenuItem 
              icon={<FileText size={20} color="#0F766E" />} 
              title="My Listings" 
              subtitle="Manage your active properties"
              onPress={() => router.push('/seller-dashboard' as any)}
            />
          )}

          <MenuItem 
            icon={<Heart size={20} color="#EF4444" />} 
            title="Saved Properties" 
            onPress={() => {}}
          />

          <MenuItem 
            icon={<Settings size={20} color="#6B7280" />} 
            title="Settings" 
            onPress={() => {}}
          />

          {/* LOGOUT */}
          <TouchableOpacity 
            onPress={handleLogout}
            disabled={loading}
            className="flex-row items-center justify-center p-4 bg-red-50 rounded-xl mt-4 mb-10 border border-red-100"
          >
            {loading ? (
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <>
                <LogOut size={20} color="#EF4444" />
                <Text className="text-red-600 font-bold ml-2">Log Out</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}