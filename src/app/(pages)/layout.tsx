'use client';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { CommonProvider } from '@/context/CommonContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <CommonProvider>
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </CommonProvider>
  );
}
