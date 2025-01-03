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
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) return;

      const isAuth = !!sessionData.session;
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

  useEffect(() => {
    initializeApp();
  }, []);

  const updateProfile = async (data: Partial<Profile>) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', userProfile?.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      setUserProfile(profile);
      
      // Recheck onboarding status after update
      await checkOnboardingStatus();
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setIsAuthenticated(true);
    await checkOnboardingStatus();
  };

  const value = {
    isLoading,
    isAuthenticated,
    hasCompletedOnboarding,
    userProfile,
    checkOnboardingStatus,
    updateProfile,
    signIn,
  };

  return (
    <AuthContext.Provider value={value}>
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