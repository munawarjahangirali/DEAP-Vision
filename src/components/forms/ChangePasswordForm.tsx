'use client'
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/services/axios';

const schema = z.object({
  oldPassword: z.string().min(6, 'Old password must be at least 6 characters'), // Re-add old password field
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const ChangePasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<{ oldPassword: string; newPassword: string; confirmPassword: string }>({
    resolver: zodResolver(schema),
  });
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
      const response = await axiosInstance.post('/auth/change-password', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
      localStorage.clear();
      router.push('/login');
      setLoading(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error changing password');
      setLoading(false);
    }
  });

  const onSubmit = (data: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
    setLoading(true);
    mutation.mutate({ oldPassword: data.oldPassword, newPassword: data.newPassword });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Old Password"
        id="oldPassword"
        type="password"
        isPassword={true}
        placeholder="Enter old password"
        error={errors.oldPassword?.message?.toString()}
        {...register('oldPassword')}
      />
      <Input
        label="New Password"
        id="newPassword"
        type="password"
        isPassword={true}
        placeholder="Enter new password"
        error={errors.newPassword?.message?.toString()}
        {...register('newPassword')}
      />
      <Input
        label="Confirm New Password"
        id="confirmPassword"
        type="password"
        isPassword={true}
        placeholder="Confirm new password"
        error={errors.confirmPassword?.message?.toString()}
        {...register('confirmPassword')}
      />
      <Button isLoading={loading} variant='primary' type="submit" className="">Change Password</Button>
    </form>
  );
};

export default ChangePasswordForm;
