"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { getApiUrl } from "../lib/config";
import { FALLBACK_TOURS } from "../lib/fallbackTours";
import { tokenManager, authAPI } from "../lib/auth";

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load tours (${res.status})`);
  }
  const data = await res.json();
  // Support both array response and { tours, pagination, ... }
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.tours)) return data.tours;
  // Graceful fallback to empty list; caller will use FALLBACK_TOURS
  return [];
};

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg">
      <div className="h-56 w-full bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 bg-slate-200 rounded"></div>
        <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
      </div>
    </div>
  );
}

export default function ToursGrid({ featured = false, action = "view" }) {
  const searchParams = useSearchParams();
  const qs = featured ? "?featured=true" : "";
  const { data: tours, error, isLoading } = useSWR(
    getApiUrl(`/tours${qs}`),
    fetcher
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");
  const [user, setUser] = useState(null);

  // Get user data for wishlist functionality
  useEffect(() => {
    const userData = tokenManager.getUser();
    setUser(userData);
  }, []);

  // Initialize from URL: ?location=Surat&sort=price_desc
  useEffect(() => {
    const loc = searchParams?.get("location");
    const sort = searchParams?.get("sort");
    if (loc) setSearch(loc);
    if (sort === "price_desc" || sort === "price_asc" || sort === "rating_desc") setSortBy(sort);
  }, [searchParams]);

  // ✅ Safe fallback
  const shouldUseFallback =
    !!error || !Array.isArray(tours) || tours.length === 0;

  let list = shouldUseFallback
    ? Array.isArray(FALLBACK_TOURS)
      ? FALLBACK_TOURS
      : []
    : tours || [];

  // ✅ Normalize tours
  list = list.map((tour) => ({
    ...tour,
    slug: tour.slug || tour._id || "unknown",
    rating: typeof tour.rating === "number" ? tour.rating : 4,
    price: typeof tour.price === "number" ? tour.price : 0,
    durationDays: tour.durationDays || tour.duration || 0,
    imageUrl: tour.imageUrl || "/images/tour-fallback.jpg",
  }));

  // ✅ Featured limit
  if (featured) list = list.slice(0, 6);

  // ✅ Dynamic categories from data
  const categories = Array.from(
    new Set(list.map((tour) => tour.category))
  ).filter(Boolean);

  // ✅ Filtering
  const filteredTours = useMemo(() => {
    return list.filter((tour) => {
      const matchesSearch =
        tour.title?.toLowerCase().includes(search.toLowerCase()) ||
        tour.location?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = category
        ? tour.category.toLowerCase() === category.toLowerCase()
        : true;

      const matchesPrice =
        tour.price >= priceRange[0] && tour.price <= priceRange[1];

      const matchesRating = tour.rating >= minRating;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });
  }, [list, search, category, priceRange, minRating]);

  const displayedTours = useMemo(() => {
    const arr = [...filteredTours];
    if (sortBy === "price_desc") {
      arr.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "price_asc") {
      arr.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "rating_desc") {
      arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return arr;
  }, [filteredTours, sortBy]);

  if (isLoading) {
    return (
      <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* ✅ Enhanced Search + Filters */}
      <div className="mb-8 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search destinations, tours, or activities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-4 pl-12 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all duration-200"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden">
          <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200">
            <span className="font-medium">Filters & Sort</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:block space-y-6">
          {/* Dynamic Categories */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategory("")}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                  category === ""
                    ? "bg-brand-600 text-white border-brand-600 shadow-md"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(category === cat ? "" : cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                    category === cat
                      ? "bg-brand-600 text-white border-brand-600 shadow-md"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Price, Rating & Sort */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Price Range
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([0, parseInt(e.target.value, 10)])
                  }
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Up to ₹{priceRange[1].toLocaleString('en-IN')}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Minimum Rating
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={minRating}
                  onChange={(e) => setMinRating(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {minRating}+ stars
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-3 text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all duration-200"
              >
                <option value="relevance">Relevance</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="rating_desc">Rating: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Enhanced Tours Grid */}
      {filteredTours.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No tours found</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">Try adjusting your search criteria or filters</p>
          <button 
            onClick={() => {
              setSearch("");
              setCategory("");
              setPriceRange([0, 1000000]);
              setMinRating(0);
              setSortBy("relevance");
            }}
            className="btn-primary"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayedTours.map((tour) => {
            const isInWishlist = user?.wishlist?.some(wishlistTour => 
              wishlistTour._id === tour._id || wishlistTour === tour._id
            );

            const handleWishlistToggle = async (e) => {
              e.preventDefault();
              e.stopPropagation();
              
              if (!user) {
                // Redirect to login or show auth modal
                return;
              }

              try {
                const token = tokenManager.getToken();
                if (isInWishlist) {
                  await authAPI.removeFromWishlist(token, tour._id);
                } else {
                  await authAPI.addToWishlist(token, tour._id);
                }
                // Refresh user data
                const userData = tokenManager.getUser();
                setUser(userData);
              } catch (error) {
                console.error("Failed to update wishlist:", error);
              }
            };

            return (
              <Link
                key={tour.slug}
                href={`/tours/${tour.slug}`}
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:-translate-y-1 hover:scale-[1.02]"
              >
                {/* Image Container */}
                <div className="relative h-48 sm:h-56 lg:h-64 w-full overflow-hidden">
                  <Image
                    src={tour.imageUrl}
                    alt={tour.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  
                  {/* Duration badge */}
                  <div className="absolute left-3 top-3 bg-brand-600 text-white text-xs px-3 py-1 rounded-full shadow-lg font-medium">
                    {tour.durationDays} Days
                  </div>
                  
                  {/* Wishlist button */}
                  {user && (
                    <button
                      onClick={handleWishlistToggle}
                      className="absolute right-3 top-3 p-2 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 rounded-full shadow-lg transition-all duration-200 touch-target"
                      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart 
                        className={`w-5 h-5 transition-colors duration-200 ${
                          isInWishlist 
                            ? 'text-red-500 fill-current' 
                            : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
                        }`} 
                      />
                    </button>
                  )}

                  {/* Category badge */}
                  {tour.category && (
                    <div className="absolute left-3 bottom-3 bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 text-xs px-2 py-1 rounded-full shadow-md font-medium">
                      {tour.category}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 space-y-3">
                  {/* Title and Price */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200 transition-colors duration-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 line-clamp-2 flex-1">
                      {tour.title}
                    </h3>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg sm:text-xl font-bold text-brand-600 dark:text-brand-400">
                        ₹{tour.price.toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">per person</div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{tour.location}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(tour.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {tour.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      ({tour.numReviews || 0} reviews)
                    </span>
                  </div>

                  {/* Action Button */}
                  {action === "book" && (
                    <div className="pt-2">
                      <Link
                        href={`/book/${tour.slug}`}
                        className="block w-full text-center rounded-xl bg-brand-600 hover:bg-brand-700 px-4 py-3 text-sm font-medium text-white shadow-md hover:shadow-lg transition-all duration-200 touch-target"
                      >
                        Book Now
                      </Link>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
