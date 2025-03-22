'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/common/Sidebar';
import Header from '@/components/common/Header';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-teal-50">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content */}
            <main className="lg:ml-60">
                <br />
                <Header onSidebarOpen={() => setIsSidebarOpen(true)} />
                <div className="p-5">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
