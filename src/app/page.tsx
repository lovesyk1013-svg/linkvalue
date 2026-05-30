'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, TrendingUp, ShoppingCart, Gift, Heart, ArrowRight } from 'lucide-react'
import BottomNav from '@/components/layout/BottomNav'
import Header from '@/components/layout/Header'
import ProductCard from '@/components/products/ProductCard'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { Product } from '@/types'

export default function HomePage() {
  const { profile, loading } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [investments, setInvestments] = useState<Product[]>([])
  const [bannerIdx, setBannerIdx] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const { data: p } = await supabase
        .from('products').select('*')
        .eq('type', 'group_buy').eq('status', 'active').limit(4)
      const { data: i } = await supabase
        .from('products').select('*')
        .eq('type', 'investment').eq('status', 'active').limit(3)
      if (p) setProducts(p)
      if (i) setInvestments(i)
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-dvh">
      <div className="w-8 h-8 border-2 border-navy-200 border-t-navy-800 rounded-full animate-spin" />
    </div>
  )

  if (!profile) {
    return (
      <div className="min-h-dvh flex flex-col">
        {/* Splash for guests */}
        <div className="bg-navy-gradient flex-1 flex flex-col items-center justify-center text-center px-8 pb-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-white font-black text-5xl">L</span>
            <span className="text-gold-400 font-black text-5xl">V</span>
          </div>
          <div className="text-white font-bold text-2xl tracking-[0.3em] mb-3">LINKVALUE</div>
          <p className="text-blue-200 text-sm mb-8">사람을 잇다, 가치를 만든다</p>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050d2d] to-transparent" />
        </div>
        <div className="bg-white px-6 py-8 flex flex-col gap-3">
          <Link href="/auth" className="block w-full bg-navy-gradient text-white font-bold py-4 rounded-xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gold-gradient" />
            시작하기
          </Link>
          <p className="text-center text-sm text-gray-400">
            이미 회원이신가요?{' '}
            <Link href="/auth" className="text-navy-700 font-semibold">로그인</Link>
          </p>
        </div>
      </div>
    )
  }

  const banners = [
    { title: '좋은 사람과 함께\n더 큰 가치를 만듭니다', sub: '믿을 수 있는 투자와 다양한 혜택을 한곳에서', color: 'from-navy-900 to-navy-700' },
    { title: '이번 주 공동구매\n특별 할인 상품', sub: '함께 사면 더 저렴하게', color: 'from-[#1a3280] to-[#0d1f5c]' },
  ]

  return (
    <div className="pb-20 page-enter">
      <Header showLogo showBell />

      {/* Banner */}
      <div className="mx-4 mt-3 rounded-2xl overflow-hidden">
        <div className={`bg-gradient-to-br ${banners[bannerIdx].color} p-6 min-h-[140px] relative`}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/5 translate-y-6 -translate-x-4" />
          <p className="text-white font-bold text-xl leading-snug whitespace-pre-line relative z-10">
            {banners[bannerIdx].title}
          </p>
          <p className="text-blue-200 text-sm mt-2 relative z-10">{banners[bannerIdx].sub}</p>
          <div className="flex gap-1.5 mt-4 relative z-10">
            {banners.map((_, i) => (
              <button key={i} onClick={() => setBannerIdx(i)}
                className={`h-1.5 rounded-full transition-all ${i === bannerIdx ? 'w-6 bg-gold-400' : 'w-1.5 bg-white/30'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Menu */}
      <div className="grid grid-cols-4 gap-2 mx-4 mt-4">
        {[
          { icon: TrendingUp, label: '투자', href: '/invest', color: 'text-navy-800 bg-navy-50' },
          { icon: ShoppingCart, label: '공동구매', href: '/products', color: 'text-gold-600 bg-gold-50' },
          { icon: Gift, label: '혜택', href: '/benefits', color: 'text-purple-600 bg-purple-50' },
          { icon: Heart, label: '봉사', href: '/volunteer', color: 'text-red-500 bg-red-50' },
        ].map(({ icon: Icon, label, href, color }) => (
          <Link key={href} href={href}
            className="flex flex-col items-center gap-2 bg-white rounded-2xl py-4 shadow-sm border border-gray-50 card-hover">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={20} strokeWidth={1.8} />
            </div>
            <span className="text-xs font-medium text-gray-600">{label}</span>
          </Link>
        ))}
      </div>

      {/* Active Investments */}
      {investments.length > 0 && (
        <section className="mt-6 px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-navy-900">진행 중인 투자</h2>
            <Link href="/invest" className="flex items-center gap-1 text-xs text-gray-400">
              전체보기 <ChevronRight size={14} />
            </Link>
          </div>
          {investments.map(p => <ProductCard key={p.id} product={p} />)}
        </section>
      )}

      {/* Group Buy Section */}
      {products.length > 0 && (
        <section className="mt-4 px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-navy-900">추천 공동구매</h2>
            <Link href="/products" className="flex items-center gap-1 text-xs text-gray-400">
              전체보기 <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {products.map(p => <ProductCard key={p.id} product={p} variant="compact" />)}
          </div>
        </section>
      )}

      {/* Empty state */}
      {products.length === 0 && investments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center px-8">
          <div className="w-16 h-16 rounded-full bg-navy-50 flex items-center justify-center mb-4">
            <TrendingUp size={28} className="text-navy-300" />
          </div>
          <p className="text-navy-900 font-bold mb-2">아직 등록된 상품이 없습니다</p>
          <p className="text-gray-400 text-sm">관리자가 상품을 등록하면 이곳에 표시됩니다</p>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
