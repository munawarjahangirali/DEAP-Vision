'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../common/Input';
import Button from '../common/Button';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axiosInstance from '@/services/axios';
import { useAuth } from '@/context/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginResponse {
    status: number;
    token: string;
    user: {
        id: string;
        username: string;
        email: string;
        role: string;
    }
}

const LoginForm = () => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    });
    const router = useRouter();
    const {setProfileData,setIsAuthenticated} = useAuth();

    const mutation = useMutation<LoginResponse, Error, LoginFormData>({
        mutationFn: async (data) => {
            const response = await axiosInstance.post('/auth/login', data);
            
            const result  = await response?.data
            if ( result.status === 401 || result.status === 404) {
                throw new Error(result.message || 'Invalid email or password');
            }

            if (result.status !== 200){
                throw new Error(result.message || 'Error logging in');
            }

            return result;
        },
        onSuccess: (data) => {
            toast.success('Logged in successfully');
            localStorage.setItem('token', data.token);
            if (setProfileData) {
                setProfileData(data.user);
            }
            if (setIsAuthenticated) {
                setIsAuthenticated(true);
            }
            router.push('/dashboard'); 
            setLoading(false);
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Error logging in');
            console.error('Error logging in:', error);
            setLoading(false);
        }
    });

    const onSubmit = (data: LoginFormData) => {
        setLoading(true);
        mutation.mutate(data);
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                error={errors.email?.message}
            />
            <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                isPassword
                {...register('password')}
                error={errors.password?.message}
            />
            <Button
                type="submit"
                variant="primary"
                fullWidth
                size="md"
                isLoading={loading}
            >
                Login
            </Button>
        </form>
    );
};

export default LoginForm;