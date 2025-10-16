"use client";

import { useState, useMemo } from "react";

export default function DynamicPricing({ basePrice }) {
  const [travelers, setTravelers] = useState(1);
  const [season, setSeason] = useState("normal");

  // Seasonal multipliers
  const seasonMultipliers = {
    low: 0.9,      // -10%
    normal: 1.0,   // base
    high: 1.2,     // +20%
    peak: 1.5,     // +50%
  };

  // Group discounts
  const getGroupDiscountRate = (count) => {
    if (count >= 10) return 0.2;  // 20%
    if (count >= 7) return 0.15;  // 15%
    if (count >= 4) return 0.1;   // 10%
    return 0;
  };

  const pricing = useMemo(() => {
    const seasonalPrice = basePrice * seasonMultipliers[season];
    const subtotal = seasonalPrice * travelers;
    const discountRate = getGroupDiscountRate(travelers);
    const discountAmount = subtotal * discountRate;
    const grandTotal = subtotal - discountAmount;

    return {
      seasonalPrice,
      subtotal,
      discountRate,
      discountAmount,
      grandTotal,
    };
  }, [basePrice, season, travelers]);

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-6 border border-slate-200">
      {/* Controls */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Number of Travelers
          </label>
          <input
            type="number"
            min="1"
            value={travelers}
            onChange={(e) => setTravelers(Math.max(1, Number(e.target.value)))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Season
          </label>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-brand-500"
          >
            <option value="low">Low Season (-10%)</option>
            <option value="normal">Normal Season</option>
            <option value="high">High Season (+20%)</option>
            <option value="peak">Peak Season (+50%)</option>
          </select>
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-3 text-slate-800">
        <div className="flex justify-between">
          <span>Base Price:</span>
          <span className="font-semibold">₹{basePrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between">
          <span>Seasonal Price (per person):</span>
          <span className="font-semibold">
            ₹{pricing.seasonalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Subtotal ({travelers} travelers):</span>
          <span className="font-semibold">₹{pricing.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        {pricing.discountRate > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Group Discount ({pricing.discountRate * 100}%):</span>
            <span>- ₹{pricing.discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        )}
        <div className="border-t pt-3 flex justify-between text-lg font-bold">
          <span>Grand Total:</span>
          <span className="text-brand-600">
            ₹{pricing.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
}
