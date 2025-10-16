import { GlobeAltIcon, UserGroupIcon, BoltIcon } from "@heroicons/react/24/outline";
import FeatureIcons from "../../components/FeatureIcons";

export const metadata = { title: "Why Us – TravelGo" };

export default function WhyUsPage() {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Header Section */}
      <div className="container-responsive py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Why Choose <span className="text-blue-600 dark:text-blue-400">TravelGo</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          We create journeys that inspire and connect you with authentic cultures, all while 
          making your travel smooth, safe, and memorable.
        </p>
      </div>

       {/* Features Section */}
       <div className="container-responsive grid md:grid-cols-3 gap-8 py-12">
         <div className="p-6 bg-blue-50 dark:bg-blue-900/30 rounded-2xl shadow hover:shadow-lg transition">
           <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800 mb-4">
             <UserGroupIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
           </div>
           <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
             Expert Guides
           </h3>
           <p className="text-gray-600 dark:text-gray-300">
             Local guides who know hidden gems and bring destinations to life.
           </p>
         </div>

         <div className="p-6 bg-green-50 dark:bg-green-900/30 rounded-2xl shadow hover:shadow-lg transition">
           <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-800 mb-4">
             <BoltIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
           </div>
           <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
             Seamless Booking
           </h3>
           <p className="text-gray-600 dark:text-gray-300">
             Hassle-free reservations with transparent pricing and secure payments.
           </p>
         </div>

         <div className="p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl shadow hover:shadow-lg transition">
           <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-800 mb-4">
             <GlobeAltIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
           </div>
           <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
             Curated Itineraries
           </h3>
           <p className="text-gray-600 dark:text-gray-300">
             Handpicked travel plans tailored to your interests and comfort.
           </p>
         </div>
       </div>

      {/* Promise & Sustainability */}
      <div className="container-responsive py-16 grid lg:grid-cols-2 gap-10">
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg hover:shadow-2xl transition">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            Our Promise
          </h2>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>Transparent pricing and flexible changes</li>
            <li>Authentic experiences beyond the tourist trail</li>
            <li>Responsive support before, during, and after your trip</li>
          </ul>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg hover:shadow-2xl transition">
          <h2 className="text-2xl font-semibold mb-4 text-green-600 dark:text-green-400">
            Sustainability
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We prioritize eco-friendly operators, minimize our footprint, and support 
            local communities so your travel leaves a positive impact.
          </p>
        </div>
      </div>
    </div>
  );
}
