"use client";
import { useState, useEffect } from 'react';

export default function ItineraryModal({ tourTitle, tourData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Generate dynamic itinerary based on tour data
  const generateItinerary = () => {
    if (!tourData) return [];

    const duration = tourData.durationDays || 3;
    const category = tourData.category || 'Adventure';
    const location = tourData.location || '';
    const itinerary = [];

    // Day 1 - Arrival
    itinerary.push({
      day: 1,
      title: "Arrival & Welcome",
      activities: [
        { time: "Morning", description: "Airport pickup and hotel check-in" },
        { time: "Afternoon", description: "Welcome meeting and tour orientation" },
        { time: "Evening", description: "Welcome dinner and introductions" }
      ]
    });

    // Middle days - Tour specific activities
    for (let i = 2; i < duration; i++) {
      const dayTitle = getDayTitle(category, i, location);
      const activities = getDayActivities(category, i, location);
      
      itinerary.push({
        day: i,
        title: dayTitle,
        activities: activities
      });
    }

    // Last day - Departure
    if (duration > 1) {
      itinerary.push({
        day: duration,
        title: "Departure",
        activities: [
          { time: "Morning", description: "Final sightseeing and souvenir shopping" },
          { time: "Afternoon", description: "Hotel check-out and airport transfer" },
          { time: "Evening", description: "Safe travels home!" }
        ]
      });
    }

    return itinerary;
  };

  const getDayTitle = (category, dayNumber, location) => {
    const titles = {
      'Adventure': [
        'Mountain Adventure & Nature Trek',
        'Wildlife Safari & Outdoor Activities',
        'Extreme Sports & Adventure Sports',
        'Hiking & Scenic Viewpoints',
        'Water Sports & Beach Activities'
      ],
      'Cultural': [
        'Historical Sites & Monuments',
        'Museum Tours & Cultural Centers',
        'Traditional Village Visits',
        'Local Art & Craft Workshops',
        'Cultural Performances & Shows'
      ],
      'Beach': [
        'Beach Relaxation & Water Sports',
        'Island Hopping & Snorkeling',
        'Beach Activities & Sunbathing',
        'Marine Life & Diving',
        'Beachside Dining & Entertainment'
      ],
      'Family-friendly': [
        'Family Activities & Entertainment',
        'Theme Parks & Attractions',
        'Educational Tours & Learning',
        'Kid-friendly Adventures',
        'Family Bonding Activities'
      ]
    };

    const categoryTitles = titles[category] || titles['Adventure'];
    return categoryTitles[(dayNumber - 2) % categoryTitles.length];
  };

  const getDayActivities = (category, dayNumber, location) => {
    const activities = {
      'Adventure': [
        { time: "Morning", description: "Mountain trekking and scenic viewpoints" },
        { time: "Afternoon", description: "Adventure sports and outdoor activities" },
        { time: "Evening", description: "Campfire and adventure stories" }
      ],
      'Cultural': [
        { time: "Morning", description: "Visit ancient temples and historical monuments" },
        { time: "Afternoon", description: "Museum tour and cultural center visit" },
        { time: "Evening", description: "Traditional cultural performance" }
      ],
      'Beach': [
        { time: "Morning", description: "Beach relaxation and water sports" },
        { time: "Afternoon", description: "Snorkeling and marine life exploration" },
        { time: "Evening", description: "Beachside dinner and sunset viewing" }
      ],
      'Family-friendly': [
        { time: "Morning", description: "Family-friendly attractions and activities" },
        { time: "Afternoon", description: "Interactive experiences and learning" },
        { time: "Evening", description: "Family dinner and entertainment" }
      ]
    };

    return activities[category] || activities['Adventure'];
  };

  const getIncludedItems = () => {
    if (!tourData) return [];

    const baseItems = [
      'Professional guide throughout the tour',
      'All entrance fees and permits',
      'Transportation in air-conditioned vehicle',
      'Daily breakfast and specified meals',
      'Airport transfers',
      '24/7 customer support'
    ];

    // Add category-specific items
    const categoryItems = {
      'Adventure': ['Safety equipment and gear', 'Adventure activity permits'],
      'Cultural': ['Cultural performance tickets', 'Museum and monument entry fees'],
      'Beach': ['Beach equipment rental', 'Water sports gear'],
      'Family-friendly': ['Child-friendly activities', 'Family entertainment tickets']
    };

    const additionalItems = categoryItems[tourData.category] || [];
    return [...baseItems, ...additionalItems];
  };

  const openModal = () => {
    setIsClosing(false);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
  };

  const scrollToBooking = () => {
    const bookingForm = document.querySelector('form');
    if (bookingForm) {
      bookingForm.scrollIntoView({ behavior: 'smooth' });
    }
    closeModal();
  };

  return (
    <>
      {/* View Full Itinerary Button */}
      <button 
        onClick={openModal}
        className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-800 text-sm font-medium transition-all duration-200 ease-in-out hover:gap-2 group"
      >
        <span>View Full Itinerary</span>
        <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
          {/* Backdrop */}
          <div 
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
              isClosing ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={closeModal}
          />
          
          {/* Modal Content */}
          <div className={`relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full mx-4 max-h-[90vh] transition-all duration-200 ${
            isClosing ? 'animate-slide-down opacity-0' : 'animate-slide-up opacity-100'
          }`}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-brand-600 to-brand-800 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Complete Itinerary</h2>
                  <p className="text-white/90">{tourTitle}</p>
                </div>
                <button 
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-6">
                {/* Dynamic Itinerary Days */}
                {generateItinerary().map((day, index) => (
                  <div key={index} className="border-l-4 border-brand-500 pl-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {day.day}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{day.title}</h3>
                        <div className="space-y-2 text-sm text-slate-600">
                          {day.activities?.map((activity, actIndex) => (
                            <p key={actIndex}>
                              <strong>{activity.time}:</strong> {activity.description}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic What's Included */}
              <div className="mt-8 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">What's Included:</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  {getIncludedItems().map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>

              {/* Tour Information */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="font-medium text-slate-700">Duration:</span>
                    <span className="text-slate-600">{tourData?.durationDays || 3} days</span>
                  </div>
                  {tourData?.category && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="font-medium text-slate-700">Category:</span>
                      <span className="text-slate-600">{tourData.category}</span>
                    </div>
                  )}
                  {tourData?.location && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span className="font-medium text-slate-700">Location:</span>
                      <span className="text-slate-600">{tourData.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3">
              <button 
                onClick={closeModal}
                className="btn-secondary hover:shadow-md transition-all duration-200"
              >
                Close
              </button>
              <button 
                onClick={scrollToBooking}
                className="btn-primary hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Book This Tour
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
