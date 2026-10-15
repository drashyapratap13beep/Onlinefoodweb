import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import confetti from 'canvas-confetti';
import {
  X,
  CreditCard,
  CheckCircle,
  Truck,
  Store,
  Clock,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Coins,
  ChevronRight,
  QrCode,
  Check,
} from 'lucide-react';
import { PaymentMethod } from '../types/bakery';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    orderType,
    setOrderType,
    placeOrder,
    formatPrice,
    currency,
  } = useBakery();

  const [customerName, setCustomerName] = useState('Aarav Patel');
  const [customerEmail, setCustomerEmail] = useState('aarav.patel@gmail.com');
  const [customerPhone, setCustomerPhone] = useState('+91 98200 45890');

  const [pickupSlot, setPickupSlot] = useState('Today in 20-30 mins');
  const [streetAddress, setStreetAddress] = useState('Flat 402, Lotus Court, 14th Road, Bandra West');
  const [aptSuite, setAptSuite] = useState('Near Khar Gymkhana');
  const [city, setCity] = useState('Mumbai');
  const [zipCode, setZipCode] = useState('400050');
  const [deliveryNotes, setDeliveryNotes] = useState('Please leave with security or ring bell');

  // Indian Payment Options
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('aarav@okhdfcbank');
  const [showUpiQr, setShowUpiQr] = useState(false);

  const [tipAmountInr, setTipAmountInr] = useState<number>(30); // ₹30 default tip
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  // Indian Bakery GST is 5%
  const gstRate = 0.05;
  const tax = Math.round(cartSubtotal * gstRate * 100) / 100;
  
  // Delivery Fee: Free above ₹350 (or ~4.20 USD)
  const FREE_DELIVERY_THRESHOLD = 4.20;
  const isFreeDelivery = cartSubtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = orderType === 'delivery' ? (isFreeDelivery ? 0 : 0.60) : 0; // ~₹50 or free

  // Tip in USD equivalent for calculation
  const tipInUSD = tipAmountInr / 85;
  const finalTotal = Math.round((cartSubtotal + tax + deliveryFee + tipInUSD) * 100) / 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // Trigger festive celebration confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#C85A17', '#E68A00', '#2E6F40', '#F4ECE1'],
      });

      placeOrder({
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
        },
        type: orderType,
        fulfillmentTime: orderType === 'pickup' ? pickupSlot : 'Today in 40-50 mins',
        deliveryAddress:
          orderType === 'delivery'
            ? {
                street: streetAddress,
                aptOrSuite: aptSuite,
                city,
                zipCode,
                instructions: deliveryNotes,
              }
            : undefined,
        paymentMethod,
        tip: tipInUSD,
        notes: orderNotes,
      });

      setIsSubmitting(false);
      setIsCheckoutOpen(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full shadow-2xl border border-[#DECDB8] overflow-hidden max-h-[92vh] sm:max-h-[88vh] flex flex-col my-0 sm:my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Swipe handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center bg-[#FAF6F0]">
          <div className="w-12 h-1 bg-stone-300 rounded-full" />
        </div>

        {/* Modal Top Header */}
        <div className="bg-[#FAF6F0] p-4 sm:p-5 border-b border-[#EBE1D3] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#261D15] text-amber-200 flex items-center justify-center font-serif font-bold text-sm shadow-xs">
              ZD
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl text-[#261D15]">
                Complete Your Order
              </h2>
              <p className="text-[11px] text-stone-500">
                Freshly cooked authentic Indian dishes reserved for you
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 rounded-full hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* 1. Fulfillment Mode Switcher */}
          <div className="bg-[#FAF6F0] p-3 sm:p-3.5 rounded-2xl border border-[#E8DEC8] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#4E3F34]">
                Fulfillment Mode
              </span>
              <div className="flex bg-[#EFE6DA] p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setOrderType('pickup')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    orderType === 'pickup'
                      ? 'bg-[#261D15] text-white shadow-xs'
                      : 'text-[#695648]'
                  }`}
                >
                  Store Pickup
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    orderType === 'delivery'
                      ? 'bg-[#261D15] text-white shadow-xs'
                      : 'text-[#695648]'
                  }`}
                >
                  Direct Delivery
                </button>
              </div>
            </div>

            {orderType === 'pickup' ? (
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-stone-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#C85A17]" />
                  Select Pickup Time Slot
                </label>
                <select
                  value={pickupSlot}
                  onChange={(e) => setPickupSlot(e.target.value)}
                  className="w-full bg-white border border-[#D5C5B2] rounded-xl px-3 py-2 text-xs font-semibold text-[#261D15] focus:ring-2 focus:ring-[#C85A17]"
                >
                  <option value="Today in 20-30 mins">Instant (~20-30 mins)</option>
                  <option value="Morning Chai Slot (7:30 AM – 9:00 AM)">
                    Morning Chai Slot (7:30 AM – 9:00 AM)
                  </option>
                  <option value="Lunch Break Slot (12:30 PM – 2:00 PM)">
                    Lunch Break Slot (12:30 PM – 2:00 PM)
                  </option>
                  <option value="Evening High-Tea Slot (4:30 PM – 6:00 PM)">
                    Evening High-Tea Slot (4:30 PM – 6:00 PM)
                  </option>
                </select>
                <p className="text-[10px] text-stone-500">
                  📍 Pickup from Zaika Darbar Dawat Hall, 14th Road, Bandra West, Mumbai
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Flat / Floor / House No."
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    required
                    className="w-full bg-white border border-[#D5C5B2] rounded-xl px-3 py-2 text-xs text-[#261D15] focus:ring-2 focus:ring-[#C85A17]"
                  />
                  <input
                    type="text"
                    placeholder="Apartment / Landmark / Street"
                    value={aptSuite}
                    onChange={(e) => setAptSuite(e.target.value)}
                    className="w-full bg-white border border-[#D5C5B2] rounded-xl px-3 py-2 text-xs text-[#261D15] focus:ring-2 focus:ring-[#C85A17]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="City (e.g. Mumbai)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full bg-white border border-[#D5C5B2] rounded-xl px-3 py-2 text-xs text-[#261D15] focus:ring-2 focus:ring-[#C85A17]"
                  />
                  <input
                    type="text"
                    placeholder="PIN Code (6 digits)"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                    className="w-full bg-white border border-[#D5C5B2] rounded-xl px-3 py-2 text-xs text-[#261D15] focus:ring-2 focus:ring-[#C85A17]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. Customer Contact Details */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4E3F34]">
              Customer Information
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full bg-[#FAF6F0] border border-[#DFD4C4] rounded-xl px-3 py-2 text-xs text-[#261D15] focus:ring-2 focus:ring-[#C85A17]"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="+91 Mobile Number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                  className="w-full bg-[#FAF6F0] border border-[#DFD4C4] rounded-xl px-3 py-2 text-xs text-[#261D15] focus:ring-2 focus:ring-[#C85A17]"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email for order bill"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                  className="w-full bg-[#FAF6F0] border border-[#DFD4C4] rounded-xl px-3 py-2 text-xs text-[#261D15] focus:ring-2 focus:ring-[#C85A17]"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Method: UPI, Cards & COD */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4E3F34]">
              Payment Method
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'upi'
                    ? 'border-[#C85A17] bg-amber-50/60 shadow-xs ring-1 ring-[#C85A17]'
                    : 'border-[#E0D2BE] hover:border-stone-400 bg-white'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-[#C85A17] text-white flex items-center justify-center font-bold text-[10px]">
                  UPI
                </div>
                <span className="text-xs font-bold text-stone-900">UPI / QR</span>
                <span className="text-[9px] text-stone-500">GPay • PhonePe</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'card'
                    ? 'border-[#C85A17] bg-amber-50/60 shadow-xs ring-1 ring-[#C85A17]'
                    : 'border-[#E0D2BE] hover:border-stone-400 bg-white'
                }`}
              >
                <CreditCard className="w-6 h-6 text-stone-700" />
                <span className="text-xs font-bold text-stone-900">Card</span>
                <span className="text-[9px] text-stone-500">RuPay • Visa • MC</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'cod'
                    ? 'border-[#C85A17] bg-amber-50/60 shadow-xs ring-1 ring-[#C85A17]'
                    : 'border-[#E0D2BE] hover:border-stone-400 bg-white'
                }`}
              >
                <Coins className="w-6 h-6 text-emerald-700" />
                <span className="text-xs font-bold text-stone-900">Cash</span>
                <span className="text-[9px] text-stone-500">Pay on Delivery</span>
              </button>
            </div>

            {/* UPI Details Box */}
            {paymentMethod === 'upi' && (
              <div className="bg-[#F8EFE4] p-3 rounded-2xl border border-[#E2D5C3] space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
                  <span>Enter UPI ID / VPA</span>
                  <button
                    type="button"
                    onClick={() => setShowUpiQr(!showUpiQr)}
                    className="text-[#C85A17] hover:underline flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    {showUpiQr ? 'Hide QR' : 'Show UPI QR'}
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="e.g. yourname@okhdfcbank or 9820045890@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-white border border-[#D5C5B2] rounded-xl px-3 py-2 text-xs font-medium text-[#261D15] focus:ring-2 focus:ring-[#C85A17]"
                />
                {showUpiQr && (
                  <div className="text-center py-3 bg-white rounded-xl border border-dashed border-[#D2C2B0] space-y-2 animate-in fade-in duration-200">
                    <div className="w-32 h-32 mx-auto bg-stone-900 rounded-lg p-2 flex items-center justify-center">
                      <QrCode className="w-28 h-28 text-white" />
                    </div>
                    <p className="text-[11px] text-stone-600 font-semibold">
                      Scan with any UPI app (GPay / PhonePe / Paytm / BHIM)
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 4. Delivery Partner Tip (Beloved in Indian delivery apps) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-bold uppercase text-[#4E3F34]">
              <span>Delivery Partner Tip (₹)</span>
              <span className="text-emerald-700 font-semibold">100% goes to rider</span>
            </div>
            <div className="flex gap-2">
              {[0, 20, 30, 50, 100].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTipAmountInr(amt)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    tipAmountInr === amt
                      ? 'bg-[#261D15] text-white border-[#261D15]'
                      : 'bg-[#FAF6F0] text-stone-700 border-[#DFD4C4] hover:border-stone-400'
                  }`}
                >
                  {amt === 0 ? 'None' : `₹${amt}`}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Special Baking Instructions */}
          <div>
            <textarea
              placeholder="Any special packaging or delivery instructions? (e.g. Eggless seal required, leave with guard)..."
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              rows={2}
              className="w-full bg-[#FAF6F0] border border-[#DFD4C4] rounded-xl p-2.5 text-xs text-[#261D15] focus:ring-2 focus:ring-[#C85A17]"
            />
          </div>

          {/* 6. Bill Summary */}
          <div className="bg-[#F8EFE4] rounded-2xl p-3.5 space-y-1.5 text-xs border border-[#E2D5C3]">
            <div className="flex justify-between text-stone-600">
              <span>Item Subtotal ({cart.length} items)</span>
              <span className="font-semibold text-stone-800">{formatPrice(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Bakery GST (5%)</span>
              <span className="font-semibold text-stone-800">{formatPrice(tax)}</span>
            </div>
            {orderType === 'delivery' && (
              <div className="flex justify-between text-stone-600">
                <span>Delivery Fee</span>
                <span className="font-semibold text-stone-800">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    formatPrice(deliveryFee)
                  )}
                </span>
              </div>
            )}
            {tipAmountInr > 0 && (
              <div className="flex justify-between text-stone-600">
                <span>Rider Tip</span>
                <span className="font-semibold text-stone-800">{formatPrice(tipInUSD)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-extrabold text-[#261D15] pt-2 border-t border-[#DECDB8]">
              <span>To Pay</span>
              <span className="text-[#C85A17] text-base">{formatPrice(finalTotal)}</span>
            </div>
          </div>

          {/* Submit Order Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#C85A17] hover:bg-[#B04C10] text-white py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#C85A17]/25 hover:shadow-xl transition-all cursor-pointer min-h-[48px] active:scale-[0.98] disabled:opacity-60"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Confirming with Bakeshop...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Place Order • {formatPrice(finalTotal)}</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
