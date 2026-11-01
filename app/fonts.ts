import { Anton, Yellowtail, Inter } from 'next/font/google';

export const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
});

export const yellowtail = Yellowtail({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-yellowtail',
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

