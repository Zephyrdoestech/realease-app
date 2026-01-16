import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// 1. Define the Profile Shape
type Profile = {
  id: string;
  full_name: string | null;
  role: 'client' | 'seller';
  is_verified: boolean;
  trust_score: number;
  avatar_url: string | null;
};

type AuthContextType = {
  session: Session | null;
  isLoading: boolean;
  role: 'client' | 'seller' | null;
  profile: Profile | null; // <--- 2. Add this line!
  setRole: (role: 'client' | 'seller') => void;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
  role: null,
  profile: null, // <--- 3. Add default value
  setRole: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<'client' | 'seller' | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null); // <--- 4. Add state

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
        setRole(null);
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    try {
      // 5. Fetch the full profile, not just role
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (data) {
        setRole(data.role as any);
        setProfile(data as any); // <--- 6. Save it!
      }
    } catch (e) {
      console.log('Error fetching profile', e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ session, isLoading, role, profile, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}