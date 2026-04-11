import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  role: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateBalance: (newBalance: number) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setToken(session.access_token);
        await fetchProfile(session.user.id, session.user.email || '', session.user.user_metadata?.username);
      } else {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setToken(session.access_token);
        setIsLoading(true);
        // Use setTimeout to escape the Supabase auth lock context and prevent deadlocks
        setTimeout(() => {
          fetchProfile(session.user.id, session.user.email || '', session.user.user_metadata?.username);
        }, 0);
      } else {
        setToken(null);
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string, email: string, metaUsername?: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile not found, attempt to create it (fallback for broken states)
          const username = metaUsername || email.split('@')[0] + Math.floor(Math.random() * 10000);
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([{ id: userId, username, balance: 0, role: 'user' }])
            .select()
            .single();
            
          if (!insertError && newProfile) {
            setUser({
              id: newProfile.id,
              username: newProfile.username,
              email: email,
              balance: newProfile.balance || 0,
              role: newProfile.role || 'user',
              created_at: newProfile.created_at
            });
            return;
          } else if (insertError && insertError.code === '23505') {
            // If insert failed due to unique constraint, it means Register.tsx already inserted it.
            const { data: existingProfile } = await supabase.from('profiles').select('*').eq('id', userId).single();
            if (existingProfile) {
              setUser({
                id: existingProfile.id,
                username: existingProfile.username,
                email: email,
                balance: existingProfile.balance || 0,
                role: existingProfile.role || 'user',
                created_at: existingProfile.created_at
              });
              return;
            }
          }
        }
        console.error('Error fetching profile:', error);
      } else if (data) {
        setUser({
          id: data.id,
          username: data.username,
          email: email,
          balance: data.balance || 0,
          role: data.role || 'user',
          created_at: data.created_at
        });
      }
    } catch (err) {
      console.error('Error in fetchProfile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setToken(null);
    setUser(null);
  };

  const updateBalance = (newBalance: number) => {
    if (user) {
      setUser({ ...user, balance: newBalance });
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateBalance, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
