import React, { useState, useEffect } from 'react';
import { useBakery } from '../context/BakeryContext';
import {
  X,
  Plus,
  Minus,
  Star,
  ShoppingBag,
  Clock,
  AlertTriangle,
  Check,
} from 'lucide-react';

export const ItemCustomizeModal: React.FC = () => {
  const { selectedItemForDetail, closeItemDetail, addToCart, setIsCartOpen, formatPrice } = useBakery();

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [justAdded, setJustAdded] = useState(false);

  // Initialize options to first choice if any
  useEffect(() => {
    if (selectedItemForDetail) {
      setQuantity(1);
      setSpecialInstructions('');
      setJustAdded(false);

      const initialOpts: Record<string, string> = {};
      if (selectedItemForDetail.customizationOptions) {
        selectedItemForDetail.customizationOptions.forEach((grp) => {
          if (grp.options.length > 0) {
            initialOpts[grp.key] = grp.options[0].value;
          }
        });
      }
      setSelectedOptions(initialOpts);
    }
  }, [selectedItemForDetail]);

  if (!selectedItemForDetail) return null;

  const item = selectedItemForDetail;

  // Calculate dynamic unit price with modifiers
  let unitPrice = item.price;
  const optionsDisplayList: string[] = [];

  if (item.customizationOptions) {
    item.customizationOptions.forEach((grp) => {
      const selectedVal = selectedOptions[grp.key];
      const matchOpt = grp.options.find((o) => o.value === selectedVal);
      if (matchOpt) {
        if (matchOpt.priceModifier) {
          unitPrice += matchOpt.priceModifier;
        }
        optionsDisplayList.push(matchOpt.label);
      }
    });
  }

  const totalPrice = unitPrice * quantity;

  const handleOptionChange = (groupKey: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [groupKey]: value,
    }));
  };

  const handleAddToCart = () => {
    addToCart(
      item,
      quantity,
      selectedOptions,
      optionsDisplayList,
      specialInstructions.trim()
    );

    setJustAdded(true);
    setTimeout(() => {
      closeItemDetail();
      setIsCartOpen(true);
    }, 500);
  };

  const isPureVeg = item.isEggless ?? (item.dietaryTags.includes('100% Eggless') || item.dietaryTags.includes('Vegan'));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] sm:max-h-[88vh] overflow-y-auto shadow-2xl border border-[#E2D5C4] relative flex flex-col my-0 sm:my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center bg-stone-100">
          <div className="w-12 h-1 bg-stone-300 rounded-full" />
        </div>

        {/* Close Button */}
        <button
          onClick={closeItemDetail}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 bg-white/90 hover:bg-white text-stone-700 p-2 rounded-full backdrop-blur-md shadow-md transition-all cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative aspect-[16/9] w-full bg-stone-100 overflow-hidden shrink-0">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Overlaid Badges */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{item.rating}</span>
              <span className="text-stone-300 text-[10px]">({item.reviewsCount} reviews)</span>
            </div>
            {item.inStock ? (
              <span className="bg-emerald-600/95 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                Fresh Batch • {item.stockCount} Available
              </span>
            ) : (
              <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                Sold Out Today
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          {/* Title and Subtitle */}
          <div>
            {item.hindiSubName ? (
              <p className="text-xs font-semibold text-[#C85A17] mb-0.5">
                {item.hindiSubName}
              </p>
            ) : item.frenchSubName ? (
              <p className="text-xs font-serif italic text-[#8F7057] mb-0.5">
                {item.frenchSubName}
              </p>
            ) : null}
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#261D15] leading-snug">
                {item.name}
              </h2>
              {/* Official Indian Food Veg Icon */}
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center bg-white shadow-xs p-0.5 shrink-0 mt-0.5 ${
                  isPureVeg ? 'border-2 border-emerald-600' : 'border-2 border-amber-800'
                }`}
                title={isPureVeg ? '100% Eggless / Pure Veg' : 'Contains Egg'}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    isPureVeg ? 'bg-emerald-600' : 'bg-amber-800'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <span className="font-serif font-extrabold text-xl text-[#C85A17]">
                {formatPrice(item.price)}
              </span>
              <div className="flex flex-wrap gap-1">
                {item.dietaryTags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F4ECE1] text-[#614E40]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#5C4C40] leading-relaxed">
            {item.description}
          </p>

          {/* Baking Schedule Note */}
          {item.bakingScheduleNote && (
            <div className="flex items-center gap-2 bg-[#F9F4EC] border border-[#E7DAC7] p-2.5 rounded-xl text-xs text-[#6F5642]">
              <Clock className="w-4 h-4 text-[#C85A17] shrink-0" />
              <span>{item.bakingScheduleNote}</span>
            </div>
          )}

          {/* Ingredients & Allergens Box */}
          <div className="bg-[#FAF6F0] p-3.5 sm:p-4 rounded-2xl border border-[#E9DFD2] space-y-2 text-xs">
            <div>
              <span className="font-bold text-[#44352A] block mb-1">
                Artisan Ingredients:
              </span>
              <p className="text-[#68574B] leading-relaxed text-[11px] sm:text-xs">
                {item.ingredients.join(' • ')}
              </p>
            </div>
            {item.allergens.length > 0 && (
              <div className="pt-2 border-t border-[#ECE2D5] flex items-start gap-1.5 text-stone-600 text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="font-bold text-stone-700">Allergen Notice:</strong> Contains{' '}
                  {item.allergens.join(', ')}.
                </span>
              </div>
            )}
          </div>

          {/* Customization Options */}
          {item.customizationOptions && item.customizationOptions.length > 0 && (
            <div className="space-y-4 pt-1">
              {item.customizationOptions.map((group) => (
                <div key={group.key} className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#4E3F34] block">
                    {group.title}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {group.options.map((opt) => {
                      const isSelected = selectedOptions[group.key] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleOptionChange(group.key, opt.value)}
                          className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer min-h-[44px] ${
                            isSelected
                              ? 'border-[#C85A17] bg-[#FDF9F3] text-[#261D15] ring-1 ring-[#C85A17]'
                              : 'border-[#DECFC0] bg-white text-[#635348] hover:border-[#C85A17]'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {opt.priceModifier && (
                            <span className="text-[#C85A17] font-bold">
                              +{formatPrice(opt.priceModifier)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Special Instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#4E3F34] block">
              Special Preparation Request (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Extra hot chai, sliced thick, separate packaging..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full bg-[#FAF6F0] border border-[#DDD0BF] rounded-xl px-3.5 py-2 text-xs text-[#261D15] focus:ring-2 focus:ring-[#C85A17]"
            />
          </div>
        </div>

        {/* Modal Sticky Footer */}
        <div className="sticky bottom-0 bg-white border-t border-[#EAE0D2] p-3.5 sm:p-4 flex items-center justify-between gap-3 mt-auto shrink-0">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-[#D5C5B2] rounded-xl bg-[#FAF6F0] p-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-200 disabled:opacity-30 cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-sm text-[#261D15]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(item.stockCount || 20, q + 1))}
              disabled={quantity >= item.stockCount}
              className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-200 disabled:opacity-30 cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddToCart}
            disabled={!item.inStock || justAdded}
            className={`flex-1 py-3 px-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[46px] active:scale-[0.98] ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : item.inStock
                ? 'bg-[#C85A17] hover:bg-[#B04C10] text-white shadow-md shadow-[#C85A17]/25'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Basket!</span>
              </>
            ) : item.inStock ? (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add {quantity} to Order • {formatPrice(totalPrice)}</span>
              </>
            ) : (
              <span>Sold Out Today</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
