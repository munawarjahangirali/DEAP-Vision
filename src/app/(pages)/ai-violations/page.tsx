'use client';
import DashboardTable from '@/components/live-incident/DashboardTable';
import React from 'react';

const DashboardPage = () => {
    return (
        <>
            <div className=' mx-auto'>
                <DashboardTable />
            </div>
        </>
    );
};

export default DashboardPage;