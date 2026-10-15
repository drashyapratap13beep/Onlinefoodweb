import React from 'react';
import { useBakery } from '../context/BakeryContext';
import {
  Flame,
  Clock,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Award,
  Coffee,
} from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setSelectedCategory, orderType, setOrderType, formatPrice } = useBakery();

  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#FAF6F0] via-[#F4ECE1] to-[#FAF6F0] pt-6 sm:pt-10 pb-10 sm:pb-16 border-b border-[#E8DEC8]">
      {/* Subtle warm background elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-[#EADCC8]/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 sm:w-80 h-72 sm:h-80 rounded-full bg-[#F5D8B4]/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Story & Call to Actions */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
            {/* Live Handi Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-[#DECDB8] shadow-xs text-xs font-semibold text-[#5A4638]">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C85A17]" />
              </span>
              <span>Live Charcoal Dum Handis • Fresh Unsealed Batch at 12:30 PM</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1E1712] leading-[1.12]">
                Royal Dum Biryani & <br />
                <span className="text-[#C85A17] italic font-normal">
                  Clay Tandoor Feasts.
                </span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-[#5F4E42] max-w-2xl leading-relaxed">
                Authentic slow handi-cooked Dum Biryanis, succulent char-grilled Tandoori Kebabs, 
                24-hour slow simmered Dal Makhani, Old Delhi Butter Chicken, and golden Shahi Mithai. 
                Cooked with royal potli spices, saffron & pure cow ghee.
              </p>
            </div>

            {/* Quick Order Selector Card */}
            <div className="bg-white/95 rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-[#E4D7C7] shadow-sm max-w-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[#F0E6D8] pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A7565]">
                    Order Mode:
                  </span>
                </div>
                <div className="flex items-center bg-[#F4EDE2] p-1 rounded-xl w-full sm:w-auto">
                  <button
                    onClick={() => setOrderType('pickup')}
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      orderType === 'pickup'
                        ? 'bg-[#261D15] text-white shadow-xs'
                        : 'text-[#6B5749] hover:text-[#261D15]'
                    }`}
                  >
                    Quick Pickup (~20m)
                  </button>
                  <button
                    onClick={() => setOrderType('delivery')}
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      orderType === 'delivery'
                        ? 'bg-[#261D15] text-white shadow-xs'
                        : 'text-[#6B5749] hover:text-[#261D15]'
                    }`}
                  >
                    Fast Delivery (₹0 on ₹350+)
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={scrollToMenu}
                  className="flex-1 bg-[#C85A17] hover:bg-[#B04C10] text-white py-3 px-6 rounded-xl sm:rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm shadow-[#C85A17]/25 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order Royal Feast</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory('biryani-rice');
                    scrollToMenu();
                  }}
                  className="bg-[#F8EFE4] hover:bg-[#ECE0D0] text-[#3E2C1F] border border-[#D5C5B2] py-3 px-5 rounded-xl sm:rounded-2xl font-semibold text-sm transition-colors cursor-pointer text-center"
                >
                  Explore Dum Biryanis
                </button>
              </div>
            </div>

            {/* Quality Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1 text-[11px] sm:text-xs text-[#5D4C40]">
              <div className="flex items-center gap-2 bg-[#F3ECE1]/80 px-2.5 sm:px-3 py-2 rounded-xl border border-[#E4D8C8]">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-semibold leading-tight">Pure Cow Ghee & Makhan</span>
              </div>
              <div className="flex items-center gap-2 bg-[#F3ECE1]/80 px-2.5 sm:px-3 py-2 rounded-xl border border-[#E4D8C8]">
                <Flame className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="font-semibold leading-tight">Slow Charcoal Handi Dum</span>
              </div>
              <div className="flex items-center gap-2 bg-[#F3ECE1]/80 px-2.5 sm:px-3 py-2 rounded-xl border border-[#E4D8C8]">
                <Coffee className="w-4 h-4 text-[#C85A17] shrink-0" />
                <span className="font-semibold leading-tight">Kulhad Chai & Kesar Lassi</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Photo Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 aspect-[4/3] sm:aspect-[5/4]">
                <img
                  src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=85"
                  alt="Hyderabadi Dum Biryani with Saffron Basmati"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

                {/* Overlaid Badge */}
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-white/40 shadow-lg flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <div className="text-[10px] font-bold text-[#C85A17] uppercase tracking-wider flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                      Chef's Signature Dum Handi
                    </div>
                    <div className="font-serif font-bold text-stone-900 text-sm sm:text-base truncate">
                      Hyderabadi Dum Gosht Biryani
                    </div>
                    <div className="text-[11px] text-stone-600 truncate">
                      Pure Kashmiri Saffron • Mirchi Salan & Burani Raita
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-base sm:text-lg font-extrabold text-[#C85A17]">
                      {formatPrice(5.18)}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedCategory('biryani-rice');
                        scrollToMenu();
                      }}
                      className="block mt-0.5 text-[11px] font-bold text-stone-800 underline hover:text-[#C85A17] cursor-pointer"
                    >
                      View item
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating secondary badge */}
              <div className="absolute -top-3 -left-3 bg-[#261D15] text-amber-100 p-2.5 sm:p-3 rounded-2xl shadow-xl border border-stone-700 hidden sm:flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-600/30 flex items-center justify-center text-amber-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">Pure Veg (100% Eggless)</p>
                  <p className="text-[10px] text-amber-200/70">Dedicated kitchen & separate ovens</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
