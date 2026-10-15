import React from 'react';
import { useBakery } from '../context/BakeryContext';
import {
  X,
  Clock,
  CheckCircle2,
  Flame,
  Package,
  ShoppingBag,
  Truck,
  Store,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { OrderStatus } from '../types/bakery';

export const OrderTrackerModal: React.FC = () => {
  const { trackedOrder, setTrackedOrder, updateOrderStatus, formatPrice } = useBakery();

  if (!trackedOrder) return null;

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    {
      key: 'received',
      label: 'Order Received',
      desc: 'Ticket queued for head baker review',
    },
    {
      key: 'in-oven',
      label: 'On Tandoor & Dum Handi',
      desc: 'Simmering in charcoal handi & charred in clay tandoor',
    },
    {
      key: 'ready',
      label: trackedOrder.type === 'pickup' ? 'Ready for Dawat Pickup' : 'Packed for Fast Delivery',
      desc: trackedOrder.type === 'pickup' ? 'Waiting warm at Zaika Darbar dispatch counter' : 'Dispatched with city express delivery partner',
    },
    {
      key: 'completed',
      label: 'Enjoyed / Completed',
      desc: 'Order hand-delivered to customer',
    },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'received':
        return 0;
      case 'in-oven':
        return 1;
      case 'ready':
        return 2;
      case 'completed':
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(trackedOrder.status);

  // Helper to advance status for interactive demonstration
  const handleSimulateNextStage = () => {
    const sequence: OrderStatus[] = ['received', 'in-oven', 'ready', 'completed'];
    const nextIdx = (currentStepIdx + 1) % sequence.length;
    updateOrderStatus(trackedOrder.id, sequence[nextIdx]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl max-w-xl w-full shadow-2xl border border-[#DECDB8] overflow-hidden my-0 sm:my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#FAF7F2] p-5 border-b border-[#EBE1D3] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#2C241E] text-amber-200">
                #{trackedOrder.id}
              </span>
              <span className="text-xs font-bold uppercase tracking-wide text-stone-500">
                {trackedOrder.type === 'pickup' ? 'Curbside Pickup' : 'Local Courier'}
              </span>
            </div>
            <h2 className="font-serif font-bold text-xl text-[#231A14] mt-1">
              Live Baking & Fulfillment Tracker
            </h2>
          </div>
          <button
            onClick={() => setTrackedOrder(null)}
            className="p-2 rounded-full hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Stepper */}
        <div className="p-6 space-y-6">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200">
            {steps.map((step, idx) => {
              const isDone = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              const isFuture = idx > currentStepIdx;

              return (
                <div key={step.key} className="relative flex items-start gap-4">
                  {/* Indicator Dot */}
                  <div
                    className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-[#C97A2B] text-white ring-4 ring-[#F8EADA] animate-pulse'
                        : 'bg-stone-200 text-stone-500'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>

                  {/* Text details */}
                  <div>
                    <h4
                      className={`text-sm font-bold ${
                        isCurrent
                          ? 'text-[#C97A2B]'
                          : isDone
                          ? 'text-stone-900'
                          : 'text-stone-400'
                      }`}
                    >
                      {step.label}
                      {isCurrent && (
                        <span className="ml-2 text-[10px] uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-extrabold">
                          In Progress
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Timing & Customer Info Box */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DEC8] space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-stone-500 font-medium">Customer:</span>
              <span className="font-bold text-stone-900">{trackedOrder.customer.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500 font-medium">Estimated Time:</span>
              <span className="font-bold text-[#B86518]">{trackedOrder.fulfillmentTime}</span>
            </div>
            {trackedOrder.deliveryAddress && (
              <div className="flex justify-between items-start">
                <span className="text-stone-500 font-medium">Destination:</span>
                <span className="font-semibold text-stone-900 text-right">
                  {trackedOrder.deliveryAddress.street}, {trackedOrder.deliveryAddress.city}
                </span>
              </div>
            )}
            <div className="pt-2 border-t border-[#E1D4C3]">
              <span className="text-stone-500 block mb-1">Items in this bake:</span>
              <div className="space-y-1">
                {trackedOrder.items.map((ci) => (
                  <div key={ci.cartItemId} className="flex justify-between text-stone-800">
                    <span>
                      {ci.quantity}x {ci.menuItem.name}
                    </span>
                    <span className="font-semibold">{formatPrice(ci.itemTotal)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="bg-[#F4ECE1] p-3.5 rounded-2xl border border-[#DECDB8] flex items-center justify-between gap-3">
            <div>
              <span className="font-bold text-xs text-[#2C241E] block">
                Test Kitchen Progression
              </span>
              <span className="text-[11px] text-[#786457]">
                Advance stage to simulate kitchen workflow
              </span>
            </div>
            <button
              onClick={handleSimulateNextStage}
              className="bg-[#2C241E] hover:bg-stone-800 text-amber-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Advance Step</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
