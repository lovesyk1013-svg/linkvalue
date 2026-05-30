'use client'
import Link from 'next/link'
import { Bell, ChevronLeft } from 'lucide-react'

interface HeaderProps {
  title?: string
  back?: boolean
  showLogo?: boolean
  showBell?: boolean
}

export default function Header({ title, back, showLogo, showBell = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-50">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          {back && (
            <button onClick={() => history.back()} className="p-1 -ml-1">
              <ChevronLeft size={24} className="text-navy-900" />
            </button>
          )}
          {showLogo && (
            <Link href="/" className="flex items-center gap-1.5">
              <div className="flex items-center">
                <span className="text-navy-900 font-black text-xl tracking-tight">L</span>
                <span className="text-gold-500 font-black text-xl tracking-tight">V</span>
              </div>
              <span className="text-navy-900 font-bold text-sm tracking-widest">LINKVALUE</span>
            </Link>
          )}
          {title && !showLogo && (
            <h1 className="text-navy-900 font-bold text-lg">{title}</h1>
          )}
        </div>
        {showBell && (
          <button className="relative p-1">
            <Bell size={22} className="text-navy-800" strokeWidth={1.8} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-gold-500 rounded-full badge-pulse" />
          </button>
        )}
      </div>
    </header>
  )
}
