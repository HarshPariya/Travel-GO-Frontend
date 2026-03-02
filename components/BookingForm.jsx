"use client";
import { useEffect, useState } from 'react';
import { getApiUrl } from '../lib/config';
import { tokenManager } from '../lib/auth';

export default function BookingForm({ tourId, tourTitle, price, initialDate }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    guests: 1,
    guestDetails: [{ name: '', email: '', phone: '' }], // Array for multiple guests
    date: '',
    notes: '',
  });
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [slots, setSlots] = useState([]);
  const [slotsStatus, setSlotsStatus] = useState('loading'); // loading | ready | error
  const [progress, setProgress] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(null); // { code, percent }
  const [promoError, setPromoError] = useState('');
  const [orderRef, setOrderRef] = useState('');

  const total = Number(form.guests || 1) * Number(price || 0);
  const basePrice = Number(price || 0);
  const discount = promoApplied ? Math.round(total * (promoApplied.percent / 100)) : 0;
  const taxableAmount = Math.max(0, total - discount);
  const tax = Math.round(taxableAmount * 0.18); // 18% GST
  const finalTotal = taxableAmount + tax;

  // Pre-fill date if parent provides one
  useEffect(() => {
    if (initialDate && !form.date) {
      setForm((prev) => ({ ...prev, date: initialDate }));
    }
  }, [initialDate]);

  // Calculate progress
  useEffect(() => {
    let progressValue = 0;
    
    // Primary contact info (30%)
    if (form.fullName) progressValue += 10;
    if (form.email) progressValue += 10;
    if (form.phone) progressValue += 5;
    if (form.guests > 0) progressValue += 5;
    
    // Travel date (20%)
    if (form.date) progressValue += 20;
    
    // Guest details (40%)
    if (form.guests > 1) {
      const completedGuestDetails = form.guestDetails.slice(0, form.guests).filter(guest => 
        guest.name && guest.email
      ).length;
      const guestProgress = (completedGuestDetails / form.guests) * 40;
      progressValue += guestProgress;
    } else {
      // If only 1 guest, give full points for guest details
      progressValue += 40;
    }
    
    // Special requests (10%)
    if (form.notes) progressValue += 10;
    
    setProgress(Math.min(100, progressValue));
  }, [form]);

  // Handle guest count change
  const handleGuestCountChange = (newCount) => {
    const currentCount = form.guests;
    const guestDetails = [...form.guestDetails];
    
    if (newCount > currentCount) {
      // Add new guest details
      for (let i = currentCount; i < newCount; i++) {
        guestDetails.push({ name: '', email: '', phone: '' });
      }
    } else if (newCount < currentCount) {
      // Remove excess guest details
      guestDetails.splice(newCount);
    }
    
    setForm({
      ...form,
      guests: newCount,
      guestDetails: guestDetails
    });
  };

  // Handle individual guest detail change
  const handleGuestDetailChange = (index, field, value) => {
    const guestDetails = [...form.guestDetails];
    guestDetails[index] = {
      ...guestDetails[index],
      [field]: value
    };
    setForm({
      ...form,
      guestDetails: guestDetails
    });
  };

  // Fetch availability slots
  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setSlotsStatus('loading');
        if (!tourId) throw new Error('Missing tour ID');
        const res = await fetch(getApiUrl(`/tours/${tourId}/availability`));
        if (!res.ok) throw new Error('Failed to load availability');
        const data = await res.json();
        if (isMounted) {
          setSlots(Array.isArray(data.slots) ? data.slots : []);
          setSlotsStatus('ready');
        }
      } catch (e) {
        if (isMounted) {
          setSlots([]);
          setSlotsStatus('error');
        }
      }
    }
    load();
    return () => { isMounted = false; };
  }, [tourId]);

  async function submit(e) {
    e.preventDefault();
    setStatus('submitting');
    setMessage('');

    // ensure user is logged in before booking
    const token = tokenManager.getToken();
    if (!token) {
      // redirect them to login page on frontend
      window.location.href = '/auth';
      return;
    }

    try {
      if (tourId && tourId.startsWith('fallback-')) {
        await new Promise((r) => setTimeout(r, 600));
        setStatus('success');
        setMessage("🎉 Booking request received! We'll contact you within 24 hours to confirm your reservation.");
        setForm({ fullName: '', email: '', phone: '', guests: 1, guestDetails: [{ name: '', email: '', phone: '' }], date: '', notes: '' });
        return;
      }

      const res = await fetch(getApiUrl('/bookings'), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          tourId, 
          ...form,
          guestDetails: form.guestDetails.slice(0, form.guests) // Only send actual guest details
        }),
      });
      if (!res.ok) {
        // attempt to read a message from the server; if that fails, fall
        // back to the generic text.
        let errMsg = 'Failed to submit booking. Please check your details and try again.';
        try {
          const errData = await res.json();
          if (errData && errData.message) {
            errMsg = errData.message;
          }
        } catch (_e) {
          // ignore parse failure
        }
        if (res.status === 0 || res.status >= 500) {
          // network/server problem
          errMsg =
            errMsg ||
            'Our booking system is temporarily unavailable. Please try again later or contact us directly.';
        }
        throw new Error(errMsg);
      }
      const data = await res.json();
      const ref = data.booking?.reference || `TGO-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
      setOrderRef(ref);
      setStatus('success');
      setMessage("🎉 Booking request received! We'll contact you within 24 hours to confirm your reservation.");
      setForm({ fullName: '', email: '', phone: '', guests: 1, guestDetails: [{ name: '', email: '', phone: '' }], date: '', notes: '' });
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong. Please try again.');
    }
  }

  function applyPromo() {
    const code = (promoCode || '').trim().toUpperCase();
    if (!code) {
      setPromoError('Enter a promo code');
      setPromoApplied(null);
      return;
    }
    const catalog = {
      WELCOME10: 10,
      SUMMER15: 15,
      TRAVEL5: 5,
    };
    if (catalog[code]) {
      setPromoApplied({ code, percent: catalog[code] });
      setPromoError('');
    } else {
      setPromoApplied(null);
      setPromoError('Invalid code');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-emerald-300/60 dark:border-emerald-900 glass p-8 text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg">
          ✓
        </div>
        <h3 className="text-responsive-2xl font-extrabold heading-gradient mb-2">Booking confirmed</h3>
        <p className="text-responsive-sm text-slate-600 dark:text-slate-300 mb-6">We received your request. Our team will confirm your booking shortly.</p>
        {orderRef && (
          <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/60 bg-white/90 dark:bg-slate-900/60 px-4 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300 shadow-sm">
            <span>Reference:</span>
            <code className="tracking-wider">{orderRef}</code>
          </div>
        )}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="/tours" className="btn-primary btn-mobile">Browse more tours</a>
          <a href="/" className="btn-secondary btn-mobile">Go to home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-responsive">
      <div className="card card-desktop p-responsive">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Secure booking progress
            </div>
            <div className="mt-3 w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 shadow-inner overflow-hidden">
              <div className="h-full rounded-full brand-gradient transition-[width] duration-500 ease-out relative" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{Math.round(progress)}%</div>
            <div className="text-[10px] tracking-wide text-slate-500 dark:text-slate-400">Complete</div>
          </div>
        </div>
        {progress < 80 && (
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">Complete the required fields to enable booking.</div>
        )}
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-responsive">
        <div className="space-responsive lg:col-span-2">
          <div className="surface glass-pro">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-indigo-600">
                  🏖️
                </div>
                <div>
                  <div className="text-xs font-medium text-indigo-700">Selected tour</div>
                  <div className="text-responsive-lg font-semibold text-slate-900 dark:text-slate-100">{tourTitle}</div>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
                <span className="chip">Best price guarantee</span>
                <span className="chip">Free cancellation</span>
              </div>
            </div>
          </div>

          <div className="surface">
            <h3 className="text-responsive-xl font-semibold heading-gradient mb-4">Personal information</h3>
            <div className="grid-responsive-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full name<span className="text-red-500"> *</span></label>
                <input required placeholder="Enter your full name" className="form-control" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email address<span className="text-red-500"> *</span></label>
                <input required type="email" placeholder="your.email@example.com" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone number</label>
              <input placeholder="+91 98765 43210" className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>

          <div className="surface">
            <h3 className="text-responsive-xl font-semibold heading-gradient mb-4">Trip details</h3>
            <div className="grid-responsive-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Number of guests<span className="text-red-500"> *</span></label>
                <div className="relative bg-white/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-sm">
                  <button type="button" onClick={() => handleGuestCountChange(Math.min(20, form.guests + 1))} disabled={form.guests >= 20} className="absolute right-0 top-0 w-12 h-1/2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center border-l border-slate-200 dark:border-slate-600 touch-target">
                    <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                  </button>
                  <button type="button" onClick={() => handleGuestCountChange(Math.max(1, form.guests - 1))} disabled={form.guests <= 1} className="absolute right-0 bottom-0 w-12 h-1/2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center border-l border-slate-200 dark:border-slate-600 border-t touch-target">
                    <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <div className="pr-12 py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{form.guests}</span>
                      <span className="text-slate-500 dark:text-slate-400 text-sm">{form.guests === 1 ? 'guest' : 'guests'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Travel date<span className="text-red-500"> *</span></label>
                  {slotsStatus === 'ready' && (
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400"><span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-amber-400"></span> Limited</span><span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-red-500"></span> Sold out</span></div>
                  )}
                </div>
                {slotsStatus === 'loading' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {Array.from({ length: 8 }).map((_, i) => (<div key={i} className="h-20 rounded-xl bg-slate-100 dark:bg-slate-700 animate-pulse" />))}
                  </div>
                )}
                {slotsStatus === 'error' && (
                  <input required type="date" min={new Date().toISOString().split('T')[0]} className="form-control" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                )}
                {slotsStatus === 'ready' && (
                  <div className="relative">
                    <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white/90 dark:from-slate-900/80 to-transparent rounded-l-xl z-10" />
                    <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white/90 dark:from-slate-900/80 to-transparent rounded-r-xl z-10" />
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => { const el = document.getElementById('slot-scroller'); if (el) el.scrollBy({ left: -320, behavior: 'smooth' }); }} className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-lg transition-all duration-200 touch-target" aria-label="Scroll left">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <div id="slot-scroller" className="flex-1 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-p-2">
                        <div className="flex gap-4 min-w-max p-1">
                          {slots.map((s) => {
                            const soldOut = s.remaining <= 0;
                            const limited = !soldOut && s.remaining <= 5;
                            const selected = form.date === s.date;
                            const date = new Date(s.date);
                            const dd = date.toLocaleDateString(undefined, { day: '2-digit' });
                            const mm = date.toLocaleDateString(undefined, { month: 'short' });
                            const weekday = date.toLocaleDateString(undefined, { weekday: 'short' });
                            return (
                              <button type="button" key={s.date} disabled={soldOut} aria-pressed={selected} onClick={() => setForm({ ...form, date: s.date })} className={`snap-start w-40 sm:w-44 shrink-0 text-left px-5 py-4 rounded-2xl border text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 touch-target backdrop-blur ${selected ? 'border-indigo-600 dark:border-indigo-400 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/10 text-indigo-700 dark:text-indigo-300 shadow-xl scale-105' : 'border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/70 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-xl hover:scale-105'} ${soldOut ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                                <div className="text-center space-y-2">
                                  <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{weekday}</div>
                                  <div className="flex items-baseline justify-center gap-1"><span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{dd}</span><span className="text-xs text-slate-500 dark:text-slate-400">{mm}</span></div>
                                  <div className="space-y-1">
                                    {limited && !soldOut && (<span className="inline-flex items-center text-[10px] px-2 py-1 rounded-full bg-amber-100/80 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-700 font-semibold tracking-wide">Limited</span>)}
                                    {soldOut && (<span className="inline-flex items-center text-[10px] px-2 py-1 rounded-full bg-red-100/80 dark:bg-red-900/30 text-red-700 dark:text-red-200 border border-red-200 dark:border-red-700 font-semibold tracking-wide">Sold out</span>)}
                                    {!soldOut && !limited && (<div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{s.remaining} seats</div>)}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                          {slots.length === 0 && (
                            <div className="text-slate-500 dark:text-slate-400 text-sm px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600">No upcoming slots. Try a custom date.</div>
                          )}
                        </div>
                      </div>
                      <button type="button" onClick={() => { const el = document.getElementById('slot-scroller'); if (el) el.scrollBy({ left: 320, behavior: 'smooth' }); }} className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-lg transition-all duration-200 touch-target" aria-label="Scroll right">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {form.guests > 1 && (
            <div className="surface">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">👥</div>
                <h4 className="text-responsive-lg font-semibold heading-gradient">Guest information</h4>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 mt-0.5">ℹ️</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300"><p className="font-semibold mb-1">Please provide details for all guests</p><p>Each guest needs their name and email for booking confirmation and travel documents.</p></div>
                </div>
              </div>
              <div className="space-responsive">
                {form.guestDetails.slice(0, form.guests).map((guest, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 dark:border-slate-700 p-responsive bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center text-sm font-bold">{index + 1}</div>
                      <h5 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">Guest {index + 1}{index === 0 && (<span className="text-sm text-slate-500 dark:text-slate-400 font-normal ml-2">(Primary Contact)</span>)}</h5>
                    </div>
                    <div className="grid-responsive-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full name<span className="text-red-500"> *</span></label>
                        <input required placeholder="Enter guest's full name" className="form-control" value={guest.name} onChange={(e) => handleGuestDetailChange(index, 'name', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email address<span className="text-red-500"> *</span></label>
                        <input required type="email" placeholder="guest.email@example.com" className="form-control" value={guest.email} onChange={(e) => handleGuestDetailChange(index, 'email', e.target.value)} />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone number</label>
                      <input placeholder="+91 98765 43210" className="form-control" value={guest.phone} onChange={(e) => handleGuestDetailChange(index, 'phone', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="surface">
            <h3 className="text-responsive-xl font-semibold heading-gradient mb-2">Special requests or notes</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Additional information</label>
              <textarea placeholder="Any special dietary requirements, accessibility needs, or additional requests..." className="form-control resize-none" rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              <p className="text-xs text-slate-500 dark:text-slate-400">Optional: Let us know about any special requirements or preferences</p>
            </div>
          </div>
        </div>

        <aside className="space-responsive lg:col-span-1">
          <div className="surface glass-pro lg:sticky lg:top-24">
            <h3 className="text-responsive-xl font-semibold heading-gradient mb-6">Price breakdown</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2"><span className="text-slate-600 dark:text-slate-400">Base Price ({form.guests} {form.guests > 1 ? 'guests' : 'guest'})</span><span className="font-semibold text-slate-900 dark:text-slate-100">₹{total.toLocaleString('en-IN')}</span></div>
              {promoApplied && (
                <div className="flex items-center justify-between py-2 text-emerald-700 dark:text-emerald-300">
                  <span className="flex items-center gap-2"><span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-[10px] font-bold">-{promoApplied.percent}%</span>Promo ({promoApplied.code})</span>
                  <span className="font-semibold">-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-2"><span className="text-slate-600 dark:text-slate-400">GST (18%)</span><span className="font-semibold text-slate-900 dark:text-slate-100">₹{tax.toLocaleString('en-IN')}</span></div>
              <div className="border-t border-slate-300 dark:border-slate-600 pt-4">
                <div className="flex items-center justify-between"><span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">Total Amount</span><span className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-300">₹{finalTotal.toLocaleString('en-IN')}</span></div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">All prices include taxes and fees • Secure payment processing</div>
              </div>
              <div className="mt-6">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Have a promo code?</label>
                <div className="mt-2 flex gap-2">
                  <input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="ENTER CODE" className="form-control p-3" />
                  <button type="button" onClick={applyPromo} className="btn-gradient">Apply</button>
                </div>
                {promoError && <div className="mt-1 text-xs text-red-600 dark:text-red-400">{promoError}</div>}
              </div>
            </div>
          </div>

          <button disabled={status === 'submitting' || progress < 80 || (form.guests > 1 && !form.guestDetails.slice(0, form.guests).every(guest => guest.name && guest.email))} className="btn-primary btn-mobile w-full text-base py-4 mt-2 relative overflow-hidden group">
            <span className="relative z-10 flex items-center justify-center gap-3">
              {status === 'submitting' ? (<><div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div><span className="text-lg">Processing your booking...</span></>) : (<><span className="text-xl">🚀</span><span className="text-lg">{progress < 80 ? `Complete Form (${Math.round(progress)}%)` : 'Secure My Booking'}</span></>)}
            </span>
          </button>

          {message && (
            <div className={`text-sm p-4 sm:p-6 rounded-xl border ${status === 'error' ? 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'}`}> 
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${status === 'error' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                  <span className="text-lg">{status === 'error' ? '❌' : '🎉'}</span>
                </div>
                <span className="font-medium">{message}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
            <div className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl"><div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"><span className="text-green-500 text-xl">🔒</span></div><div><div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Secure Payment</div><div className="text-xs text-slate-500 dark:text-slate-400">SSL encrypted</div></div></div>
            <div className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl"><div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center"><span className="text-blue-500 text-xl">📧</span></div><div><div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Instant Confirmation</div><div className="text-xs text-slate-500 dark:text-slate-400">Email receipt</div></div></div>
            <div className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl"><div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center"><span className="text-purple-500 text-xl">🛡️</span></div><div><div className="text-sm font-semibold text-slate-900 dark:text-slate-100">24/7 Support</div><div className="text-xs text-slate-500 dark:text-slate-400">Always available</div></div></div>
          </div>
        </aside>
      </form>
    </div>
  );
}