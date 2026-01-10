import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Alert } from 'react-native';

// Define the shape of the data based on your query
export interface RealProperty {
  id: string;
  title: string;
  price: number;
  location_text: string;
  images: string[]; // Supabase stores this as an array of strings
  latitude: number;
  longitude: number;
  is_title_verified: boolean; // Note: In DB it's is_title_verified, in frontend we called it isVerified
  agent: {
    full_name: string;
    trust_score: number;
    avatar_url: string | null;
  };
}

export function useProperties() {
  const [properties, setProperties] = useState<RealProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActiveProperties() {
      try {
        setLoading(true);
        // THIS IS YOUR SNIPPET HERE 👇
        const { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            agent:profiles(full_name, avatar_url, trust_score)
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          setProperties(data as any); // Cast to any to avoid strict type headaches for now
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        Alert.alert("Error", "Could not load properties");
      } finally {
        setLoading(false);
      }
    }

    fetchActiveProperties();
  }, []);

  return { properties, loading };
}