import React from 'react';
import { Flame, Clock } from 'lucide-react';

export const BakingScheduleTicker: React.FC = () => {
  const schedule = [
    { time: '11:45 AM', item: 'Awadhi & Hyderabadi Dum Biryanis', status: 'Charcoal Handi Unsealed', isHot: true },
    { time: '12:30 PM', item: 'Clay Tandoori Murgh & Paneer Tikka', status: 'Char-Grilled & Sizzling', isHot: true },
    { time: '1:15 PM', item: 'Garlic Butter Naan & Amritsari Kulcha', status: 'Puffing in Clay Tandoor', isHot: true },
    { time: '4:30 PM', item: 'Kulhad Masala Chai & Samosa Chaat', status: 'Evening Chai Time Hot', isHot: true },
    { time: '7:45 PM', item: '24h Dal Makhani & Shahi Feast', status: 'Slow Charcoal Simmering', isHot: false },
  ];

  return (
    <div className="bg-[#1C1510] text-[#F3EAE0] py-3.5 border-y border-[#35281E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Flame className="w-4 h-4 text-[#DE6B1F]" />
            </div>
            <div>
              <span className="font-serif font-bold text-sm tracking-wide text-amber-200">
                Live Tandoor & Handi Dum Timings
              </span>
              <p className="text-[10px] text-[#BBAAA0]">
                Fresh handis unsealed and clay tandoor fired live on order
              </p>
            </div>
          </div>

          {/* Schedule list with smooth scroll on mobile */}
          <div className="flex md:grid md:grid-cols-5 gap-2.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            {schedule.map((item, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-xs transition-colors shrink-0 w-44 md:w-auto ${
                  item.isHot
                    ? 'bg-amber-950/40 border-amber-600/60 shadow-xs'
                    : 'bg-[#150F0B] border-[#2E2017]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold text-[10px] text-amber-300 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </span>
                  {item.isHot && (
                    <span className="bg-[#DE6B1F] text-white font-extrabold text-[8px] px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                      Hot Now
                    </span>
                  )}
                </div>
                <div className="font-semibold text-[11px] text-white truncate" title={item.item}>
                  {item.item}
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">{item.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
