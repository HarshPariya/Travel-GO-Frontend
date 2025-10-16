import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getServerApiUrl } from "../../../lib/config";
import { FALLBACK_TOURS } from "../../../lib/fallbackTours";
import BookingForm from "../../../components/BookingForm";
import ItineraryModal from "../../../components/ItineraryModal";

async function fetchTour(slug) {
  try {
    const res = await fetch(getServerApiUrl(`/tours/${slug}`), { next: { revalidate: 0 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data && typeof data === "object" ? data : null;
  } catch {
    return null;
  }
}

async function fetchAvailability(slugOrId) {
  try {
    const res = await fetch(getServerApiUrl(`/tours/${slugOrId}/availability`), { next: { revalidate: 0 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.slots) ? data.slots : [];
  } catch {
    return [];
  }
}

// Mock testimonials data - in real app, this would come from API
const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "Amazing experience! The tour was perfectly organized and our guide was fantastic. Highly recommend!",
    date: "2 days ago"
  },
  {
    id: 2,
    name: "Raj Kumar",
    location: "Delhi",
    rating: 5,
    text: "Best travel experience ever. Everything was taken care of and the destinations were breathtaking.",
    date: "1 week ago"
  },
  {
    id: 3,
    name: "Anita Patel",
    location: "Bangalore",
    rating: 5,
    text: "Professional service from start to finish. Will definitely book again for our next vacation.",
    date: "2 weeks ago"
  }
];

// Mock itinerary data
const itineraryHighlights = [
  { day: 1, title: "Arrival & City Tour", description: "Welcome to your destination with a guided city tour" },
  { day: 2, title: "Cultural Heritage Sites", description: "Explore ancient temples and historical monuments" },
  { day: 3, title: "Nature & Adventure", description: "Mountain trekking and scenic viewpoints" },
  { day: 4, title: "Local Experiences", description: "Traditional village visit and local cuisine" },
  { day: 5, title: "Departure", description: "Check-out and airport transfer" }
];

// Trust indicators data
const trustIndicators = [
  { icon: "🛡️", title: "Secure Booking", description: "SSL encrypted payments" },
  { icon: "📞", title: "24/7 Support", description: "Round-the-clock assistance" },
  { icon: "✅", title: "Instant Confirmation", description: "Immediate booking confirmation" },
  { icon: "🔄", title: "Free Cancellation", description: "Cancel up to 48 hours before" },
  { icon: "⭐", title: "4.9/5 Rating", description: "Based on 2,500+ reviews" },
  { icon: "🏆", title: "Award Winning", description: "Best Travel Agency 2023" }
];

export default async function BookTourPage({ params }) {
  let tour = await fetchTour(params.slug);
  if (!tour) {
    tour = FALLBACK_TOURS.find((t) => t.slug === params.slug);
    if (!tour) return notFound();
  }

  const slots = await fetchAvailability(tour._id || tour.slug);
  const firstAvailable = slots.find((s) => (s?.remaining || 0) > 0)?.date || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-brand-600 to-brand-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container-responsive relative py-16">
          <div className="mb-6 flex items-center gap-2 text-sm text-white/80">
            <Link href="/tours" className="hover:text-white transition-colors">All tours</Link>
        <span>/</span>
            <Link href={`/tours/${tour.slug}`} className="hover:text-white transition-colors">{tour.title}</Link>
        <span>/</span>
            <span className="text-white">Book</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white animate-fade-in">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Book Your Dream Trip
              </h1>
              <p className="text-xl mb-6 text-white/90">
                Secure your spot for {tour.title} – an unforgettable {tour.durationDays}-day adventure
              </p>
              
              {/* Trust badges */}
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="badge-success">✅ Free date change</span>
                <span className="badge-success">🛡️ Secure booking</span>
                <span className="badge-success">⭐ 4.9/5 rating</span>
                <span className="badge-success">🏆 Award winning</span>
      </div>

              {/* Key stats */}
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{tour.durationDays}</div>
                  <div className="text-sm text-white/80">Days</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">₹{Number(tour.price || 0).toLocaleString('en-IN')}</div>
                  <div className="text-sm text-white/80">Per Person</div>
                </div>
        <div>
                  <div className="text-2xl font-bold text-white">4.9</div>
                  <div className="text-sm text-white/80">Rating</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <Image src={tour.imageUrl} alt={tour.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="text-sm opacity-90">📍 {tour.location}</div>
                  <div className="text-2xl font-bold">{tour.title}</div>
                </div>
              </div>
            </div>
        </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-responsive py-12">
      <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Tour Details & Reviews */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tour Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 card-hover">
              <div className="relative h-48 w-full">
                <Image src={tour.imageUrl} alt={tour.title} fill className="object-cover rounded-t-2xl" />
                <div className="absolute top-4 left-4">
                  <span className="badge-success">🔥 Most Popular</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{tour.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">📍 {tour.location}</span>
                    <span className="flex items-center gap-1">⏱ {tour.durationDays} days</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-brand-600">₹{Number(tour.price || 0).toLocaleString('en-IN')}</span>
                    <span className="text-slate-500">per person</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Taxes included • All meals included</div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <span>⭐</span>
                    <span>4.9/5 Rating</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <span>👥</span>
                    <span>2,500+ Reviews</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <span>🏆</span>
                    <span>Best Seller</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <span>🛡️</span>
                    <span>Secure</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Why Book With Us</h3>
              <div className="grid grid-cols-2 gap-4">
                {trustIndicators.map((indicator, index) => (
                  <div key={index} className="text-center p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="text-2xl mb-2">{indicator.icon}</div>
                    <div className="text-sm font-medium text-slate-900">{indicator.title}</div>
                    <div className="text-xs text-slate-500 mt-1">{indicator.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Reviews</h3>
              <div className="space-y-4">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="border-l-4 border-brand-500 pl-4">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400">⭐</span>
                      ))}
                    </div>
                    <p className="text-sm text-slate-700 mb-2">"{testimonial.text}"</p>
                    <div className="text-xs text-slate-500">
                      <span className="font-medium">{testimonial.name}</span> • {testimonial.location} • {testimonial.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Booking Form & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enhanced Booking Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 animate-slide-up">
              <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-brand-50 to-blue-50">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Complete Your Booking</h2>
                <p className="text-slate-600">Fill in your details and secure your spot for this amazing adventure</p>
              </div>
              <div className="p-6">
                <BookingForm tourId={tour._id || `fallback-${tour.slug}`} tourTitle={tour.title} price={tour.price} initialDate={firstAvailable} />
              </div>
            </div>

            {/* Quick Tour Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>ℹ️</span> Tour Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                      📅
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{tour.durationDays} Days</div>
                      <div className="text-sm text-slate-600">Duration</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                      ⭐
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{tour.rating}/5</div>
                      <div className="text-sm text-slate-600">Rating</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                      🏷️
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{tour.category || 'Adventure'}</div>
                      <div className="text-sm text-slate-600">Category</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                      📍
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">{tour.location}</div>
                      <div className="text-sm text-slate-600">Location</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>💰</span> Price Breakdown
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-700">Base Price per Person</span>
                  <span className="font-semibold text-slate-900">₹{tour.price?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-700">Taxes & Fees</span>
                  <span className="font-semibold text-slate-900">₹{(tour.price * 0.12).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-700">Insurance</span>
                  <span className="font-semibold text-slate-900">₹2,500</span>
                </div>
                <div className="flex justify-between items-center py-3 border-t-2 border-brand-200 bg-brand-50 rounded-lg px-4 mt-4">
                  <span className="font-bold text-slate-900">Total per Person</span>
                  <span className="font-bold text-brand-600 text-lg">₹{(tour.price * 1.12 + 2500).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Instant Booking Benefits */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-lg border border-green-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>⚡</span> Instant Booking Benefits
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                  <span className="text-slate-700">Instant confirmation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                  <span className="text-slate-700">Best price guarantee</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                  <span className="text-slate-700">24/7 customer support</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                  <span className="text-slate-700">Free cancellation up to 48h</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                  <span className="text-slate-700">Mobile voucher accepted</span>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>✅</span> What's Included
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="text-green-500">✓</span>
                    <span>Accommodation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="text-green-500">✓</span>
                    <span>All meals</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="text-green-500">✓</span>
                    <span>Airport transfers</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="text-green-500">✓</span>
                    <span>Professional guide</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="text-green-500">✓</span>
                    <span>Entrance fees</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="text-green-500">✓</span>
                    <span>Travel insurance</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="text-green-500">✓</span>
                    <span>24/7 support</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="text-green-500">✓</span>
                    <span>Mobile app access</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Offers */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-lg border border-purple-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>🎁</span> Special Offers
              </h3>
              <div className="space-y-3">
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-800">Early Bird Discount</div>
                      <div className="text-sm text-slate-600">Book 30+ days in advance</div>
                    </div>
                    <div className="text-lg font-bold text-purple-600">-15%</div>
                  </div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-800">Group Booking</div>
                      <div className="text-sm text-slate-600">5+ people traveling together</div>
                    </div>
                    <div className="text-lg font-bold text-purple-600">-10%</div>
                  </div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-800">Loyalty Rewards</div>
                      <div className="text-sm text-slate-600">Returning customers</div>
                    </div>
                    <div className="text-lg font-bold text-purple-600">-5%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>💡</span> Travel Tips
              </h3>
              <div className="space-y-3">
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
                  <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <span>📦</span> What to Pack
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Comfortable walking shoes</li>
                    <li>• Weather-appropriate clothing</li>
                    <li>• Camera and extra batteries</li>
                    <li>• Travel documents</li>
                  </ul>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
                  <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <span>🌍</span> Local Insights
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Best time to visit: Year-round</li>
                    <li>• Local currency: USD</li>
                    <li>• Language: English</li>
                    <li>• Emergency: 911</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Why Choose TravelGo */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>🏆</span> Why Choose TravelGo?
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-brand-600 mb-1">2,500+</div>
                  <div className="text-sm text-slate-600">Happy Travelers</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-brand-600 mb-1">98%</div>
                  <div className="text-sm text-slate-600">Satisfaction Rate</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-brand-600 mb-1">24/7</div>
                  <div className="text-sm text-slate-600">Support</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-brand-600 mb-1">50+</div>
                  <div className="text-sm text-slate-600">Destinations</div>
                </div>
              </div>
            </div>

            {/* Tour Highlights & Itinerary */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 card-hover">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span>✨</span> What's Included
                </h3>
                <div className="space-y-3">
                  {[
                    "🏨 Premium accommodation",
                    "🍽️ All meals included",
                    "🚗 Airport transfers",
                    "🎯 Guided activities",
                    "🎫 Entrance fees",
                    "📞 24×7 support",
                    "🛡️ Travel insurance",
                    "📱 Mobile app access"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 text-slate-700">
                      <span>{item}</span>
                    </div>
                  ))}
          </div>
        </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 card-hover">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span>🗓️</span> Sample Itinerary
                </h3>
                <div className="space-y-4">
                  {itineraryHighlights.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {item.day}
            </div>
                      <div>
                        <div className="font-medium text-slate-900">{item.title}</div>
                        <div className="text-sm text-slate-600">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <ItineraryModal tourTitle={tour.title} tourData={tour} />
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <details className="group">
                  <summary className="cursor-pointer flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <span className="font-medium text-slate-800">Can I change my dates after booking?</span>
                    <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="mt-2 p-4 text-sm text-slate-600 bg-white rounded-lg border">
                    Yes! We offer free date changes up to 7 days before departure. Changes within 7 days may incur a small fee depending on availability.
                  </div>
                </details>

                <details className="group">
                  <summary className="cursor-pointer flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <span className="font-medium text-slate-800">What payment methods do you accept?</span>
                    <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="mt-2 p-4 text-sm text-slate-600 bg-white rounded-lg border">
                    We accept all major credit cards, UPI, net banking, and digital wallets. All payments are processed securely with SSL encryption.
                  </div>
                </details>

                <details className="group">
                  <summary className="cursor-pointer flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <span className="font-medium text-slate-800">Is travel insurance included?</span>
                    <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="mt-2 p-4 text-sm text-slate-600 bg-white rounded-lg border">
                    Yes! Basic travel insurance is included in all our packages. For comprehensive coverage, we can arrange additional insurance.
                  </div>
                </details>

                <details className="group">
                  <summary className="cursor-pointer flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <span className="font-medium text-slate-800">What's your cancellation policy?</span>
                    <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="mt-2 p-4 text-sm text-slate-600 bg-white rounded-lg border">
                    Free cancellation up to 48 hours before departure. Cancellations within 48 hours are subject to supplier policies, but we'll help you get the best possible refund.
                  </div>
                </details>
              </div>
            </div>

            {/* Travel Tips & Recommendations */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>💡</span> Travel Tips & Recommendations
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
                  <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <span>📦</span> What to Pack
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Comfortable walking shoes</li>
                    <li>• Weather-appropriate clothing</li>
                    <li>• Camera and extra batteries</li>
                    <li>• Travel documents</li>
                    <li>• Personal medications</li>
                  </ul>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
                  <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <span>🌍</span> Local Insights
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Best time to visit: Year-round</li>
                    <li>• Local currency: USD</li>
                    <li>• Language: English</li>
                    <li>• Time zone: Local time</li>
                    <li>• Emergency: 911</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Similar Tours */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>🌟</span> You Might Also Like
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="group cursor-pointer">
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl">
                        🏔️
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800 group-hover:text-green-600 transition-colors">Mountain Adventures</h4>
                        <p className="text-sm text-slate-600">From ₹45,000</p>
                        <p className="text-xs text-slate-500">5 days • Adventure</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="group cursor-pointer">
                  <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl">
                        🏖️
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">Beach Escapes</h4>
                        <p className="text-sm text-slate-600">From ₹38,000</p>
                        <p className="text-xs text-slate-500">4 days • Beach</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* Social Proof & Statistics */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>📊</span> Why Choose TravelGo?
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-brand-600 mb-1">2,500+</div>
                  <div className="text-sm text-slate-600">Happy Travelers</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-brand-600 mb-1">98%</div>
                  <div className="text-sm text-slate-600">Satisfaction Rate</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-brand-600 mb-1">24/7</div>
                  <div className="text-sm text-slate-600">Customer Support</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-brand-600 mb-1">50+</div>
                  <div className="text-sm text-slate-600">Destinations</div>
              </div>
            </div>
          </div>

            {/* Special Offers */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-lg border border-purple-200 p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  🎁
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Special Offers</h3>
                <div className="space-y-3">
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-800">Early Bird Discount</div>
                        <div className="text-sm text-slate-600">Book 30+ days in advance</div>
                      </div>
                      <div className="text-lg font-bold text-purple-600">-15%</div>
                    </div>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-800">Group Booking</div>
                        <div className="text-sm text-slate-600">5+ people traveling together</div>
                      </div>
                      <div className="text-lg font-bold text-purple-600">-10%</div>
                    </div>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-800">Loyalty Rewards</div>
                        <div className="text-sm text-slate-600">Returning customers</div>
                      </div>
                      <div className="text-lg font-bold text-purple-600">-5%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              </div>
            </div>
          </div>


      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 py-16">
        <div className="container-responsive text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready for Your Adventure?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of happy travelers who have experienced unforgettable journeys with us. 
            Book now and start counting down to your dream vacation!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-4 text-white/80">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm">2,500+ happy customers</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                <span className="text-sm">98% satisfaction rate</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


