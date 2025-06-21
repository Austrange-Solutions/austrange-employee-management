'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSigninRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the unified signin page
    router.replace('/signin');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to sign in...</p>
      </div>
    </div>
  );
}