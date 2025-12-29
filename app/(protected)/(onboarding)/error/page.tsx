'use client';

import { useRouter } from 'next/navigation';

export default function ErrorPage() {
  const router = useRouter();

  const handleRetry = () => {
    router.push('/dashboard');
    router.refresh(); // Force re-fetch of server-side data
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl font-bold mb-4 text-red-600">Something Went Wrong ❌</h1>
      <p className="text-lg mb-4">We couldn&apos;t load your data. Please try again or contact support.</p>
      <button
        onClick={handleRetry}
        className="mb-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Retry
      </button>
      <a href="/auth/logout" className="text-blue-600 hover:underline">Logout</a>
    </div>
  );
}