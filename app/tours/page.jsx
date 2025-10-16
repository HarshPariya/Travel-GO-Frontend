import { Suspense } from "react";
import ToursGrid from "../../components/ToursGrid";

export const metadata = { title: "Tours – Travel Agency" };
export const dynamic = 'force-dynamic';

export default function ToursPage() {
  return (
    <div className="container-responsive py-10">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Explore Our Tours</h1>
        <p className="mt-2 text-slate-400 max-w-2xl">
          Handpicked experiences around the world. Flexible dates, small groups, and expert local guides.
        </p>
      </div>

      <Suspense fallback={<div className="mt-6">Loading tours...</div>}>
        <ToursGrid />
      </Suspense>
    </div>
  );
}


