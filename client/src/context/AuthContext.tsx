'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LearnerProfile } from '@/types';
import { api } from '@/lib/api';
import { mockUser, mockLearnerProfile } from '@/lib/mock-data';

import { useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  user: User | null;
  profile: LearnerProfile | null;
  loading: boolean;
  updateUserAndProfile: (
    userData: { name?: string; avatar?: string },
    profileData: Partial<LearnerProfile>
  ) => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  updateUserAndProfile: async () => {},
  refreshAuth: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserAndProfile = async () => {
    try {
      setLoading(true);
      const currentUser = await api.getCurrentUser();
      const currentProfile = await api.getProfile();
      setUser(currentUser);
      setProfile(currentProfile);
    } catch (error) {
      console.warn('[AuthProvider] Failed to load user session, using fallback:', error);
      setUser(mockUser);
      setProfile(mockLearnerProfile);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndProfile();
  }, []);

  const updateUserAndProfile = async (
    userData: { name?: string; avatar?: string },
    profileData: Partial<LearnerProfile>
  ) => {
    try {
      let updatedUser = user;
      let updatedProfile = profile;

      if (userData && (userData.name !== undefined || userData.avatar !== undefined)) {
        updatedUser = await api.updateUser(userData);
        setUser(updatedUser);
      }

      if (profileData && Object.keys(profileData).length > 0) {
        updatedProfile = await api.saveProfile(profileData);
        setProfile(updatedProfile);
      }

      // Sync across all app sections by invalidating React Query caches
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    } catch (error) {
      console.error('[AuthProvider] Failed to update user profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        updateUserAndProfile,
        refreshAuth: fetchUserAndProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
