import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { DarkModeProvider } from '@/contexts/DarkModeContext';

export const metadata: Metadata = {
  title: "Andrew's Travel Blog",
  description: 'Join Andrew on his travel adventures around the world. Discover destination guides, travel tips, cultural insights, and stunning photography.',
  keywords: 'travel blog, travel tips, destination guides, adventure, photography, culture',
  authors: [{ name: 'Andrew' }],
  openGraph: {
    title: "Andrew's Travel Blog",
    description: 'Join Andrew on his travel adventures around the world.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Andrew's Travel Blog",
    description: 'Join Andrew on his travel adventures around the world.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <DarkModeProvider>
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </DarkModeProvider>
      </body>
    </html>
  );
}
