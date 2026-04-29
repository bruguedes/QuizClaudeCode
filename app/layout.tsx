import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { HtmlLangSync } from '@/components/HtmlLangSync';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Claude Code Quiz',
  description: 'Test your Claude Code knowledge — True or False adaptive quiz',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" suppressHydrationWarning className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-[#FAFAF8] text-gray-900 antialiased">
        <HtmlLangSync />
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
