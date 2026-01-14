// app/(tabs)/profile.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Shield,
  Upload,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
  HelpCircle,
  Heart,
  LogOut,
  AlertCircle,
  CheckCircle,
  User,
} from 'lucide-react-native';
import { Button } from '../../components/Button';

export default function ProfileScreen() {
  const [isVerified, setIsVerified] = useState(false);

  // Mock data
  const mockUser = {
    name: 'Juan dela Cruz',
    email: 'juan.delacruz@email.com',
    phone: '+63 917 123 4567',
    prcLicense: 'PRC-001234567',
    dhsudReg: 'DHSUD-2024-001234',
    trustScore: isVerified ? 98 : 0,
    listingsCount: 12,
    leadsCount: 34,
  };

  const MenuItem = ({
    icon,
    title,
    subtitle,
    onPress,
    showBadge,
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showBadge?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-sm"
    >
      <View className="bg-gray-100 rounded-full p-3 mr-4">{icon}</View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900">{title}</Text>
        {subtitle && (
          <Text className="text-sm text-gray-600 mt-0.5">{subtitle}</Text>
        )}
      </View>
      {showBadge && (
        <View className="bg-red-500 rounded-full w-6 h-6 items-center justify-center">
          <Text className="text-white text-xs font-bold">3</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4 bg-white">
          <Text className="text-2xl font-bold text-gray-900 mb-4">Profile</Text>

          {/* DEV TOGGLE - FOR DEMO */}
          <View className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-sm font-bold text-amber-900 mb-1">
                  🔧 Demo Mode Toggle
                </Text>
                <Text className="text-xs text-amber-700">
                  Switch between Verified/Unverified states
                </Text>
              </View>
              <Switch
                value={isVerified}
                onValueChange={setIsVerified}
                trackColor={{ false: '#D1D5DB', true: '#0F766E' }}
                thumbColor={isVerified ? '#FFFFFF' : '#F3F4F6'}
              />
            </View>
          </View>

          {/* User Profile Header */}
          <View className="flex-row items-center">
            {/* Avatar */}
            <View className="relative">
              <View className="bg-teal-700 rounded-full w-20 h-20 items-center justify-center">
                <User size={40} color="#FFFFFF" />
              </View>
              {/* Verified Badge */}
              {isVerified && (
                <View className="absolute -bottom-1 -right-1 bg-teal-700 rounded-full p-1.5 border-2 border-white">
                  <Shield size={16} color="#FFFFFF" fill="#FFFFFF" />
                </View>
              )}
            </View>

            {/* User Info */}
            <View className="flex-1 ml-4">
              <Text className="text-xl font-bold text-gray-900">
                {mockUser.name}
              </Text>
              <Text className="text-sm text-gray-600 mt-1">
                {mockUser.email}
              </Text>
              {isVerified && (
                <View className="flex-row items-center mt-2">
                  <CheckCircle size={14} color="#0F766E" />
                  <Text className="text-xs font-semibold text-teal-700 ml-1">
                    Verified Agent
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* UNVERIFIED STATE */}
        {!isVerified && (
          <View className="px-6 pt-4">
            {/* Get Verified Card */}
            <View className="bg-amber-50 border-2 border-amber-500 rounded-2xl p-6 mb-6">
              <View className="flex-row items-start mb-4">
                <AlertCircle size={24} color="#F59E0B" />
                <View className="flex-1 ml-3">
                  <Text className="text-lg font-bold text-gray-900 mb-2">
                    Get Verified to Unlock Agent Features
                  </Text>
                  <Text className="text-sm text-gray-700 mb-4">
                    Verify your identity to post listings, access leads, and
                    build trust with clients. Verified agents get 10x more
                    inquiries.
                  </Text>
                </View>
              </View>

              <Button
                title="Upload Government ID / PRC"
                onPress={() => router.push('/verification/upload')}
                variant="secondary"
                icon={<Upload size={20} color="#FFFFFF" />}
                fullWidth
              />
            </View>

            {/* Low Trust Score */}
            <View className="bg-white rounded-2xl p-6 mb-6">
              <Text className="text-base font-bold text-gray-900 mb-3">
                Trust Score
              </Text>
              <View className="flex-row items-center">
                <View className="flex-1 bg-gray-200 rounded-full h-4 mr-4">
                  <View
                    className="bg-gray-400 rounded-full h-4"
                    style={{ width: '0%' }}
                  />
                </View>
                <Text className="text-2xl font-bold text-gray-400">0%</Text>
              </View>
              <Text className="text-xs text-gray-600 mt-2">
                Complete verification to increase your trust score
              </Text>
            </View>
          </View>
        )}

        {/* VERIFIED STATE */}
        {isVerified && (
          <View className="px-6 pt-4">
            {/* Credentials Card */}
            <View className="bg-teal-50 border-2 border-teal-700 rounded-2xl p-6 mb-6">
              <View className="flex-row items-center mb-4">
                <Shield size={24} color="#0F766E" fill="#0F766E" />
                <Text className="text-lg font-bold text-gray-900 ml-2">
                  Verified Credentials
                </Text>
              </View>

              <View className="space-y-3">
                <View className="bg-white rounded-lg p-3">
                  <Text className="text-xs text-gray-600 mb-1">
                    PRC License Number
                  </Text>
                  <Text className="text-sm font-bold text-gray-900">
                    {mockUser.prcLicense}
                  </Text>
                </View>

                <View className="bg-white rounded-lg p-3 mt-3">
                  <Text className="text-xs text-gray-600 mb-1">
                    DHSUD Registration
                  </Text>
                  <Text className="text-sm font-bold text-gray-900">
                    {mockUser.dhsudReg}
                  </Text>
                </View>
              </View>
            </View>

            {/* Trust Score */}
            <View className="bg-white rounded-2xl p-6 mb-6">
              <Text className="text-base font-bold text-gray-900 mb-3">
                Trust Score
              </Text>
              <View className="flex-row items-center">
                <View className="flex-1 bg-gray-200 rounded-full h-4 mr-4">
                  <View
                    className="bg-teal-700 rounded-full h-4"
                    style={{ width: `${mockUser.trustScore}%` }}
                  />
                </View>
                <Text className="text-2xl font-bold text-teal-700">
                  {mockUser.trustScore}%
                </Text>
              </View>
              <Text className="text-xs text-gray-600 mt-2">
                Excellent! You're among the top 5% of agents
              </Text>
            </View>

            {/* Agent Menu */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-3">
                Agent Dashboard
              </Text>

              <MenuItem
                icon={<FileText size={22} color="#0F766E" />}
                title="My Listings"
                subtitle={`${mockUser.listingsCount} active properties`}
                onPress={() => console.log('My Listings')}
              />

              <MenuItem
                icon={<MessageSquare size={22} color="#0F766E" />}
                title="Lead Inbox"
                subtitle={`${mockUser.leadsCount} new inquiries`}
                onPress={() => console.log('Lead Inbox')}
                showBadge
              />

              <MenuItem
                icon={<BarChart3 size={22} color="#0F766E" />}
                title="Performance Analytics"
                subtitle="Views, clicks, and conversions"
                onPress={() => console.log('Analytics')}
              />
            </View>
          </View>
        )}

        {/* General Menu (For All Users) */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            General
          </Text>

          <MenuItem
            icon={<Heart size={22} color="#6B7280" />}
            title="Saved Properties"
            subtitle="Your favorite listings"
            onPress={() => console.log('Saved Properties')}
          />

          <MenuItem
            icon={<Settings size={22} color="#6B7280" />}
            title="Settings"
            subtitle="Preferences and privacy"
            onPress={() => console.log('Settings')}
          />

          <MenuItem
            icon={<HelpCircle size={22} color="#6B7280" />}
            title="Help Center"
            subtitle="FAQs and support"
            onPress={() => console.log('Help Center')}
          />

          <TouchableOpacity
            onPress={() => console.log('Log Out')}
            activeOpacity={0.7}
            className="bg-white rounded-xl p-4 flex-row items-center shadow-sm border border-red-200"
          >
            <View className="bg-red-50 rounded-full p-3 mr-4">
              <LogOut size={22} color="#EF4444" />
            </View>
            <Text className="text-base font-semibold text-red-600">
              Log Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Padding */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}