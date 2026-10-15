import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import {
  Plus,
  Search,
  Check,
  X,
  AlertTriangle,
  Minus,
  Trash2,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';
import { CategoryId } from '../../types/bakery';

export const InventoryManager: React.FC = () => {
  const {
    menuItems,
    categories,
    toggleItemStock,
    updateItemStockCount,
    setIsNewItemModalOpen,
    formatPrice,
    deleteDish,
    currency,
  } = useBakery();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<CategoryId | 'all'>('all');

  const filteredItems = menuItems.filter((item) => {
    if (selectedCat !== 'all' && item.category !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
        item.name.toLowerCase().includes(q) ||
        (item.hindiSubName && item.hindiSubName.toLowerCase().includes(q)) ||
        (item.frenchSubName && item.frenchSubName.toLowerCase().includes(q))
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E4D7C7] shadow-xs">
        <div>
          <h3 className="font-serif font-bold text-lg text-[#231A14]">
            Vitrine Dishes & Daily Batch Control
          </h3>
          <p className="text-xs text-stone-500">
            Admin powers: Add new dishes, adjust daily batch quantities, delete items, and set availability. Prices currently in <strong>{currency}</strong>.
          </p>
        </div>

        <button
          onClick={() => setIsNewItemModalOpen(true)}
          className="bg-[#C97A2B] hover:bg-[#B2651F] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish / Bake</span>
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="bg-white p-3 rounded-2xl border border-[#E4D7C7] flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search vitrine items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-[#D5C5B2] rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#C97A2B]"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCat === 'all'
                ? 'bg-[#2C241E] text-white'
                : 'bg-[#FAF7F2] text-stone-600 hover:bg-[#EAE0D3]'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCat === c.id
                  ? 'bg-[#2C241E] text-white'
                  : 'bg-[#FAF7F2] text-stone-600 hover:bg-[#EAE0D3]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-[#E4D7C7] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8DEC8] bg-[#FAF7F2] text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Item & Vitrine</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4 text-center">Batch Quantity</th>
                <th className="py-3 px-4 text-center">Live Status</th>
                <th className="py-3 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4ECE1]">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                  {/* Photo & Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                      />
                      <div>
                        <span className="font-serif font-bold text-stone-900 block text-sm">
                          {item.name}
                        </span>
                        {item.frenchSubName && (
                          <span className="text-[10px] italic text-[#8B6E57]">
                            {item.frenchSubName}
                          </span>
                        )}
                        <div className="flex gap-1 mt-0.5">
                          {item.dietaryTags.slice(0, 2).map((t, i) => (
                            <span
                              key={i}
                              className="text-[9px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 font-medium"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F4ECE1] text-[#695648] uppercase">
                      {item.category.replace('-', ' ')}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-serif font-bold text-stone-900 text-sm">
                    {formatPrice(item.price)}
                  </td>

                  {/* Batch Quantity Stepper */}
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center border border-[#DECFC0] bg-[#FAF7F2] rounded-xl p-0.5">
                      <button
                        onClick={() => updateItemStockCount(item.id, item.stockCount - 1)}
                        disabled={item.stockCount <= 0}
                        className="p-1 hover:bg-stone-200 text-stone-700 rounded disabled:opacity-30 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-9 text-center font-bold text-xs text-stone-900">
                        {item.stockCount}
                      </span>
                      <button
                        onClick={() => updateItemStockCount(item.id, item.stockCount + 1)}
                        className="p-1 hover:bg-stone-200 text-stone-700 rounded cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Status Indicator */}
                  <td className="py-3 px-4 text-center">
                    {item.inStock ? (
                      item.stockCount <= 5 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Low Stock ({item.stockCount})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" />
                          In Vitrine
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        <X className="w-3 h-3 text-rose-600" />
                        Sold Out
                      </span>
                    )}
                  </td>

                  {/* Admin Actions: Toggle stock & Delete Dish */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleItemStock(item.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          item.inStock
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                        }`}
                      >
                        {item.inStock ? 'Mark Sold Out' : 'Restock'}
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${item.name}" from the bakery menu?`)) {
                            deleteDish(item.id);
                          }
                        }}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete dish from menu"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
