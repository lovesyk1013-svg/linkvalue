'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, TrendingUp, ShoppingCart, Gift, User } from 'lucide-react'

const navItems = [
  { href: '/', icon: Home, label: '홈' },
  { href: '/invest', icon: TrendingUp, label: '투자' },
  { href: '/products', icon: ShoppingCart, label: '공동구매' },
  { href: '/benefits', icon: Gift, label: '혜택' },
  { href: '/my', icon: User, label: 'MY' },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 bottom-nav z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-0.5 px-3 py-1 min-w-[60px]">
              <Icon
                size={22}
                className={active ? 'text-navy-900' : 'text-gray-400'}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span className={`text-[10px] font-medium ${active ? 'text-navy-900' : 'text-gray-400'}`}>
                {label}
              </span>
              {active && <div className="w-1 h-1 rounded-full bg-gold-500 mt-0.5" />}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
