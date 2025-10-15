import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Profile {
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
  neck_inches: number | null;
  inseam_inches: number | null;
  body_length_inches: number | null;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: loading, error, refetch } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as Profile | null;
    },
    enabled: !!user,
  });

  const { mutateAsync: updateProfileMutation } = useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data as Profile;
    },
    onSuccess: (data) => {
      // When mutation is successful, invalidate the profile query to refetch data
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });

  const { mutateAsync: createProfileMutation } = useMutation({
    mutationFn: async (profileData: Partial<Profile>) => {
      if (!user) throw new Error('No user found');

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
      return data as Profile;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const data = await updateProfileMutation(updates);
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      return { data: null, error: errorMessage };
    }
  };

  const createProfile = async (profileData: Partial<Profile>) => {
    try {
      const data = await createProfileMutation(profileData);
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create profile';
      return { data: null, error: errorMessage };
    }
  };

  return {
    profile,
    loading,
    error: error ? (error as Error).message : null,
    updateProfile,
    createProfile,
    refetch,
  };
}