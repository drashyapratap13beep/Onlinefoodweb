import React from 'react';
import { useBakery } from '../context/BakeryContext';
import { ShoppingBag, Store, LayoutDashboard, Flame, Lock } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    cartCount,
    cartSubtotal,
    setIsCartOpen,
    orders,
    isAdmin,
    setIsLoginModalOpen,
    formatPrice,
  } = useBakery();

  // Count active / in-progress orders for dashboard badge
  const activeOrdersCount = orders.filter(
    (o) => o.status === 'received' || o.status === 'in-oven' || o.status === 'ready'
  ).length;

  const handleDashboardClick = () => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
    } else {
      setActiveView('dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#E8DEC8]">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand identity - Clean without tagline */}
        <div
          onClick={() => setActiveView('store')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#C85A17] to-[#873405] flex items-center justify-center text-white shadow-md shadow-[#C85A17]/25 group-hover:scale-105 transition-transform duration-200">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-amber-100" />
          </div>
          <div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#261D15] group-hover:text-[#C85A17] transition-colors">
              Zaika Darbar
            </span>
          </div>
        </div>

        {/* View Switcher: Storefront vs Owner Dashboard */}
        <div className="flex items-center bg-[#EFE6DA] p-1 rounded-xl border border-[#DED3C4]">
          <button
            onClick={() => setActiveView('store')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[36px] ${
              activeView === 'store'
                ? 'bg-white text-[#261D15] shadow-xs'
                : 'text-[#786457] hover:text-[#261D15]'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-[#C85A17]" />
            <span className="hidden sm:inline">Royal Menu</span>
            <span className="sm:hidden">Menu</span>
          </button>

          <button
            onClick={handleDashboardClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[36px] relative ${
              activeView === 'dashboard'
                ? 'bg-[#261D15] text-[#FAF6F0] shadow-xs'
                : 'text-[#786457] hover:text-[#261D15]'
            }`}
          >
            {!isAdmin ? (
              <Lock className="w-3.5 h-3.5 text-stone-400" />
            ) : (
              <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span className="hidden sm:inline">Admin Dashboard</span>
            <span className="sm:hidden">Admin</span>
            {!isAdmin && (
              <span className="text-[9px] bg-stone-300 text-stone-700 px-1 rounded font-bold">
                Lock
              </span>
            )}
            {isAdmin && activeOrdersCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-amber-500 text-stone-900 rounded-full text-[10px] font-bold">
                {activeOrdersCount}
              </span>
            )}
          </button>
        </div>

        {/* Right Action: Cart Drawer Only (Sign-in option removed) */}
        <div className="flex items-center">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 bg-[#C85A17] hover:bg-[#B04C10] text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-[#C85A17]/25 hover:shadow-lg transition-all cursor-pointer min-h-[38px] active:scale-95"
            aria-label="View shopping cart"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-[#261D15] text-amber-200 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="font-extrabold">
              {cartCount > 0 ? formatPrice(cartSubtotal) : 'Cart'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
