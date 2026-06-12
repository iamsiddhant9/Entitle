import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'entitle. — Your money. Your rights. Automatically claimed.',
  description: 'AI agent that finds every government scheme and unclaimed asset you are entitled to, and applies for them autonomously.',
  keywords: 'government schemes India, unclaimed benefits, civic rights, AI agent',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} light`}>
      <body className="bg-background text-ink font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
