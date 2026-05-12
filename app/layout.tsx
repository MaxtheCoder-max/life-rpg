import type { Metadata, Viewport } from 'next'
import './globals.css'
import { StoreProvider } from '@/lib/store'
import { BottomNav } from '@/components/layout/BottomNav'

export const metadata: Metadata = {
  title: 'Life RPG — 人生状态模拟器',
  description: '把现实生活做成一个低压力、适合 ADHD 长期使用的人生 RPG 系统',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#08080e',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="h-full">
        <StoreProvider>
          <div className="flex flex-col min-h-full max-w-md mx-auto relative">
            {children}
            {/* Spacer: pushes content above the fixed BottomNav (nav ≈ 78px + 16px margin = 94px) */}
            <div style={{ height: 110, flexShrink: 0 }} aria-hidden="true" />
          </div>
          <BottomNav />
        </StoreProvider>
      </body>
    </html>
  )
}
