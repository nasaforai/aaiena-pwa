import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  gender: string | null;
  height: number | null; // Now supports decimals
  weight: number | null; // Now supports decimals
  chest: number | null; // Now supports decimals
  waist: number | null; // Now supports decimals
  pants_size: number | null; // Now supports decimals
  shirt_size: string | null;
  body_type: string | null;
  style_preferences: string[] | null;
  photos: string[] | null;
  chest_inches: number | null;
  waist_inches: number | null;
  shoulder_inches: number | null;
  hip_inches: number | null;
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
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      
      setProfile(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    console.log('[useProfile] updateProfile called:', {
      hasUser: !!user,
      userId: user?.id,
      hasProfile: !!profile,
      profileId: profile?.id,
      updates
    });

    if (!user || !profile) {
      const errorMsg = 'No user or profile found';
      console.error('[useProfile] updateProfile failed:', errorMsg);
      return { error: errorMsg };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      console.log('[useProfile] Supabase update response:', {
        hasData: !!data,
        hasError: !!error,
        error: error,
        errorDetails: error ? {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        } : null
      });

      if (error) throw error;
      
      setProfile(data);
      console.log('[useProfile] Profile updated successfully');
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      console.error('[useProfile] updateProfile exception:', {
        error: err,
        message: errorMessage,
        isSupabaseError: err && typeof err === 'object' && 'code' in err
      });
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  const createProfile = async (profileData: Partial<Profile>) => {
    console.log('[useProfile] createProfile called:', {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      profileData
    });

    if (!user) {
      const errorMsg = 'No user found';
      console.error('[useProfile] createProfile failed:', errorMsg);
      return { error: errorMsg };
    }

    try {
      const insertData = {
        user_id: user.id,
        full_name: profileData.full_name || user.email || 'User',
        ...profileData
      };
      
      console.log('[useProfile] Inserting profile data:', insertData);

      const { data, error } = await supabase
        .from('profiles')
        .insert(insertData)
        .select()
        .single();

      console.log('[useProfile] Supabase insert response:', {
        hasData: !!data,
        hasError: !!error,
        error: error,
        errorDetails: error ? {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        } : null
      });

      if (error) throw error;
      
      setProfile(data);
      console.log('[useProfile] Profile created successfully');
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create profile';
      console.error('[useProfile] createProfile exception:', {
        error: err,
        message: errorMessage,
        isSupabaseError: err && typeof err === 'object' && 'code' in err
      });
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    createProfile,
    refetch: fetchProfile
  };
}