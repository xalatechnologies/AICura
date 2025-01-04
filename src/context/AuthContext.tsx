import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile } from '@/types/database';

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  userProfile: Profile | null;
  checkOnboardingStatus: () => Promise<boolean>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);

  const checkOnboardingStatus = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .single();

      if (error) return false;
      if (!profile) return false;

      const isComplete = !!(
        profile.name &&
        profile.age &&
        profile.gender &&
        profile.preferred_language &&
        profile.lifestyle_factors
      );

      setHasCompletedOnboarding(isComplete);
      setUserProfile(profile);
      return isComplete;
    } catch (error) {
      console.error('Error in checkOnboardingStatus:', error);
      return false;
    }
  };

  const initializeApp = async () => {
    try {
      const session = await supabase.auth.getSession();
      const isAuth = !!session?.data?.session;
      setIsAuthenticated(isAuth);

      if (isAuth) {
        await checkOnboardingStatus();
      }
    } catch (error) {
      console.error('Error in initializeApp:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', userProfile?.id)
        .select()
        .single();

      if (error) throw error;
      setUserProfile(profile);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      setIsAuthenticated(true);
      await checkOnboardingStatus();
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setIsAuthenticated(false);
      setUserProfile(null);
      setHasCompletedOnboarding(false);
      await AsyncStorage.removeItem('theme');
      await AsyncStorage.removeItem('selectedLanguage');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  useEffect(() => {
    initializeApp();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsAuthenticated(!!session);
        if (session) {
          await checkOnboardingStatus();
        } else {
          setUserProfile(null);
          setHasCompletedOnboarding(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        hasCompletedOnboarding,
        userProfile,
        checkOnboardingStatus,
        updateProfile,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};