"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Heart, 
  Edit3, 
  LogOut,
  Package,
  Star,
  Clock
} from "lucide-react";
import { authAPI, tokenManager } from "../../lib/auth";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", avatar: "" });

  useEffect(() => {
    const token = tokenManager.getToken();
    if (!token) {
      router.push("/");
      return;
    }

    fetchProfile();
  }, [router]);

  const fetchProfile = async () => {
    try {
      const token = tokenManager.getToken();
      const profile = await authAPI.getProfile(token);
      setUser(profile);
      setEditData({ name: profile.name, avatar: profile.avatar || "" });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      tokenManager.logout();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = tokenManager.getToken();
      const response = await authAPI.updateProfile(token, editData);
      
      setUser({ ...user, ...response.user });
      tokenManager.setUser(response.user);
      setEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleLogout = () => {
    tokenManager.logout();
  };

  const toggleWishlist = async (tourId) => {
    try {
      const token = tokenManager.getToken();
      const isInWishlist = user.wishlist.some(tour => tour._id === tourId);
      
      if (isInWishlist) {
        await authAPI.removeFromWishlist(token, tourId);
      } else {
        await authAPI.addToWishlist(token, tourId);
      }
      
      fetchProfile(); // Refresh profile
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Please log in to view your profile.</p>
          <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 flex items-center mt-1">
                  <Mail className="w-4 h-4 mr-2" />
                  {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-8">
              {[
                { id: "profile", label: "Profile", icon: User },
                { id: "bookings", label: "Bookings", icon: Package },
                { id: "wishlist", label: "Wishlist", icon: Heart },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Profile Information
                  </h2>
                  <button
                    onClick={() => setEditing(!editing)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <Edit3 className="w-5 h-5" />
                    <span>{editing ? "Cancel" : "Edit"}</span>
                  </button>
                </div>

                {editing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Avatar URL
                      </label>
                      <input
                        type="url"
                        value={editData.avatar}
                        onChange={(e) => setEditData({ ...editData, avatar: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                    <button
                      onClick={handleUpdateProfile}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                          <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                          <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Booking History
                </h2>
                {user.bookingHistory && user.bookingHistory.length > 0 ? (
                  <div className="space-y-4">
                    {user.bookingHistory.map((booking, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {booking.tour?.title || "Tour"}
                            </h3>
                            {booking.reference && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Ref: {booking.reference}
                              </p>
                            )}
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {booking.tour?.location || "Location"}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {booking.tour?.durationDays || "N/A"} days
                              </span>
                              <span className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                {booking.travelers} travelers
                              </span>
                            </div>
                            {booking.guestDetails && booking.guestDetails.length > 0 && (
                              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                <strong>Guests:</strong> {booking.guestDetails.map((g, i) => g.name || "").join(", ")}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              ${booking.totalPrice}
                            </p>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              booking.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : booking.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {booking.status}
                            </span>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {new Date(booking.bookingDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No bookings yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Start exploring amazing tours and book your first adventure!
                    </p>
                    <Link
                      href="/tours"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Browse Tours
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  My Wishlist
                </h2>
                {user.wishlist && user.wishlist.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {user.wishlist.map((tour) => (
                      <div key={tour._id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        {tour.imageUrl && (
                          <div className="relative h-48">
                            <Image
                              src={tour.imageUrl}
                              alt={tour.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {tour.title}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {tour.location}
                            </span>
                            <button
                              onClick={() => toggleWishlist(tour._id)}
                              className="text-red-500 hover:text-red-600 transition-colors"
                            >
                              <Heart className="w-5 h-5 fill-current" />
                            </button>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                              ${tour.price}
                            </span>
                            <Link
                              href={`/tours/${tour.slug}`}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Your wishlist is empty
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Save tours you love to your wishlist for easy access later!
                    </p>
                    <Link
                      href="/tours"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Explore Tours
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
