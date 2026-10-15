import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { X, Sparkles, Plus, Image as ImageIcon } from 'lucide-react';
import { CategoryId, DietaryTag } from '../../types/bakery';

const PHOTO_PRESETS = [
  {
    name: 'Royal Dum Biryani',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Rich Butter Chicken / Paneer Makhani',
    url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Tandoori Tikka & Kebabs',
    url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Shahi Royal Mithai & Desserts',
    url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
  },
];

export const NewItemModal: React.FC = () => {
  const { isNewItemModalOpen, setIsNewItemModalOpen, addMenuItem, categories, currency, conversionRate } = useBakery();

  const [name, setName] = useState('');
  const [hindiSubName, setHindiSubName] = useState('');
  const [category, setCategory] = useState<CategoryId>('biryani-rice');
  const [price, setPrice] = useState(currency === 'INR' ? '350' : '4.50');
  const [stockCount, setStockCount] = useState('25');
  const [description, setDescription] = useState('');
  const [ingredientsStr, setIngredientsStr] = useState('Aged Basmati, Desi Ghee, Saffron, Potli Spices, Kashmiri Mirch');
  const [allergensStr, setAllergensStr] = useState('Dairy');
  const [imageUrl, setImageUrl] = useState(PHOTO_PRESETS[0].url);
  const [selectedTags, setSelectedTags] = useState<DietaryTag[]>(['100% Eggless', 'Chef Choice']);

  if (!isNewItemModalOpen) return null;

  const ALL_TAGS: DietaryTag[] = ['100% Eggless', 'Contains Egg', 'Jain Friendly', 'Best Seller', 'Chef Choice', 'Vegan', 'Gluten-Free'];

  const toggleTag = (tag: DietaryTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    const enteredPrice = parseFloat(price) || 10;
    const priceInUSD = currency === 'INR' ? Math.round((enteredPrice / conversionRate) * 100) / 100 : enteredPrice;

    addMenuItem({
      name: name.trim(),
      hindiSubName: hindiSubName.trim() || undefined,
      category,
      description: description.trim(),
      price: priceInUSD,
      imageUrl,
      dietaryTags: selectedTags,
      isEggless: selectedTags.includes('100% Eggless') || selectedTags.includes('Vegan'),
      inStock: true,
      stockCount: parseInt(stockCount, 10) || 10,
      ingredients: ingredientsStr.split(',').map((s) => s.trim()).filter(Boolean),
      allergens: allergensStr.split(',').map((s) => s.trim()).filter(Boolean),
      isFeatured: true,
      bakingScheduleNote: 'Fresh royal kitchen specialty',
    });

    setIsNewItemModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-[#DECDB8] overflow-hidden my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#FAF7F2] p-5 border-b border-[#EBE1D3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#C97A2B] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#231A14]">
                Add Seasonal Vitrine Creation
              </h3>
              <p className="text-xs text-stone-500">
                Immediately updates the online storefront menu and inventory
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNewItemModalOpen(false)}
            className="p-2 rounded-full hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Name & Hindi Subtitle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Dish Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Awadhi Murgh Tikka Biryani"
                className="w-full bg-[#FAF7F2] border border-[#D5C5B2] rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C97A2B]"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Hindi / Culinary Subtitle</label>
              <input
                type="text"
                value={hindiSubName}
                onChange={(e) => setHindiSubName(e.target.value)}
                placeholder="e.g. अवधी मुर्ग टिक्का बिरयानी"
                className="w-full bg-[#FAF7F2] border border-[#D5C5B2] rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C97A2B]"
              />
            </div>
          </div>

          {/* Category, Price, Stock */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="w-full bg-[#FAF7F2] border border-[#D5C5B2] rounded-xl px-3 py-2 text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#C97A2B]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Price ({currency === 'INR' ? '₹ INR' : '$ USD'}) *
              </label>
              <input
                type="number"
                step={currency === 'INR' ? '10' : '0.25'}
                min="1"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#D5C5B2] rounded-xl px-3 py-2 text-stone-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#C97A2B]"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Morning Batch Qty</label>
              <input
                type="number"
                min="1"
                value={stockCount}
                onChange={(e) => setStockCount(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#D5C5B2] rounded-xl px-3 py-2 text-stone-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#C97A2B]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-stone-700 block mb-1">Vitrine Description *</label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the crust, crumb, aromatic notes, and baking technique..."
              className="w-full bg-[#FAF7F2] border border-[#D5C5B2] rounded-xl p-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C97A2B]"
            />
          </div>

          {/* Ingredients & Allergens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Key Ingredients (comma separated)</label>
              <input
                type="text"
                value={ingredientsStr}
                onChange={(e) => setIngredientsStr(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#D5C5B2] rounded-xl px-3 py-2 text-stone-900"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Allergens</label>
              <input
                type="text"
                value={allergensStr}
                onChange={(e) => setAllergensStr(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#D5C5B2] rounded-xl px-3 py-2 text-stone-900"
              />
            </div>
          </div>

          {/* Image Selection Presets */}
          <div>
            <label className="font-bold text-stone-700 block mb-1">Photography Preset</label>
            <div className="grid grid-cols-4 gap-2">
              {PHOTO_PRESETS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setImageUrl(p.url)}
                  className={`p-1 rounded-xl border transition-all cursor-pointer ${
                    imageUrl === p.url
                      ? 'border-[#C97A2B] ring-2 ring-[#C97A2B]'
                      : 'border-stone-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={p.url} alt={p.name} className="w-full h-12 object-cover rounded-lg" />
                  <span className="text-[9px] font-bold block truncate mt-1 text-center">
                    {p.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Badges */}
          <div>
            <label className="font-bold text-stone-700 block mb-1.5">Dietary & Menu Badges</label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                      isSelected
                        ? 'bg-[#2C241E] text-white border-[#2C241E]'
                        : 'bg-[#FAF7F2] border-[#DECFC0] text-stone-700'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#C97A2B] hover:bg-[#B2651F] text-white py-3 rounded-2xl font-bold text-sm shadow-md shadow-[#C97A2B]/20 cursor-pointer transition-colors"
            >
              Add to Live Vitrine Menu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
