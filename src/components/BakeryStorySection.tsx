import React from 'react';
import { Utensils, Award, Flame, HeartHandshake, MapPin, Phone, Mail, Coffee } from 'lucide-react';

export const BakeryStorySection: React.FC = () => {
  return (
    <section className="bg-[#F5ECE0] border-y border-[#DECDB8] py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        {/* Story Intro */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C85A17]">
            The Royal Culinary Heritage
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#261D15]">
            Potli Spices, Charcoal & Saffron
          </h2>
          <p className="text-xs sm:text-sm text-[#665345] leading-relaxed">
            Zaika Darbar was founded to honor timeless royal Indian culinary traditions. 
            From slow charcoal handis sealed with dough for authentic Awadhi dum cooking, 
            to red-hot clay tandoors and slow-simmered rich curries enriched with pure cow ghee and Kashmiri saffron.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-[#E4D7C7] shadow-xs space-y-2.5">
            <div className="w-11 h-11 rounded-xl bg-[#F8EFE4] text-[#C85A17] flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#241A14]">
              Hand-Pounded Potli Spices
            </h3>
            <p className="text-xs text-[#6B5A4E] leading-relaxed">
              We grind whole green cardamom, star anise, mace, cinnamon, and stone-flowers in small batches. 
              Zero artificial colors or preservatives.
            </p>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-[#E4D7C7] shadow-xs space-y-2.5">
            <div className="w-11 h-11 rounded-xl bg-[#F8EFE4] text-[#C85A17] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#241A14]">
              Pure Cow Ghee & White Makhan
            </h3>
            <p className="text-xs text-[#6B5A4E] leading-relaxed">
              Every biryani, dal makhani, and tandoori paratha is finished with slow-churned pure cow ghee 
              and fresh dairy butter for authentic royal richness.
            </p>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-[#E4D7C7] shadow-xs space-y-2.5">
            <div className="w-11 h-11 rounded-xl bg-[#F8EFE4] text-[#C85A17] flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#241A14]">
              Clay Tandoor & Charcoal Dum
            </h3>
            <p className="text-xs text-[#6B5A4E] leading-relaxed">
              Natural clay ovens fired with natural charcoal wood give our kebabs and naans their signature 
              smoky char, while sealed handis lock in aromatic steam.
            </p>
          </div>
        </div>

        {/* Visit Us Card with Indian locations */}
        <div className="bg-[#261D15] text-[#FAF6F0] rounded-3xl p-5 sm:p-8 border border-stone-800 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center shadow-xl">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
              Visit Zaika Darbar Royal Dawat Hall
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
              Experience Live Charcoal Tandoor & Dum Handis
            </h3>
            <p className="text-xs sm:text-sm text-[#D5C6BA] max-w-xl leading-relaxed">
              Watch our master Khansamas stretch paper-thin Roomali Roti in the air, pull sizzling 
              kebabs from the glowing clay pit, and break the wheat-dough seal on steaming pots of Dum Biryani.
            </p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2.5 sm:gap-4 pt-1 text-xs text-[#EADFCF]">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#C85A17] shrink-0" />
                <span>14th Road, Off Linking Road, Bandra West, Mumbai 400050</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#C85A17] shrink-0" />
                <span>+91 98200 45890</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white/5 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10 space-y-2 text-xs">
            <div className="font-bold text-amber-200 uppercase tracking-wider text-[11px]">
              Dawat & Delivery Timings
            </div>
            <div className="flex justify-between py-1 border-b border-white/10">
              <span className="text-stone-300">Lunch Dawat</span>
              <span className="font-semibold text-white">11:30 AM – 4:00 PM</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/10">
              <span className="text-stone-300">Evening Chai & Chaat</span>
              <span className="font-semibold text-white">4:00 PM – 7:00 PM</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-stone-300">Royal Dinner</span>
              <span className="font-semibold text-white">7:00 PM – 11:45 PM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
