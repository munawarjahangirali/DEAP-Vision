'use client';
import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/axios';
import { CommonContextType as ImportedCommonContextType } from '@/types/common';

export interface Site {
  id: string;
  name: string;
  boardID?: string;
  liveView?: string;
  violationCount?: number;
  latitude?: number;
  longitude?: number;
}

interface LocalCommonContextType {
  sites: Site[];
  categories: any[];
  types: any[];
  zones: any[];
  isLoading: boolean;
  error: any;
}

const CommonContext = createContext<LocalCommonContextType | undefined>(undefined);

const fetchCategories = async () => {
  const { data } = await axiosInstance.get('/categories', {
    params: { limit: 500 }
  });
  return data.data;
};

const fetchTypes = async () => {
  const { data } = await axiosInstance.get('/types', {
    params: { limit: 500 }
  });
  return data.data;
};

const fetchZones = async () => {
  const { data } = await axiosInstance.get('/zones', {
    params: { limit: 500 }
  });
  return data.data;
};

const fetchSites = async () => {
  const { data } = await axiosInstance.get('/sites', {
    params: { limit: 500 }
  });
  return data.data;
};

export const CommonProvider = ({ children }: { children: ReactNode }) => {
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const { data: types, isLoading: typesLoading } = useQuery({
    queryKey: ['types'],
    queryFn: fetchTypes
  });

  const { data: zones, isLoading: zonesLoading } = useQuery({
    queryKey: ['zones'],
    queryFn: fetchZones
  });

  const { data: sites, isLoading: sitesLoading, error } = useQuery({
    queryKey: ['sites'],
    queryFn: fetchSites
  });

  const value = {
    categories: categories || [],
    types: types || [],
    sites: sites || [],
    zones: zones || [],
    isLoading: categoriesLoading || typesLoading || zonesLoading || sitesLoading,
    error
  };

  return (
    <CommonContext.Provider value={value}>
      {children}
    </CommonContext.Provider>
  );
};

export const useCommon = () => {
  const context = useContext(CommonContext);
  if (!context) {
    throw new Error('useCommon must be used within a CommonProvider');
  }
  return context;
};