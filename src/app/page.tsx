'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Loader } from '@/components/common/Loader';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      toast.error('Error checking authentication status');
      router.push('/login');
    }
  }, [router]);

  // Optional loading state while redirect happens
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Loader />
    </div>
  );
}
