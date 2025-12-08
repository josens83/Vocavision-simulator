import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'VocaVision - AI 기반 영어 단어 학습',
    template: '%s | VocaVision',
  },
  description:
    'AI 연상법과 간격 반복 학습으로 영어 단어를 효과적으로 암기하세요. 플래시카드, 퀴즈, 게임으로 재미있게 학습할 수 있습니다.',
  keywords: [
    '영어 단어',
    '영어 학습',
    '단어 암기',
    'AI 학습',
    '플래시카드',
    '간격 반복',
    'SM-2',
    'VocaVision',
  ],
  authors: [{ name: 'VocaVision Team' }],
  creator: 'VocaVision',
  publisher: 'VocaVision',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    siteName: 'VocaVision',
    title: 'VocaVision - AI 기반 영어 단어 학습',
    description: 'AI 연상법과 간격 반복 학습으로 영어 단어를 효과적으로 암기하세요.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VocaVision',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VocaVision - AI 기반 영어 단어 학습',
    description: 'AI 연상법과 간격 반복 학습으로 영어 단어를 효과적으로 암기하세요.',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
