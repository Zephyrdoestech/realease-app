import { Tabs } from 'expo-router';
import { Home, Search, FileText, User, LayoutDashboard, MessageSquare } from 'lucide-react-native';
import { useAuth } from '@/ctx/AuthContext';

export default function TabsLayout() {
  const { profile } = useAuth();
  const isSeller = profile?.role === 'seller';

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
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      {/* 1. HOME / INDEX TAB */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          href: isSeller ? null : '/', // Hidden for sellers, shown for clients
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />

      {/* 2. SEARCH TAB */}
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          href: isSeller ? null : '/search', // Hidden for sellers, shown for clients
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />

      {/* 3. SELLER DASHBOARD TAB */}
      <Tabs.Screen
        name="seller-dashboard"
        options={{
          title: 'Dashboard',
          href: isSeller ? '/seller-dashboard' : null, // Shown for sellers, hidden for clients
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
        }}
      />

      {/* 4. TRANSACTIONS / ACTIVITY TAB */}
      <Tabs.Screen
        name="transactions"
        options={{
          // Sellers see 'Transactions', Clients see 'Activity'
          title: isSeller ? 'Transactions' : 'Activity', 
          tabBarIcon: ({ color, size }) => <FileText size={size} color={color} />,
        }}
      />

      {/* 5. CHAT TAB */}
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
        }}
      />

      {/* 6. PROFILE TAB */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}