import React from 'react';
import { useBakery } from '../context/BakeryContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Clock,
  Truck,
  Store,
  Sparkles,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartCount,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    orderType,
    setOrderType,
    setIsCheckoutOpen,
    formatPrice,
  } = useBakery();

  if (!isCartOpen) return null;

  // Free delivery threshold: ₹350 (~$4.20)
  const FREE_DELIVERY_THRESHOLD = 4.20;
  const isFreeDelivery = cartSubtotal >= FREE_DELIVERY_THRESHOLD;
  const progressToFreeDelivery = Math.min(100, (cartSubtotal / FREE_DELIVERY_THRESHOLD) * 100);
  const amountNeededForFree = Math.max(0, FREE_DELIVERY_THRESHOLD - cartSubtotal);

  const deliveryFee = orderType === 'delivery' ? (isFreeDelivery ? 0 : 0.60) : 0;
  const estimatedTax = Math.round(cartSubtotal * 0.05 * 100) / 100; // 5% GST
  const estimatedTotal = Math.round((cartSubtotal + deliveryFee + estimatedTax) * 100) / 100;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#DECDB8] animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EBE1D3] flex items-center justify-between bg-[#FAF6F0] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#C85A17] text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-[#261D15]">
                Your Royal Dawat Order
              </h2>
              <span className="text-xs text-[#7A6759]">
                {cartCount} {cartCount === 1 ? 'item' : 'items'} selected
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fulfillment Switcher & Free Delivery Bar */}
        <div className="px-4 sm:px-5 py-3 bg-[#F4ECE1] border-b border-[#E2D5C3] space-y-2.5 shrink-0">
          <div className="grid grid-cols-2 gap-2 bg-[#E9DDCF] p-1 rounded-xl">
            <button
              onClick={() => setOrderType('pickup')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[36px] ${
                orderType === 'pickup'
                  ? 'bg-white text-[#261D15] shadow-xs'
                  : 'text-[#6C584B] hover:text-[#261D15]'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Store Pickup</span>
            </button>
            <button
              onClick={() => setOrderType('delivery')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[36px] ${
                orderType === 'delivery'
                  ? 'bg-white text-[#261D15] shadow-xs'
                  : 'text-[#6C584B] hover:text-[#261D15]'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Direct Delivery</span>
            </button>
          </div>

          {/* Delivery threshold progress */}
          {orderType === 'delivery' && (
            <div className="text-[11px] text-[#5A493D] space-y-1">
              <div className="flex justify-between font-medium">
                {isFreeDelivery ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Qualified for FREE delivery!
                  </span>
                ) : (
                  <span>Add {formatPrice(amountNeededForFree)} more for Free Delivery</span>
                )}
                <span>{formatPrice(FREE_DELIVERY_THRESHOLD)} target</span>
              </div>
              <div className="w-full h-1.5 bg-[#DCCBB7] rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                  style={{ width: `${progressToFreeDelivery}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#F5EEE4] flex items-center justify-center mx-auto text-[#B5967E]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-800">
                Your dawat order is empty
              </h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore our Royal Dawat Menu for fragrant dum biryanis, sizzling tandoori kebabs, and rich sweets.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-[#261D15] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-stone-800 cursor-pointer active:scale-95 transition-all"
              >
                Explore Royal Menu
              </button>
            </div>
          ) : (
            cart.map((ci) => {
              const isItemVeg = ci.menuItem.isEggless ?? (ci.menuItem.dietaryTags.includes('100% Eggless') || ci.menuItem.dietaryTags.includes('Vegan'));
              return (
                <div
                  key={ci.cartItemId}
                  className="p-3 bg-[#FAF6F0] rounded-2xl border border-[#EBE0D2] flex gap-3 items-center justify-between"
                >
                  {/* Thumbnail with Veg tag */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xl overflow-hidden border border-stone-200">
                    <img
                      src={ci.menuItem.imageUrl}
                      alt={ci.menuItem.name}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className={`absolute top-1 left-1 w-3.5 h-3.5 rounded-xs flex items-center justify-center bg-white/90 p-0.5 border ${
                        isItemVeg ? 'border-emerald-600' : 'border-amber-800'
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          isItemVeg ? 'bg-emerald-600' : 'bg-amber-800'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 pr-1">
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-[#261D15] truncate">
                      {ci.menuItem.name}
                    </h4>

                    {ci.selectedOptionsDisplay.length > 0 && (
                      <p className="text-[10px] text-stone-500 truncate">
                        {ci.selectedOptionsDisplay.join(', ')}
                      </p>
                    )}

                    <div className="text-xs font-extrabold text-[#C85A17] mt-0.5">
                      {formatPrice(ci.itemTotal)}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1.5 shrink-0 bg-white border border-[#E0D2BE] rounded-xl p-1">
                    <button
                      onClick={() => updateCartQuantity(ci.cartItemId, -1)}
                      className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-rose-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      {ci.quantity === 1 ? (
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      ) : (
                        <Minus className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <span className="text-xs font-bold w-5 text-center text-[#261D15]">
                      {ci.quantity}
                    </span>

                    <button
                      onClick={() => updateCartQuantity(ci.cartItemId, 1)}
                      className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-emerald-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-[#FAF6F0] border-t border-[#EBE1D3] space-y-3 shrink-0">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-800">{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>GST (5%)</span>
                <span className="font-semibold text-stone-800">{formatPrice(estimatedTax)}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between text-stone-600">
                  <span>Delivery</span>
                  <span className="font-semibold text-stone-800">
                    {deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatPrice(deliveryFee)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm sm:text-base font-extrabold text-[#261D15] pt-2 border-t border-[#E2D5C3]">
                <span>Estimated Total</span>
                <span className="text-[#C85A17]">{formatPrice(estimatedTotal)}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-[#C85A17] hover:bg-[#B04C10] text-white py-3 sm:py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#C85A17]/25 hover:shadow-xl transition-all cursor-pointer min-h-[46px] active:scale-[0.98]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
