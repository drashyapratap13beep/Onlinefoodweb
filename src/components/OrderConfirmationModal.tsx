import React from 'react';
import { useBakery } from '../context/BakeryContext';
import {
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  Printer,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Flame,
} from 'lucide-react';

export const OrderConfirmationModal: React.FC = () => {
  const {
    confirmedOrder,
    setConfirmedOrder,
    setTrackedOrder,
    setActiveView,
    setActiveDashboardTab,
    formatPrice,
  } = useBakery();

  if (!confirmedOrder) return null;

  const handleTrackLive = () => {
    setTrackedOrder(confirmedOrder);
    setConfirmedOrder(null);
  };

  const handleViewDashboard = () => {
    setConfirmedOrder(null);
    setActiveView('dashboard');
    setActiveDashboardTab('orders');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl max-w-xl w-full shadow-2xl border border-[#DECDB8] overflow-hidden my-0 sm:my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner with Confetti Accent */}
        <div className="bg-gradient-to-r from-[#2C241E] to-[#45362B] text-[#FAF7F2] p-6 text-center relative">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
            Royal Order Confirmed
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold mt-1">
            Shukriya, {confirmedOrder.customer.name.split(' ')[0]}!
          </h2>
          <p className="text-xs text-[#DECBC0] mt-1 max-w-md mx-auto">
            Your feast is now being prepared fresh at our clay tandoor and charcoal dum handi station.
          </p>

          <div className="mt-4 inline-block bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
            <span className="text-xs font-mono font-bold text-amber-200">
              Order #{confirmedOrder.id}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Fulfillment details */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DEC8] flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-stone-500 block font-medium">Estimated Fulfillment</span>
                <span className="font-bold text-stone-900 text-sm">
                  {confirmedOrder.fulfillmentTime}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-stone-500 block font-medium">Type</span>
              <span className="font-bold uppercase tracking-wide text-xs text-stone-900">
                {confirmedOrder.type}
              </span>
            </div>
          </div>

          {/* Location note */}
          <div className="flex items-start gap-2.5 text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200">
            <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              {confirmedOrder.type === 'pickup' ? (
                <>
                  <strong className="text-stone-800">Pickup Counter:</strong> Zaika Darbar Flagship Dawat Hall, 14th Road, Bandra West, Mumbai 400050.
                  Please share your Order # with the host upon arrival.
                </>
              ) : (
                <>
                  <strong className="text-stone-800">Delivering to:</strong>{' '}
                  {confirmedOrder.deliveryAddress?.street}, {confirmedOrder.deliveryAddress?.city}
                </>
              )}
            </div>
          </div>

          {/* Itemized summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Ordered Items
            </h4>
            <div className="divide-y divide-stone-100 max-h-48 overflow-y-auto pr-1">
              {confirmedOrder.items.map((ci) => (
                <div key={ci.cartItemId} className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-stone-800">
                      {ci.quantity}x {ci.menuItem.name}
                    </span>
                    {ci.selectedOptionsDisplay.length > 0 && (
                      <span className="text-stone-500 block text-[11px]">
                        {ci.selectedOptionsDisplay.join(', ')}
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-stone-800">
                    {formatPrice(ci.itemTotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm text-stone-900">
              <span>Total Paid</span>
              <span className="text-[#B86518]">{formatPrice(confirmedOrder.total)}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleTrackLive}
              className="w-full bg-[#C97A2B] hover:bg-[#B2651F] text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              <span>Track Baking Progress Live</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleViewDashboard}
              className="w-full bg-[#2C241E] hover:bg-stone-800 text-amber-200 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>View In Owner Dashboard (See Live Category Stats)</span>
            </button>

            <button
              onClick={() => setConfirmedOrder(null)}
              className="w-full text-center text-xs text-stone-500 hover:text-stone-800 py-1 cursor-pointer"
            >
              Back to Bakery Vitrine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
