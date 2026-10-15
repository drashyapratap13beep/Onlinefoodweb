import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { CategoryAnalytics } from './CategoryAnalytics';
import { OrdersManager } from './OrdersManager';
import { InventoryManager } from './InventoryManager';
import { NewItemModal } from './NewItemModal';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Award,
  Layers,
  Store,
  Flame,
  Plus,
  ArrowLeft,
  Database,
  Lock,
  Coins,
  RefreshCw,
  LogOut,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    activeDashboardTab,
    setActiveDashboardTab,
    setActiveView,
    totalRevenue,
    totalOrdersCount,
    averageOrderValue,
    categoryAnalytics,
    orders,
    simulateNewOrder,
    isAdmin,
    currentUser,
    setIsLoginModalOpen,
    logout,
    currency,
    setCurrency,
    conversionRate,
    formatPrice,
  } = useBakery();

  // ACCESS GUARD: If not logged in as Admin, lock dashboard completely!
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#FAF7F2]">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-xl border border-[#DECDB8] text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto border border-rose-200">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              Admin Access Required
            </span>
            <h2 className="font-serif font-bold text-2xl text-stone-900 mt-2">
              Dashboard is Locked
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
              Only bakery administrators and head bakers can access the sales analytics, 
              category purchase breakdown, live kitchen queue, and dish controls.
            </p>
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full bg-[#C97A2B] hover:bg-[#B2651F] text-white py-3 px-4 rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              Sign In as Administrator
            </button>
            <button
              onClick={() => setActiveView('store')}
              className="w-full bg-[#FAF7F2] hover:bg-stone-200 text-stone-800 py-2.5 px-4 rounded-xl font-semibold text-xs border border-stone-300 transition-colors cursor-pointer"
            >
              Return to Bakery Vitrine
            </button>
          </div>
        </div>
      </div>
    );
  }

  const topCategory = categoryAnalytics[0];
  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'received' || o.status === 'in-oven'
  ).length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-16">
      {/* Top Stack & Operational Banner */}
      <div className="bg-[#2C241E] text-[#FAF7F2] border-b border-stone-800 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <button
                  onClick={() => setActiveView('store')}
                  className="flex items-center gap-1 text-xs text-amber-300 hover:text-white transition-colors cursor-pointer mr-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Public Storefront</span>
                </button>
                <span className="text-[10px] font-mono uppercase tracking-wider bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1 font-bold">
                  <Database className="w-3 h-3 text-emerald-400" />
                  MERN STACK • Admin Session Active
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
                Zaika Darbar Kitchen Operations & Sales Analytics
              </h1>
              <p className="text-xs text-[#DECBC0]">
                Logged in as <strong>{currentUser?.name}</strong>. Real-time dining analytics, live tandoor & handi orders & inventory controls.
              </p>
            </div>

            {/* Currency Changer & Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Currency Selector (Admin can change dollar into inr) */}
              <div className="bg-stone-800/90 border border-stone-700 p-1.5 rounded-xl flex items-center gap-2 text-xs">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider pl-1">
                  Currency:
                </span>
                <div className="flex bg-stone-900 rounded-lg p-0.5">
                  <button
                    onClick={() => setCurrency('INR')}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                      currency === 'INR'
                        ? 'bg-amber-500 text-stone-950 shadow-xs'
                        : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    ₹ INR
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                      currency === 'USD'
                        ? 'bg-amber-500 text-stone-950 shadow-xs'
                        : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    $ USD
                  </button>
                </div>
              </div>

              <button
                onClick={() => simulateNewOrder()}
                className="bg-[#C97A2B] hover:bg-[#B2651F] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Simulate Order</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  setActiveView('store');
                }}
                className="bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-stone-700 transition-colors cursor-pointer"
                title="Log out and return to menu"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {/* Total Revenue */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-stone-300">
                <span className="font-medium">Total Bakery Sales</span>
                <Coins className="w-4 h-4 text-amber-400" />
              </div>
              <div className="font-serif font-extrabold text-2xl text-white">
                {formatPrice(totalRevenue)}
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Gross revenue in {currency}</span>
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-stone-300">
                <span className="font-medium">Completed Tickets</span>
                <ShoppingBag className="w-4 h-4 text-amber-400" />
              </div>
              <div className="font-serif font-extrabold text-2xl text-white">
                {totalOrdersCount}
              </div>
              <div className="text-[10px] text-amber-300 font-semibold">
                {pendingOrdersCount} orders currently in kitchen
              </div>
            </div>

            {/* Average Order Value */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-stone-300">
                <span className="font-medium">Average Ticket (AOV)</span>
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <div className="font-serif font-extrabold text-2xl text-white">
                {formatPrice(averageOrderValue)}
              </div>
              <div className="text-[10px] text-stone-400">
                Per customer basket average
              </div>
            </div>

            {/* Top Category Purchased */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-stone-300">
                <span className="font-medium">Top Category Purchased</span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div className="font-serif font-extrabold text-xl text-white truncate">
                {topCategory ? topCategory.categoryName : 'Artisan Bread'}
              </div>
              <div className="text-[10px] text-amber-300 font-semibold">
                {topCategory ? `${topCategory.percentage}% of bakery sales` : 'Leading category'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation & Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Tab Switcher Pills */}
        <div className="flex border-b border-[#DECDB8] gap-4">
          <button
            onClick={() => setActiveDashboardTab('analytics')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeDashboardTab === 'analytics'
                ? 'border-[#C97A2B] text-[#1F1712]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[#C97A2B]" />
            <span>Category Sales Breakdown & Purchase Analytics</span>
          </button>

          <button
            onClick={() => setActiveDashboardTab('orders')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeDashboardTab === 'orders'
                ? 'border-[#C97A2B] text-[#1F1712]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#C97A2B]" />
            <span>Kitchen Kanban & Live Orders</span>
            {pendingOrdersCount > 0 && (
              <span className="bg-amber-600 text-white text-[10px] font-extrabold px-2 py-0.2 rounded-full">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveDashboardTab('inventory')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeDashboardTab === 'inventory'
                ? 'border-[#C97A2B] text-[#1F1712]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Layers className="w-4 h-4 text-[#C97A2B]" />
            <span>Dishes, Inventory & Batch Levels</span>
          </button>
        </div>

        {/* Tab Content Panes */}
        {activeDashboardTab === 'analytics' && <CategoryAnalytics />}
        {activeDashboardTab === 'orders' && <OrdersManager />}
        {activeDashboardTab === 'inventory' && <InventoryManager />}
      </div>

      {/* New Item Modal */}
      <NewItemModal />
    </div>
  );
};
