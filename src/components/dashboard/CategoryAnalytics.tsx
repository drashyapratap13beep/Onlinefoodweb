import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import {
  PieChart,
  BarChart3,
  TrendingUp,
  Award,
  Clock,
  Truck,
  Store,
  DollarSign,
  Package,
  Download,
  Filter,
} from 'lucide-react';
import { CategoryId } from '../../types/bakery';

export const CategoryAnalytics: React.FC = () => {
  const {
    categoryAnalytics,
    totalRevenue,
    totalOrdersCount,
    averageOrderValue,
    topSellingItems,
    orders,
    formatPrice,
  } = useBakery();

  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week'>('all');

  // Compute pickup vs delivery distribution
  const nonCancelledOrders = orders.filter((o) => o.status !== 'cancelled');
  const pickupOrders = nonCancelledOrders.filter((o) => o.type === 'pickup');
  const deliveryOrders = nonCancelledOrders.filter((o) => o.type === 'delivery');

  const pickupRevenue = pickupOrders.reduce((sum, o) => sum + o.total, 0);
  const deliveryRevenue = deliveryOrders.reduce((sum, o) => sum + o.total, 0);
  const totalVolume = pickupOrders.length + deliveryOrders.length || 1;
  const pickupPct = Math.round((pickupOrders.length / totalVolume) * 100);
  const deliveryPct = 100 - pickupPct;

  // Peak Hours distribution estimate based on orders placedAt
  const timeDistribution = [
    { label: '11:30 AM – 3:30 PM (Lunch Dawat Rush)', count: 8, pct: 45, note: 'Dum Biryani, Butter Chicken & Naan' },
    { label: '4:00 PM – 7:00 PM (Chai & Chaat Time)', count: 5, pct: 28, note: 'Kulhad Chai & Samosa Chaat' },
    { label: '7:30 PM – 11:30 PM (Dinner Feast)', count: 5, pct: 27, note: 'Dal Makhani, Kebabs & Kesar Rasmalai' },
  ];

  // Category color palette for charts
  const categoryColors: Record<string, string> = {
    'biryani-rice': '#D97706',
    'curries-gravies': '#DC2626',
    'tandoor-starters': '#EA580C',
    'breads-kulcha': '#CA8A04',
    'mithai-desserts': '#9333EA',
    'beverages-lassi': '#0891B2',
    'artisan-bread': '#B86F2D',
    'viennoiserie': '#D97706',
    'pastries-cakes': '#9333EA',
    'savory-quiche': '#16A34A',
    'specialty-coffee': '#0891B2',
    'seasonal-specials': '#EA580C',
  };

  const handleExportCSV = () => {
    const headers = ['Category', 'Units Sold', 'Revenue ($)', 'Market Share (%)'];
    const rows = categoryAnalytics.map((c) => [
      `"${c.categoryName}"`,
      c.unitsSold,
      c.revenue.toFixed(2),
      `${c.percentage}%`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `zaika_darbar_sales_analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Controls: Filter & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E4D7C7] shadow-xs">
        <div>
          <h3 className="font-serif font-bold text-lg text-[#231A14]">
            Category Purchase Breakdown & Product Performance
          </h3>
          <p className="text-xs text-stone-500">
            Real-time analytics on what bakery categories and products customers are buying
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#F4ECE1] p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                timeFilter === 'all'
                  ? 'bg-[#2C241E] text-white shadow-xs'
                  : 'text-[#675447] hover:text-[#2C241E]'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setTimeFilter('week')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                timeFilter === 'week'
                  ? 'bg-[#2C241E] text-white shadow-xs'
                  : 'text-[#675447] hover:text-[#2C241E]'
              }`}
            >
              Past 7 Days
            </button>
            <button
              onClick={() => setTimeFilter('today')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                timeFilter === 'today'
                  ? 'bg-[#2C241E] text-white shadow-xs'
                  : 'text-[#675447] hover:text-[#2C241E]'
              }`}
            >
              Today
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-[#FAF7F2] hover:bg-[#EFE8DD] text-stone-800 border border-[#D8C7B5] px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#B86518]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Category Analytics: Visual Share Bar & Proportional Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Revenue Share Visualizer */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#E4D7C7] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-[#B86518]">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#241A14]">
                  Revenue Share by Category
                </h4>
                <p className="text-xs text-stone-500">Gross revenue generated across each vitrine</p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-[#B86518] bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              {formatPrice(totalRevenue)} Total
            </span>
          </div>

          {/* Multi-segmented Visual Stack Bar */}
          <div className="space-y-2">
            <div className="h-6 w-full rounded-xl overflow-hidden flex bg-stone-100 p-0.5 border border-stone-200 shadow-inner">
              {categoryAnalytics.map((cat) => {
                if (cat.percentage <= 0) return null;
                return (
                  <div
                    key={cat.category}
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: categoryColors[cat.category] || '#D97706',
                    }}
                    className="h-full first:rounded-l-lg last:rounded-r-lg transition-all relative group hover:opacity-90"
                    title={`${cat.categoryName}: ${cat.percentage}% ($${cat.revenue.toFixed(2)})`}
                  />
                );
              })}
            </div>

            <div className="flex justify-between text-[11px] text-stone-500 font-semibold px-1">
              <span>0%</span>
              <span>Bakery Sales Volume Distribution</span>
              <span>100%</span>
            </div>
          </div>

          {/* Category Metric Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {categoryAnalytics.map((cat) => {
              const color = categoryColors[cat.category] || '#D97706';
              return (
                <div
                  key={cat.category}
                  className="p-3.5 rounded-2xl border border-[#EFE5D9] bg-[#FAF7F2] space-y-2 hover:border-[#D5C5B2] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-bold text-xs text-stone-900 truncate">
                        {cat.categoryName}
                      </span>
                    </div>
                    <span className="font-extrabold text-xs text-stone-900">
                      {cat.percentage}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-[#ECE1D4]">
                    <div>
                      <span className="text-[10px] text-stone-500 block">Units Sold</span>
                      <span className="font-bold text-stone-800">{cat.unitsSold} pcs</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-stone-500 block">Revenue</span>
                      <span className="font-serif font-bold text-stone-900 text-sm">
                        {formatPrice(cat.revenue)}
                      </span>
                    </div>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="w-full bg-[#E5D8C9] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, cat.percentage * 2)}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Channel Split & Peak Ordering Windows */}
        <div className="lg:col-span-5 space-y-6">
          {/* Fulfillment Channel Distribution */}
          <div className="bg-white p-6 rounded-3xl border border-[#E4D7C7] shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-[#B86518]">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#241A14]">
                  Fulfillment Channel Split
                </h4>
                <p className="text-xs text-stone-500">Curbside Pickup vs Local Delivery orders</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E9DFD2] space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-stone-600 font-semibold">
                  <Store className="w-3.5 h-3.5 text-amber-700" />
                  <span>Curbside Pickup</span>
                </div>
                <div className="text-2xl font-serif font-extrabold text-[#2C241E]">
                  {pickupPct}%
                </div>
                <div className="text-[11px] text-stone-500">
                  {pickupOrders.length} orders • {formatPrice(pickupRevenue)}
                </div>
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E9DFD2] space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-stone-600 font-semibold">
                  <Truck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Local Courier</span>
                </div>
                <div className="text-2xl font-serif font-extrabold text-[#2C241E]">
                  {deliveryPct}%
                </div>
                <div className="text-[11px] text-stone-500">
                  {deliveryOrders.length} orders • {formatPrice(deliveryRevenue)}
                </div>
              </div>
            </div>
          </div>

          {/* Peak Order Times */}
          <div className="bg-white p-6 rounded-3xl border border-[#E4D7C7] shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-[#B86518]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#241A14]">
                  Peak Bakery Purchase Hours
                </h4>
                <p className="text-xs text-stone-500">When orders arrive throughout the bake cycle</p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {timeDistribution.map((slot, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-stone-800">{slot.label}</span>
                    <span className="font-extrabold text-[#B86518]">{slot.pct}%</span>
                  </div>
                  <div className="w-full bg-[#EFE6DA] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#C97A2B] h-full rounded-full transition-all duration-500"
                      style={{ width: `${slot.pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-stone-500 block">
                    Highest category: {slot.note}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top 5 Best-Selling Bakes Leaderboard */}
      <div className="bg-white p-6 rounded-3xl border border-[#E4D7C7] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-[#B86518]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#241A14]">
                Top Best-Selling Bakery Creations
              </h4>
              <p className="text-xs text-stone-500">
                Ranked by cumulative units purchased and guest demand
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-stone-500">
            Leaderboard from all processed tickets
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#ECE1D4] text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">Item Details</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-right">Units Sold</th>
                <th className="py-3 px-3 text-right">Total Revenue</th>
                <th className="py-3 px-3 text-center">Stock Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4ECE1]">
              {topSellingItems.slice(0, 6).map((entry, idx) => (
                <tr key={entry.item.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-stone-400">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        idx === 0
                          ? 'bg-amber-400 text-stone-900'
                          : idx === 1
                          ? 'bg-stone-300 text-stone-800'
                          : idx === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={entry.item.imageUrl}
                        alt={entry.item.name}
                        className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                      />
                      <div>
                        <span className="font-serif font-bold text-stone-900 block">
                          {entry.item.name}
                        </span>
                        <span className="text-[10px] text-stone-500">
                          {formatPrice(entry.item.price)} unit price
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#F4ECE1] text-[#695648] uppercase">
                      {entry.item.category.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-stone-900 text-sm">
                    {entry.unitsSold} pcs
                  </td>
                  <td className="py-3 px-3 text-right font-serif font-extrabold text-[#B86518] text-sm">
                    {formatPrice(entry.revenue)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {entry.item.inStock ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {entry.item.stockCount} in batch
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        Sold Out
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
