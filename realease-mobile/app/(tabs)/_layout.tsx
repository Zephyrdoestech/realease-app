// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Home, Search, FileText, User, LayoutDashboard } from 'lucide-react-native';
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
      {/* SELLER TABS */}
      {isSeller ? (
        <>
          <Tabs.Screen
            name="seller-dashboard"
            options={{
              title: 'Dashboard',
              tabBarIcon: ({ color, size }) => (
                <LayoutDashboard size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
            }}
          />
          
          {/* Hide these tabs for sellers */}
          <Tabs.Screen
            name="index"
            options={{
              href: null, // This hides the tab
            }}
          />
          <Tabs.Screen
            name="search"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="transactions"
            options={{
              href: null,
            }}
          />
        </>
      ) : (
        /* CLIENT TABS */
        <>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="search"
            options={{
              title: 'Search',
              tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="transactions"
            options={{
              title: 'Activity',
              tabBarIcon: ({ color, size }) => (
                <FileText size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
            }}
          />
          
          {/* Hide seller dashboard for clients */}
          <Tabs.Screen
            name="seller-dashboard"
            options={{
              href: null,
            }}
          />
        </>
      )}
    </Tabs>
  );
}