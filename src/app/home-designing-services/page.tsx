import type { Metadata } from 'next';
import { Suspense } from 'react';
import HomeDesigningClient from '@/components/HomeDesigningClient';

export const metadata: Metadata = {
  title: 'HOME DESIGNING SERVICES | HousePlanFiles',
  description: 'Find verified contractors for home designing services across India.',
};

export default function Page() {
  return (
    <main>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" /></div>}>
        <HomeDesigningClient />
      </Suspense>
    </main>
  );
}
