import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PPR Fantasy Football Expert | AI-Powered PPR Advice',
  description: 'Get expert PPR fantasy football advice with AI-powered insights. Optimized for Points Per Reception scoring with start/sit decisions, waiver wire targets, and trade analysis.',
  keywords: ['PPR', 'fantasy football', 'AI', 'start sit', 'waiver wire', 'points per reception'],
  authors: [{ name: 'PPR Fantasy Expert' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'PPR Fantasy Football Expert',
    description: 'AI-powered PPR fantasy football advice and insights',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PPR Fantasy Football Expert',
    description: 'AI-powered PPR fantasy football advice and insights',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
} 