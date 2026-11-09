import React from 'react';
import Head from 'next/head';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { MobileBottomNav } from '../components/MobileBottomNav';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = 'ShopEase | Modern E-Commerce Platform',
  description = 'Shop high-quality electronics, fashion, lifestyle goods and essentials with fast delivery and secure payments.',
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <CartDrawer />

      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

