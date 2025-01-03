import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@lib/supabase';

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  updateProfile: (updates: { language?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  updateProfile: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>({
    access_token: 'fake_token',
    token_type: 'bearer',
    expires_in: 3600,
    refresh_token: 'fake_refresh',
    user: {
      id: 'fake_user_id',
      email: 'test@example.com',
      role: 'authenticated',
      aud: 'authenticated',
      app_metadata: {},
      user_metadata: {},
      created_at: new Date().toISOString()
    }
  });
  
  const [user, setUser] = useState<User | null>(session?.user ?? null);
  const [loading, setLoading] = useState(false);

  const updateProfile = async (updates: { language?: string }) => {
    console.log('Updating profile with:', updates);
    // Fake successful update
    return Promise.resolve();
  };

  useEffect(() => {
    console.log('AuthProvider: Initializing');
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthProvider: Got session', session ? 'exists' : 'null');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('AuthProvider: Auth state changed', _event);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    session,
    user,
    loading,
    updateProfile
  };

  console.log('AuthProvider: Rendering with value', { 
    hasSession: !!session,
    hasUser: !!user,
    loading 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  console.log('useAuth: Called');
  const context = useContext(AuthContext);
  console.log('useAuth: Context value', { 
    hasContext: !!context,
    hasSession: !!context?.session,
    hasUser: !!context?.user,
    loading: context?.loading 
  });
  
  if (!context) {
    console.error('useAuth: Context is null or undefined');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 