import React, { useState, useMemo } from 'react';
import { useBakery } from '../context/BakeryContext';
import { MenuItemCard } from './MenuItemCard';
import { CategoryId, DietaryTag } from '../types/bakery';
import {
  Search,
  SlidersHorizontal,
  Flame,
  Utensils,
  Sparkles,
  Wheat,
  CakeSlice,
  Coffee,
  UtensilsCrossed,
  X,
  Check,
} from 'lucide-react';

export const MenuSection: React.FC = () => {
  const {
    menuItems,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    dietaryFilter,
    setDietaryFilter,
  } = useBakery();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [egglessOnly, setEgglessOnly] = useState<boolean>(false);

  // Category Icon mapper
  const renderCategoryIcon = (id: string, className = 'w-4 h-4') => {
    switch (id) {
      case 'biryani-rice':
        return <Flame className={className} />;
      case 'curries-gravies':
        return <Utensils className={className} />;
      case 'tandoor-starters':
        return <Sparkles className={className} />;
      case 'breads-kulcha':
        return <Wheat className={className} />;
      case 'mithai-desserts':
        return <CakeSlice className={className} />;
      case 'beverages-lassi':
        return <Coffee className={className} />;
      default:
        return <UtensilsCrossed className={className} />;
    }
  };

  const DIETARY_OPTIONS: (DietaryTag | 'all')[] = [
    'all',
    'Best Seller',
    'Chef Choice',
    '100% Eggless',
    'Jain Friendly',
    'Vegan',
    'Gluten-Free',
  ];

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Eggless toggle filter (super popular in India)
      if (egglessOnly && !item.isEggless && !item.dietaryTags.includes('100% Eggless') && !item.dietaryTags.includes('Vegan')) {
        return false;
      }
      // Dietary filter
      if (dietaryFilter !== 'all' && !item.dietaryTags.includes(dietaryFilter)) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesHindi = item.hindiSubName?.toLowerCase().includes(q) || false;
        const matchesFrench = item.frenchSubName?.toLowerCase().includes(q) || false;
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesIngredients = item.ingredients.some((ing) => ing.toLowerCase().includes(q));
        if (!matchesName && !matchesHindi && !matchesFrench && !matchesDesc && !matchesIngredients) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: featured first, then in-stock first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0);
    });
  }, [menuItems, selectedCategory, egglessOnly, dietaryFilter, searchQuery, sortBy]);

  // Current category details
  const activeCategoryInfo = categories.find((c) => c.id === selectedCategory);

  return (
    <section id="menu-section" className="py-8 sm:py-12 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-2">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C85A17]">
          Slow Charcoal Dum & Clay Tandoor
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#261D15] tracking-tight">
          The Royal Dawat Menu
        </h2>
        <p className="text-xs sm:text-sm text-[#6A574A] max-w-lg mx-auto">
          Fragrant Handi Dum Biryanis, sizzling Clay Tandoori Kebabs, 24h Dal Makhani, fresh Naans and rich Royal Mithai.
        </p>
      </div>

      {/* Category Tabs: Smooth Horizontal Scroll on Mobile with Swipe indicator */}
      <div className="relative mb-5">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-3 no-scrollbar scroll-smooth">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer min-h-[44px] shrink-0 border ${
              selectedCategory === 'all'
                ? 'bg-[#261D15] text-white border-[#261D15] shadow-md shadow-stone-900/10'
                : 'bg-white text-[#5F4E42] border-[#E8DEC8] hover:border-[#C85A17] hover:bg-[#FDFBF7]'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>All Dishes</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                selectedCategory === 'all'
                  ? 'bg-stone-700 text-stone-200'
                  : 'bg-stone-100 text-stone-700'
              }`}
            >
              {menuItems.length}
            </span>
          </button>

          {categories.map((cat) => {
            const count = menuItems.filter((i) => i.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer min-h-[44px] shrink-0 border ${
                  isSelected
                    ? 'bg-[#261D15] text-white border-[#261D15] shadow-md shadow-stone-900/10'
                    : 'bg-white text-[#5F4E42] border-[#E8DEC8] hover:border-[#C85A17] hover:bg-[#FDFBF7]'
                }`}
              >
                {renderCategoryIcon(cat.id, `w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-[#C85A17]'}`)}
                <span>{cat.name}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isSelected ? 'bg-stone-700 text-stone-200' : 'bg-[#F2ECE1] text-stone-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Category Description Banner */}
      {activeCategoryInfo && (
        <div className="bg-[#F6EFE6] border border-[#E4D7C7] rounded-2xl p-3.5 sm:p-4 mb-5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-[#B85D19]">
              {renderCategoryIcon(activeCategoryInfo.id, 'w-5 h-5')}
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#261D15]">
                {activeCategoryInfo.name}
              </h3>
              <p className="text-xs text-[#6B5749]">{activeCategoryInfo.tagline}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-xs font-bold text-[#C85A17] hover:underline cursor-pointer shrink-0 ml-2"
          >
            Show All
          </button>
        </div>
      )}

      {/* Search, Dietary Filter & Sort Controls */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-[#E8DEC8] shadow-xs mb-8 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search Biryani, Butter Chicken, Paneer Tikka, Garlic Naan, Rasmalai, Kulhad Chai..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF6F0] border border-[#DFD4C4] rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-[#261D15] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#C85A17] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 justify-between md:justify-end">
            {/* Pure Veg / 100% Eggless Quick Switcher Toggle */}
            <button
              onClick={() => setEgglessOnly(!egglessOnly)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                egglessOnly
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                  : 'bg-white border-[#DFD4C4] text-[#635345] hover:border-emerald-500'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-xs border-2 flex items-center justify-center p-0.5 ${
                  egglessOnly ? 'border-emerald-600 bg-white' : 'border-stone-400'
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    egglessOnly ? 'bg-emerald-600' : 'bg-transparent'
                  }`}
                />
              </div>
              <span className="whitespace-nowrap">Pure Veg Only</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500 hidden sm:inline" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#FAF6F0] border border-[#DFD4C4] rounded-xl px-2.5 py-2 text-xs text-[#261D15] font-semibold focus:outline-none focus:ring-2 focus:ring-[#C85A17] cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="rating">Top Rated (★)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dietary Pills filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            Dietary:
          </span>
          {DIETARY_OPTIONS.map((tag) => {
            const isSelected = dietaryFilter === tag;
            return (
              <button
                key={tag}
                onClick={() => setDietaryFilter(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#C85A17] text-white shadow-xs'
                    : 'bg-[#F5EFE6] text-[#635345] hover:bg-[#EAE0D3]'
                }`}
              >
                {tag === 'all' ? 'All Diets' : tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Dishes */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E8DEC8] p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF6F0] text-stone-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#261D15]">
            No Dishes Match Your Search
          </h3>
          <p className="text-xs text-[#7A695C] max-w-sm mx-auto">
            Try adjusting your search terms or turning off the Pure Veg filter to see more royal Indian delicacies.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setEgglessOnly(false);
              setDietaryFilter('all');
            }}
            className="mt-2 bg-[#261D15] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#3D2E22] transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
};
