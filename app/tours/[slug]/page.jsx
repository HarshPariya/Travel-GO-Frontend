import Image from "next/image";
import { notFound } from "next/navigation";
import { getServerApiUrl } from "../../../lib/config";
import { FALLBACK_TOURS } from "../../../lib/fallbackTours";
import BookingForm from "../../../components/BookingForm";
import dynamic from "next/dynamic";

// Dynamically import Map (Leaflet doesn't support SSR)
const Map = dynamic(() => import("../../../components/Map"), { ssr: false });

async function fetchTour(slug) {
  try {
    const res = await fetch(getServerApiUrl(`/tours/${slug}`), {
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || typeof data !== "object") return null;
    return data;
  } catch {
    return null;
  }
}

export default async function TourDetailPage({ params }) {
  let tour = await fetchTour(params.slug);
  if (!tour) {
    tour = FALLBACK_TOURS.find((t) => t.slug === params.slug);
    if (!tour) return notFound();
  }

  return (
    <div className="container-responsive py-12 grid gap-10 lg:grid-cols-3">
      {/* Left Content */}
      <div className="lg:col-span-2 space-y-10">
        {/* Hero Image */}
        <div className="relative h-72 sm:h-[28rem] rounded-3xl overflow-hidden shadow-xl">
          <Image
            src={tour.imageUrl || "/images/tour-fallback.jpg"}
            alt={tour.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute left-6 bottom-6 right-6 flex items-end justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-md">
                {tour.title}
              </h1>
              <p className="text-white/90 mt-1 text-sm sm:text-lg">
                📍 {tour.location?.name || tour.location} • ⏱{" "}
                {tour.durationDays} days
              </p>
            </div>
            <div className="bg-gradient-to-r from-brand-500 to-brand-600 text-white px-3 py-1 rounded-full text-sm shadow-md">
              Top Pick
            </div>
          </div>
        </div>

        {/* Overview */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-slate-900">Overview</h2>
          <p className="text-slate-400">
            All the essentials you need to know before you book this adventure.
          </p>
          <p className="text-slate-400 leading-relaxed text-lg">
            {tour.description || "No description available for this tour."}
          </p>
        </div>

        {/* ✅ Virtual Tour Preview */}
        {tour.virtualTourUrl && (
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900">
              Virtual Tour Preview 🎥
            </h2>
            <p className="text-slate-500">
              Explore the destination with a 360° preview or intro video before
              you book.
            </p>
            <div className="relative w-full h-80 sm:h-[28rem] rounded-xl overflow-hidden shadow-lg border border-slate-200">
              {tour.virtualTourUrl.endsWith(".mp4") ? (
                <video
                  src={tour.virtualTourUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <iframe
                  src={tour.virtualTourUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title="Virtual Tour"
                />
              )}
            </div>
          </div>
        )}

         {/* Interactive Map */}
         <div className="space-y-3">
           <h2 className="text-2xl font-semibold text-slate-900">Location</h2>
           <Map location={tour.location} attractions={tour.attractions || []} />
         </div>
      </div>

      {/* Right Sidebar */}
      <aside className="lg:col-span-1">
        <div className="sticky top-24 bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl shadow-lg border border-slate-200">
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-brand-600">
              ₹{tour.price.toLocaleString('en-IN')}
            </div>
            <div className="text-sm text-slate-700">per person</div>
          </div>
          <div className="my-4 h-px bg-slate-200" />
          <a
            href={`/book/${tour.slug}`}
            className="inline-flex w-full justify-center rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-brand-700 transition"
          >
            Book & pick a slot
          </a>
        </div>
      </aside>
    </div>
  );
}
