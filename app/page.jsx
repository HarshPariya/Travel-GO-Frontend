import Link from 'next/link';
import { Suspense } from 'react';
import ToursGrid from '../components/ToursGrid';
import Hero from '../components/Hero';
import FeatureIcons from '../components/FeatureIcons';
import CTA from '../components/CTA';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div>
      <Hero />
      {/* <FeatureIcons /> */}

      <section className="container-responsive py-12 sm:py-16">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-semibold">Featured Tours</h1>
          <Link href="/tours" className="text-white-600 hover:underline">View all</Link>
        </div>
        <Suspense
          fallback={
            <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="animate-pulse rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg">
                  <div className="h-56 w-full bg-slate-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 w-3/4 bg-slate-200 rounded"></div>
                    <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <ToursGrid featured />
        </Suspense>
      </section>

      <CTA />
    </div>
  );
}


