
'use client';

import Button from '@/components/common/Button';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-teal-50">
      <div className="text-center space-y-5">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <h2 className="text-3xl font-semibold text-gray-600">Page Not Found</h2>
        <p className="text-gray-500">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Button
          onClick={() => router.push('/dashboard')}
          className="mt-4 bg-blue-600 hover:bg-blue-700"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}