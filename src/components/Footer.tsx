import React from 'react';
import { useBakery } from '../context/BakeryContext';
import { Flame, RotateCcw, LayoutDashboard, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setSelectedCategory, setActiveView, resetAllDataToDefault } = useBakery();

  const handleCategoryClick = (catId: any) => {
    setActiveView('store');
    setSelectedCategory(catId);
    const el = document.getElementById('menu-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#18120D] text-[#E0D4C8] pt-12 pb-24 md:pb-12 border-t border-[#2D2118]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#C85A17] text-white flex items-center justify-center shadow-md">
                <Flame className="w-4 h-4 text-amber-200" />
              </div>
              <span className="font-serif text-xl font-bold text-white tracking-tight">
                Zaika Darbar
              </span>
            </div>
            <p className="text-xs text-[#A8988B] leading-relaxed">
              Authentic royal Indian dining: slow handi-cooked Dum Biryanis, charcoal clay tandoori kebabs, 
              24h Dal Makhani, and royal handmade sweets in Mumbai & Delhi NCR.
            </p>
            <div className="text-[11px] text-[#8C7A6D]">
              FSSAI Certified • 100% Pure Cow Ghee • Authentic Potli Spices
            </div>
          </div>

          {/* Col 2: Menu Categories */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Royal Menu
            </h4>
            <ul className="space-y-1.5 text-[#BBAAA0]">
              <li>
                <button
                  onClick={() => handleCategoryClick('biryani-rice')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Dum Biryani & Pulao
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('curries-gravies')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Butter Chicken & Dal Makhani
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('tandoor-starters')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Tandoori Kebabs & Chaat
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('breads-kulcha')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Garlic Butter Naan & Kulcha
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('mithai-desserts')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Gulab Jamun & Rasmalai
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('beverages-lassi')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Kulhad Chai & Mango Lassi
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Hours & Location */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Dawat Halls
            </h4>
            <p className="text-[#BBAAA0]">
              <strong>Mumbai Flagship:</strong><br />
              14th Road, Bandra West, Mumbai 400050<br />
              Tel: +91 98200 45890
            </p>
            <p className="text-[#BBAAA0] pt-1">
              <strong>Delhi NCR Darbar:</strong><br />
              Golf Links, Near Khan Market, New Delhi 110003
            </p>
            <p className="text-[11px] text-amber-300 pt-1">
              Email: namaste@zaikadarbar.in
            </p>
          </div>

          {/* Col 4: Management & Tools */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Restaurant Administration
            </h4>
            <p className="text-[#A8988B] text-[11px]">
              Kitchen manager console for live orders, inventory stock counters, and category sales analytics.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => setActiveView('dashboard')}
                className="w-full bg-[#261D15] hover:bg-stone-800 text-amber-200 border border-stone-700 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-95"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                <span>Open Kitchen Admin Dashboard</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Reset all demo orders and menu inventory to original authentic Indian dining state?')) {
                    resetAllDataToDefault();
                  }
                }}
                className="w-full text-stone-500 hover:text-stone-300 py-1 text-[10px] flex items-center justify-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Demo Orders & Stock</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[#291E16] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#7A695C] gap-2 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} Zaika Darbar Royal Indian Kitchens Pvt. Ltd. Crafted with royal heritage.
          </div>
          <div className="flex items-center gap-1">
            <span>Made with pure cow ghee, slow charcoal dum & royal saffron</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
