"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0c1912] flex items-center justify-center text-slate-200">
      <p className="text-sm font-semibold tracking-wide">Redirecting to Kindleaf Homepage...</p>
    </div>
  );
}
