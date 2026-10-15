import React from 'react';
import { useBakery } from '../context/BakeryContext';
import { Store, ShoppingBag, LayoutDashboard, User, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export const MobileBottomBar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    cartCount,
    cartSubtotal,
    setIsCartOpen,
    currentUser,
    isAdmin,
    setIsLoginModalOpen,
    formatPrice,
    setDietaryFilter,
    dietaryFilter,
  } = useBakery();

  const scrollToMenu = () => {
    setActiveView('store');
    const el = document.getElementById('menu-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAdminClick = () => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
    } else {
      setActiveView('dashboard');
    }
  };

  return (
    <>
      {/* 1. Floating Quick-Cart Action Pill on Mobile (Appears when cart has items) */}
      {cartCount > 0 && activeView === 'store' && (
        <div className="md:hidden fixed bottom-16 inset-x-3 z-40 animate-in slide-in-from-bottom-4 duration-300">
          <div
            onClick={() => setIsCartOpen(true)}
            className="bg-[#261D15] text-white p-3.5 rounded-2xl shadow-2xl border border-stone-700 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#C85A17] flex items-center justify-center font-bold text-xs text-white">
                {cartCount}
              </div>
              <div>
                <div className="text-xs font-bold leading-tight">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} in basket
                </div>
                <div className="text-[11px] text-amber-300 font-extrabold">
                  {formatPrice(cartSubtotal)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-extrabold text-white bg-[#C85A17] px-3.5 py-1.5 rounded-xl shadow-xs">
              <span>View Cart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      )}

      {/* 2. Fixed Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-[#FAF6F0]/95 backdrop-blur-md border-t border-[#E8DEC8] py-2 px-3 flex items-center justify-around shadow-lg">
        {/* Menu View */}
        <button
          onClick={scrollToMenu}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors cursor-pointer py-1 px-2.5 rounded-xl ${
            activeView === 'store' ? 'text-[#C85A17]' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Store className="w-5 h-5" />
          <span>Menu</span>
        </button>

        {/* 100% Eggless Quick Filter */}
        <button
          onClick={() => {
            scrollToMenu();
            setDietaryFilter(dietaryFilter === '100% Eggless' ? 'all' : '100% Eggless');
          }}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors cursor-pointer py-1 px-2.5 rounded-xl ${
            dietaryFilter === '100% Eggless'
              ? 'text-emerald-700 font-extrabold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className="w-5 h-5 rounded-md border-2 border-emerald-600 flex items-center justify-center p-0.5">
            <div className="w-2 h-2 rounded-full bg-emerald-600" />
          </div>
          <span>Eggless</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-1 text-[10px] font-bold text-stone-600 hover:text-[#C85A17] transition-colors cursor-pointer py-1 px-2.5 rounded-xl"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#C85A17] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>

        {/* Admin Dashboard */}
        <button
          onClick={handleAdminClick}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors cursor-pointer py-1 px-2.5 rounded-xl ${
            activeView === 'dashboard' ? 'text-[#C85A17]' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          {isAdmin ? (
            <ShieldCheck className="w-5 h-5 text-[#C85A17]" />
          ) : (
            <LayoutDashboard className="w-5 h-5" />
          )}
          <span>Admin</span>
        </button>
      </nav>
    </>
  );
};
