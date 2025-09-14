import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { Toaster } from '@/components/ui/toaster'
import { NotificationManager } from '@/components/ui/NotificationManager'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nightingale Connect',
  description: 'Healthcare professional communication platform',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
          <NotificationManager userId="demo-user" />
        </AuthProvider>
      </body>
    </html>
  )
}
