'use client';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/axios';
import SettingForm from '@/components/forms/SettingForm';
import { Loader } from '@/components/common/Loader';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';


const EditSettingPage = ({ params }: any) => {
    const { data, isLoading } = useQuery({
        queryKey: ['setting', params.id],
        queryFn: async () => {
            const response = await axiosInstance.get(`/settings/${params.id}`);
            return response.data;
        },
        staleTime: 0, // Consider the data stale immediately
        refetchOnWindowFocus: true, // Refetch when window regains focus
    });

    if (isLoading) {
        return (
            <div className="container mx-auto py-6 h-screen my-auto">
                <Loader />
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full">
                <h1 className="text-2xl font-bold mb-6">Edit Setting</h1>
                <SettingForm initialData={data?.data} isEdit />
            </div>
        </div>
    );
};

export default EditSettingPage;
