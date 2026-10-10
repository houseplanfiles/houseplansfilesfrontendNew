import type { Metadata } from 'next';
import { Suspense } from 'react';
import ServiceDetailClient from '@/components/ServiceDetailClient';

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const serviceName = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return {
    title: `${serviceName} | HousePlanFiles`,
    description: `Find verified ${serviceName} professionals across India.`,
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const serviceName = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  return (
    <main>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" /></div>}>
        <ServiceDetailClient serviceName={serviceName} categoryType="Other" />
      </Suspense>
    </main>
  );
}
