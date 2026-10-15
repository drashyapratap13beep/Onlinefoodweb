import React from 'react';
import { MenuItem } from '../types/bakery';
import { useBakery } from '../context/BakeryContext';
import { Star, Plus, Minus, SlidersHorizontal, Sparkles } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const { openItemDetail, addToCart, updateCartQuantity, cart, formatPrice } = useBakery();

  const hasOptions = item.customizationOptions && item.customizationOptions.length > 0;
  
  // Find if already added to cart
  const inCartItems = cart.filter((ci) => ci.menuItem.id === item.id);
  const totalInCart = inCartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.inStock) return;
    if (hasOptions) {
      openItemDetail(item);
    } else {
      addToCart(item, 1);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasOptions) {
      openItemDetail(item);
    } else if (inCartItems.length > 0) {
      updateCartQuantity(inCartItems[0].cartItemId, 1);
    } else {
      addToCart(item, 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inCartItems.length > 0) {
      updateCartQuantity(inCartItems[0].cartItemId, -1);
    }
  };

  // Indian Veg / Eggless indicator
  const isPureVeg = item.isEggless ?? (item.dietaryTags.includes('100% Eggless') || item.dietaryTags.includes('Vegan'));

  return (
    <div
      onClick={() => openItemDetail(item)}
      className={`group bg-white rounded-2xl sm:rounded-3xl border transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden cursor-pointer select-none touch-press ${
        item.inStock
          ? 'border-[#E8DEC8] hover:border-[#C85A17] hover:shadow-xl hover:-translate-y-1'
          : 'border-stone-200 opacity-65'
      }`}
    >
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-[16/11] sm:aspect-[4/3] w-full overflow-hidden bg-[#F5EFE6]">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Sold out overlay */}
          {!item.inStock && (
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <span className="bg-rose-600 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-full tracking-wider shadow-md">
                Sold Out Today
              </span>
            </div>
          )}

          {/* Stock countdown if low */}
          {item.inStock && item.stockCount <= 6 && (
            <div className="absolute top-2.5 left-2.5 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              Only {item.stockCount} left!
            </div>
          )}

          {/* Indian Veg / Non-Veg FSSAI Symbol + Badges */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
            {/* Official Indian Food Veg / Non-Veg Icon */}
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center bg-white/95 shadow-md p-0.5 ${
                isPureVeg ? 'border-2 border-emerald-600' : 'border-2 border-amber-800'
              }`}
              title={isPureVeg ? '100% Eggless / Pure Veg' : 'Contains Egg'}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isPureVeg ? 'bg-emerald-600' : 'bg-amber-800'
                }`}
              />
            </div>

            {/* Best Seller / Chef Choice */}
            {item.dietaryTags.includes('Best Seller') && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm bg-amber-400 text-stone-900">
                Best Seller
              </span>
            )}
            {!item.dietaryTags.includes('Best Seller') && item.dietaryTags.includes('Chef Choice') && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm bg-[#1E1712] text-amber-200">
                Chef Choice
              </span>
            )}
          </div>

          {/* Rating badge */}
          <div className="absolute bottom-2.5 left-2.5 bg-black/65 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{item.rating}</span>
            <span className="text-stone-300 text-[10px]">({item.reviewsCount})</span>
          </div>

          {/* Eggless badge text for instant Indian customer trust */}
          <div className="absolute bottom-2.5 right-2.5">
            {isPureVeg && (
              <span className="bg-emerald-950/75 backdrop-blur-sm text-emerald-200 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border border-emerald-400/40">
                Pure Veg
              </span>
            )}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-3.5 sm:p-4 space-y-1.5">
          {item.hindiSubName ? (
            <p className="text-[11px] font-semibold text-[#C85A17] tracking-wide line-clamp-1">
              {item.hindiSubName}
            </p>
          ) : item.frenchSubName ? (
            <p className="text-[11px] font-serif italic text-[#96633E] tracking-wide line-clamp-1">
              {item.frenchSubName}
            </p>
          ) : null}

          <h3 className="font-serif font-bold text-base sm:text-lg text-[#261D15] group-hover:text-[#C85A17] transition-colors leading-snug line-clamp-2">
            {item.name}
          </h3>

          <p className="text-xs text-[#635347] line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {item.bakingScheduleNote && (
            <div className="text-[10px] text-amber-900 bg-amber-50/80 rounded-lg px-2 py-1 border border-amber-200/60 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
              <span className="truncate">{item.bakingScheduleNote}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Price & Swiggy-style Butter Smooth Stepper */}
      <div className="px-3.5 sm:px-4 pb-3.5 sm:pb-4 pt-2 border-t border-[#F2EAE0] flex items-center justify-between gap-2 mt-auto">
        <div>
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
            Price
          </span>
          <span className="font-serif font-extrabold text-lg sm:text-xl text-[#261D15]">
            {formatPrice(item.price)}
          </span>
        </div>

        {/* Interactive Add or Quantity Stepper */}
        {totalInCart > 0 && !hasOptions ? (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center bg-[#C85A17] text-white rounded-xl shadow-sm overflow-hidden"
          >
            <button
              onClick={handleDecrement}
              className="p-2 sm:px-2.5 sm:py-2 hover:bg-[#A8450D] active:scale-90 transition-all cursor-pointer flex items-center justify-center min-w-[34px] min-h-[34px]"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-bold text-xs min-w-[20px] text-center">
              {totalInCart}
            </span>
            <button
              onClick={handleIncrement}
              disabled={!item.inStock || totalInCart >= item.stockCount}
              className="p-2 sm:px-2.5 sm:py-2 hover:bg-[#A8450D] active:scale-90 transition-all cursor-pointer flex items-center justify-center min-w-[34px] min-h-[34px] disabled:opacity-50"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleQuickAdd}
            disabled={!item.inStock}
            className={`flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer min-h-[40px] ${
              item.inStock
                ? 'bg-[#F5EBE1] hover:bg-[#C85A17] text-[#3E2C1F] hover:text-white shadow-xs active:scale-95'
                : 'bg-stone-100 text-stone-400 cursor-not-allowed'
            }`}
          >
            {hasOptions ? (
              <>
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Customize</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
