import React from 'react';
import { BakeryProvider, useBakery } from './context/BakeryContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { BakingScheduleTicker } from './components/BakingScheduleTicker';
import { MenuSection } from './components/MenuSection';
import { BakeryStorySection } from './components/BakeryStorySection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ItemCustomizeModal } from './components/ItemCustomizeModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { LoginModal } from './components/LoginModal';
import { MobileBottomBar } from './components/MobileBottomBar';

const BakeryAppContent: React.FC = () => {
  const { activeView } = useBakery();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#261D15]">
      <Navbar />

      <main className="flex-1">
        {activeView === 'store' ? (
          <>
            <HeroBanner />
            <BakingScheduleTicker />
            <MenuSection />
            <BakeryStorySection />
            <Footer />
          </>
        ) : (
          <DashboardView />
        )}
      </main>

      {/* Global Interactive Overlays & Drawers */}
      <ItemCustomizeModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderConfirmationModal />
      <OrderTrackerModal />
      <LoginModal />

      {/* Mobile Sticky Quick-Cart & Nav Bar */}
      <MobileBottomBar />
    </div>
  );
};

export default function App() {
  return (
    <BakeryProvider>
      <BakeryAppContent />
    </BakeryProvider>
  );
}
