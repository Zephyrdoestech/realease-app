import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Search, FileText, User, LayoutDashboard } from 'lucide-react-native';
import { useAuth } from '@/ctx/AuthContext';

export default function TabsLayout() {
  const { role } = useAuth();
  const isSeller = role === 'seller';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0F766E', // Teal-700
        tabBarInactiveTintColor: '#9CA3AF', // Gray-400
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      {/* 1. HOME (Visible to Everyone) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          href: '/(tabs)',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />

      {/* 2. EXPLORE (Visible to Everyone) */}
      <Tabs.Screen
        name="search"
        options={{
          title: 'Explore',
          href: '/(tabs)/search',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />

      {/* 3. ACTIVITY (Visible to Everyone) */}
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Activity',
          href: '/(tabs)/transactions',
          tabBarIcon: ({ color, size }) => <FileText size={size} color={color} />,
        }}
      />

      {/* 4. DASHBOARD (Hidden for Clients, Visible for Sellers) */}
      <Tabs.Screen
        name="seller-dashboard"
        options={{
          title: 'Dashboard',
          // Only show this tab if the user is a Seller
          href: isSeller ? '/(tabs)/seller-dashboard' : null,
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
        }}
      />

      {/* 5. PROFILE (Visible to Everyone) */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          href: '/(tabs)/profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}