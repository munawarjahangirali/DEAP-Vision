'use client';
import Button from '@/components/common/Button';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Loader } from '../common/Loader';
import { useAuth } from '@/context/AuthContext';

export const ProfileForm = () => {
  const { push } = useRouter();
  const { isAuthenticated, profileData } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <Loader />
      </div>
    );
  }

  const profileItems = [
    { label: 'Email', value: profileData?.email },
    { label: 'Username', value: profileData?.username },
    { label: 'Role', value: profileData?.role },
    { label: 'Contact', value: profileData?.contact },
    { label: 'Address', value: profileData?.address },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
      {profileItems.map((item, index) => (
        <div 
          key={index}
          className="flex flex-col sm:flex-row sm:items-center gap-2 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
        >
          <div className="w-full sm:w-1/3">
            <span className="text-base font-medium text-primary">{item.label}</span>
          </div>
          <div className="w-full sm:w-2/3">
            <span className="text-sm text-secondary">{item.value}</span>
          </div>
        </div>
      ))}

      <div className="pt-6">
        <Button 
          variant="primary"
          onClick={() => push('/change-password')}
        >
          Change Password
        </Button>
      </div>
    </div>
  );
};