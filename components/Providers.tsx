'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import MobileNav from './MobileNav';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-16 pb-20 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <MobileNav />
    </>
  );
}
