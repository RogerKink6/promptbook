import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Promptbook — Your AI Prompt Library',
  description:
    'Save, organize, and instantly reuse your best AI prompts. Works with ChatGPT, Claude, Midjourney, and more.',
  keywords: ['AI prompts', 'prompt library', 'ChatGPT', 'Claude', 'Midjourney', 'productivity'],
  openGraph: {
    title: 'Promptbook — Your AI Prompt Library',
    description: 'Save, organize, and instantly reuse your best AI prompts.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
