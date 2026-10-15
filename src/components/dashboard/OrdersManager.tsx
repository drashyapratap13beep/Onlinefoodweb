import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import {
  Clock,
  CheckCircle2,
  Flame,
  ShoppingBag,
  Store,
  Truck,
  Search,
  Filter,
  Plus,
  Printer,
  ChevronRight,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types/bakery';

export const OrdersManager: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    simulateNewOrder,
    setTrackedOrder,
    formatPrice,
  } = useBakery();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'pickup' | 'delivery'>('all');
  const [selectedOrderForTicket, setSelectedOrderForTicket] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (typeFilter !== 'all' && o.type !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = o.customer.name.toLowerCase().includes(q);
      const matchId = o.id.toLowerCase().includes(q);
      const matchItem = o.items.some((i) => i.menuItem.name.toLowerCase().includes(q));
      if (!matchName && !matchId && !matchItem) return false;
    }
    return true;
  });

  const columns: { status: OrderStatus; title: string; subtitle: string; color: string }[] = [
    {
      status: 'received',
      title: 'Received / Queued',
      subtitle: 'Awaiting baking or packing',
      color: 'border-amber-400 bg-amber-50/50',
    },
    {
      status: 'in-oven',
      title: 'On Tandoor / Dum Handi',
      subtitle: 'Simmering in handi & clay oven',
      color: 'border-orange-500 bg-orange-50/50',
    },
    {
      status: 'ready',
      title: 'Ready for Pickup',
      subtitle: 'On counter or for courier',
      color: 'border-emerald-500 bg-emerald-50/50',
    },
    {
      status: 'completed',
      title: 'Completed Orders',
      subtitle: 'Fulfilled & hand-delivered',
      color: 'border-stone-400 bg-stone-50/50',
    },
  ];

  const handleNextStatus = (order: Order) => {
    switch (order.status) {
      case 'received':
        updateOrderStatus(order.id, 'in-oven');
        break;
      case 'in-oven':
        updateOrderStatus(order.id, 'ready');
        break;
      case 'ready':
        updateOrderStatus(order.id, 'completed');
        break;
      case 'completed':
        // no further progression
        break;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Filter Bar & Simulator */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E4D7C7] shadow-xs">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by customer, order # or item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#D5C5B2] rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C97A2B]"
            />
          </div>

          <div className="flex bg-[#F4ECE1] p-0.5 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-[#2C241E] text-white shadow-xs'
                  : 'text-[#655245] hover:text-[#2C241E]'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter('pickup')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                typeFilter === 'pickup'
                  ? 'bg-[#2C241E] text-white shadow-xs'
                  : 'text-[#655245] hover:text-[#2C241E]'
              }`}
            >
              Curbside
            </button>
            <button
              onClick={() => setTypeFilter('delivery')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                typeFilter === 'delivery'
                  ? 'bg-[#2C241E] text-white shadow-xs'
                  : 'text-[#655245] hover:text-[#2C241E]'
              }`}
            >
              Delivery
            </button>
          </div>
        </div>

        {/* Live Simulator CTA */}
        <button
          onClick={() => simulateNewOrder()}
          className="bg-[#C97A2B] hover:bg-[#B2651F] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Simulate Incoming Customer Order</span>
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colOrders = filteredOrders.filter((o) => o.status === col.status);

          return (
            <div
              key={col.status}
              className="bg-[#FAF7F2] rounded-2xl border border-[#E4D7C7] p-3.5 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="pb-3 border-b border-[#E8DEC8] flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#231A14]">
                    {col.title}
                  </h4>
                  <p className="text-[10px] text-stone-500">{col.subtitle}</p>
                </div>
                <span className="w-6 h-6 rounded-full bg-white border border-stone-300 font-bold text-xs flex items-center justify-center text-stone-700">
                  {colOrders.length}
                </span>
              </div>

              {/* Orders in column */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {colOrders.length === 0 ? (
                  <div className="text-center py-12 text-stone-400 text-xs italic">
                    No orders in this stage
                  </div>
                ) : (
                  colOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-xl p-3.5 border border-[#DECFC0] shadow-xs hover:border-[#C97A2B] transition-all space-y-2.5"
                    >
                      {/* Order top line */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-stone-900 bg-[#F4ECE1] px-2 py-0.5 rounded-md">
                          #{order.id}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-stone-600">
                          {order.type === 'pickup' ? (
                            <span className="flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                              <Store className="w-3 h-3" /> Pickup
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                              <Truck className="w-3 h-3" /> Delivery
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Customer & Time */}
                      <div>
                        <div className="font-bold text-xs text-stone-900">
                          {order.customer.name}
                        </div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{order.fulfillmentTime}</span>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="bg-[#FAF7F2] p-2 rounded-lg border border-[#EFE5D9] text-[11px] space-y-1">
                        {order.items.map((ci) => (
                          <div key={ci.cartItemId} className="flex justify-between text-stone-800">
                            <span className="truncate pr-2">
                              {ci.quantity}x {ci.menuItem?.name || (ci as any).name}
                            </span>
                            <span className="font-semibold shrink-0">
                              {formatPrice(ci.itemTotal || (ci as any).price * ci.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {order.notes && (
                        <div className="text-[10px] text-amber-900 bg-amber-50/80 p-1.5 rounded border border-amber-200">
                          <strong>Kitchen Note:</strong> {order.notes}
                        </div>
                      )}

                      {/* Bottom row: Total & Advance action */}
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                        <span className="font-serif font-bold text-xs text-[#B86518]">
                          {formatPrice(order.total)}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelectedOrderForTicket(order)}
                            className="p-1 text-stone-500 hover:text-stone-900 rounded hover:bg-stone-100"
                            title="View Kitchen Ticket"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {order.status !== 'completed' && (
                            <button
                              onClick={() => handleNextStatus(order)}
                              className="bg-[#2C241E] hover:bg-stone-800 text-amber-200 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <span>
                                {order.status === 'received'
                                  ? 'Bake'
                                  : order.status === 'in-oven'
                                  ? 'Ready'
                                  : 'Done'}
                              </span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Kitchen Ticket Modal */}
      {selectedOrderForTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-300 font-mono text-xs space-y-4">
            <div className="text-center border-b border-dashed border-stone-300 pb-3">
              <span className="font-bold text-sm block">PAIN & MIEL ARTISAN BAKERY</span>
              <span className="text-[10px] text-stone-500">KITCHEN DECK TICKET</span>
              <div className="font-bold text-base mt-1">#{selectedOrderForTicket.id}</div>
              <div className="text-[10px] text-stone-500">
                {new Date(selectedOrderForTicket.placedAt).toLocaleString()}
              </div>
            </div>

            <div>
              <div className="font-bold">GUEST: {selectedOrderForTicket.customer.name}</div>
              <div>TEL: {selectedOrderForTicket.customer.phone}</div>
              <div>TYPE: {selectedOrderForTicket.type.toUpperCase()}</div>
              <div>TIME: {selectedOrderForTicket.fulfillmentTime}</div>
            </div>

            <div className="border-t border-b border-dashed border-stone-300 py-2 space-y-1.5">
              {selectedOrderForTicket.items.map((i) => (
                <div key={i.cartItemId} className="flex justify-between">
                  <span>{i.quantity}x {i.menuItem?.name || (i as any).name}</span>
                  <span>{formatPrice(i.itemTotal || (i as any).price * i.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-bold">
              <span>TOTAL</span>
              <span>{formatPrice(selectedOrderForTicket.total)}</span>
            </div>

            <button
              onClick={() => setSelectedOrderForTicket(null)}
              className="w-full bg-[#2C241E] text-white py-2 rounded-xl text-xs font-sans font-bold hover:bg-stone-800 cursor-pointer"
            >
              Close Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
