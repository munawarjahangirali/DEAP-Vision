'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axiosInstance from '@/services/axios';

interface ProfileData {
  email: string;
  username?: string;
  contact?: string;
  address?: string;
  role?: string;
  id?: number | string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  profileData?: ProfileData;
  setProfileData?: React.Dispatch<React.SetStateAction<ProfileData | undefined>>;
  setIsAuthenticated?: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextProps>({ isAuthenticated: false });

export const fetchProfileData = async (): Promise<ProfileData> => {
  try {
    const response = await axiosInstance.get('/profile');
    const userData = response.data;
    return {
      email: userData.email,
      username: userData.username,
      contact: userData.contact || 'N/A',
      address: userData.address || 'N/A',
      role: userData.role,
      id: userData.id,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch profile data');
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to access this page');
      router.push('/login');
    } else {
      fetchProfileData()
        .then(data => {
          setProfileData(data);
          setIsAuthenticated(true);
        })
        .catch(error => {
          toast.error('Token Expired! Please login again');
          console.error('Error fetching profile data:', error);
          localStorage.clear();
          router.push('/login');
        });
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, profileData ,setProfileData,setIsAuthenticated}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
