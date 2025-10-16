import { Suspense } from "react";
import ToursGrid from "../../components/ToursGrid";

export const metadata = {
  title: "Book a tour – Travel Agency",
  description: "Browse and book exciting tours with our travel agency.",
};
export const dynamic = 'force-dynamic';

export default function BookPage() {
  return (
    <section className="container-responsive py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Book Your Next Adventure
          <span className="block text-base font-normal text-slate-400 mt-1">Browse our tours and start your booking in a click.</span>
        </h1>
      </div>

      <Suspense fallback={<div className="mt-6">Loading tours...</div>}>
        <ToursGrid action="book" />
      </Suspense>
    </section>
  );
}


