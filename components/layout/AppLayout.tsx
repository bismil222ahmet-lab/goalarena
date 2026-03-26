import { ReactNode } from 'react';
import Navbar from './Navbar';
import MobileBottomNav from './MobileBottomNav';
import Footer from './Footer';
import SearchModal from '@/components/common/SearchModal';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="container pb-24 pt-5 md:pb-8 flex-1">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
      <SearchModal />
    </div>
  );
}
