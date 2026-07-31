import type { Metadata } from 'next';
import { Suspense } from 'react';
import OtherServicesClient from '@/components/OtherServicesClient';

export const metadata: Metadata = {
  title: 'OTHER SERVICES | HousePlanFiles',
  description: 'Find verified contractors for other services across India.',
};

export default function Page() {
  return (
    <main>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" /></div>}>
        <OtherServicesClient />
      </Suspense>
    </main>
  );
}
