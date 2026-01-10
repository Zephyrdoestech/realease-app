import { Tabs } from 'expo-router';
import { Home, Search, User, FileText, LayoutDashboard } from 'lucide-react-native';
import React from 'react';
import { useAuth } from '@/ctx/AuthContext';

export default function TabLayout() {
  const { role } = useAuth();
  const isSeller = role === 'seller';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0F766E',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: { paddingBottom: 5, height: 60 },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' }
      }}
    >
      {/* 1. SELLER DASHBOARD (Hide if Client) */}
      <Tabs.Screen
        name="seller-dashboard"
        options={{
          title: 'Dashboard',
          href: isSeller ? '/seller-dashboard' : null, // <--- MAGIC TRICK
          tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
        }}
      />

      {/* 2. HOME (Hide if Seller) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          href: !isSeller ? '/(tabs)' : null, // Hide for sellers
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />

      {/* 3. SEARCH (Hide if Seller) */}
      <Tabs.Screen
        name="search"
        options={{
          title: 'Explore',
          href: !isSeller ? '/search' : null,
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      
      {/* 4. ACTIVITY (Show for Everyone) */}
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color }) => <FileText size={24} color={color} />,
        }}
      />

      {/* 5. PROFILE (Show for Everyone) */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}