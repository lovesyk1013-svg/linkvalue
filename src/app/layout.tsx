import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LinkValue | 사람을 잇다, 가치를 만든다',
  description: '신뢰할 수 있는 공동구매 & 투자 플랫폼',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta name="theme-color" content="#0d1f5c" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  )
}
