'use client'
import SettingForm from '@/components/forms/SettingForm';
import React from 'react';

const CreateSetting = () => {
    return (
        <div className="container mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full">
                <SettingForm />
            </div>
        </div>
    );
};

export default CreateSetting;