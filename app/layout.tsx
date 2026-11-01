import type { Metadata, Viewport } from 'next';
import { PersistentSceneRoot } from '@/components/scene/PersistentSceneHost';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { anton, yellowtail, inter } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'FITYN — Wear the Calm',
  description: 'Gallery-minimal 3D clothing store. Tactile digital apparel.',
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#F3F3F0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${yellowtail.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-bg text-black font-sans antialiased selection:bg-olive selection:text-offwhite">
        {/* Persistent 3D Canvas & Fallback mount point */}
        <PersistentSceneRoot />

        {/* DOM UI layer */}
        <div className="relative z-10 flex min-h-screen flex-col">
          {children}
        </div>

        {/* Global Slide-Over Cart Drawer */}
        <CartDrawer />
      </body>
    </html>
  );
}


