import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  gender: string | null;
  height: number | null;
  weight: number | null;
  chest: number | null;
  waist: number | null;
  pants_size: number | null;
  shirt_size: string | null;
  style_preferences: string[] | null;
  photos: string[] | null;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user) {
      console.log('useProfile: No user found, skipping fetch');
      setLoading(false);
      return;
    }

    console.log('useProfile: Fetching profile for user:', user.id);
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        console.log('useProfile: Profile found:', data);
        setProfile(data);
        setError(null);
      } else {
        console.log('useProfile: No profile found, creating new profile');
        // Auto-create profile if none exists
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            full_name: user.email || 'User',
          })
          .select()
          .single();

        if (createError) {
          console.error('useProfile: Error creating profile:', createError);
          throw createError;
        }
        
        console.log('useProfile: Profile created:', newProfile);
        setProfile(newProfile);
        setError(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
      console.error('useProfile: Error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return { error: 'No user or profile found' };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setProfile(data);
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  const createProfile = async (profileData: Partial<Profile>) => {
    if (!user) return { error: 'No user found' };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          full_name: profileData.full_name || user.email || 'User',
          ...profileData
        })
        .select()
        .single();

      if (error) throw error;
      
      setProfile(data);
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create profile';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  useEffect(() => {
    console.log('useProfile: useEffect triggered, user:', user?.id, 'isAuthenticated:', isAuthenticated);
    if (user && isAuthenticated) {
      fetchProfile();
    } else {
      console.log('useProfile: Clearing profile state');
      setProfile(null);
      setLoading(false);
      setError(null);
    }
  }, [user?.id, isAuthenticated]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    createProfile,
    refetch: fetchProfile
  };
}