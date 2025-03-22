'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/forms/LoginForm';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    if (isAuthenticated) {
        return null; 
    }

    return (
        <div className="content-wrapper bg-teal-50 h-screen">
            <div className="  flex flex-col items-center justify-center h-screen  mx-4">
                <div className=" mb-4 lg:mb-12">
                    <Image 
                        src="/logo2.png" 
                        alt="Logo"
                        width={200} // Set a fixed width
                        height={100} // Set a fixed height
                        priority
                        className="object-contain"
                    />
                </div>
                <div className="bg-white p-4  lg:p-8 rounded-2xl shadow-lg w-full max-w-md ">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-3">Login</h2>
                    <p className="text-md text-gray-500 mb-3">Enter your email and password to sign in</p>
                    <LoginForm />
                </div>
            </div>
        </div>
    );
};

export default Login;