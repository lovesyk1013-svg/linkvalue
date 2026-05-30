'use client'
import { useEffect, useState } from 'react'
import Header from '@/components/layout/Header'
import BottomNav from '@/components/layout/BottomNav'
import ProductCard from '@/components/products/ProductCard'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types'

const TABS = ['전체', '모집중', '상환중', '상환완료']

export default function InvestPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [tab, setTab] = useState('전체')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      let q = supabase.from('products').select('*').eq('type', 'investment').order('created_at', { ascending: false })
      if (tab === '모집중') q = q.eq('status', 'active')
      else if (tab === '상환완료') q = q.eq('status', 'closed')
      const { data } = await q
      setProducts(data || [])
      setLoading(false)
    }
    fetch()
  }, [tab])

  return (
    <div className="pb-20 page-enter">
      <Header title="투자" showBell />

      {/* Tabs */}
      <div className="flex gap-1 px-4 py-3 bg-white border-b border-gray-50">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              tab === t ? 'bg-navy-900 text-white' : 'text-gray-500'
            }`}>
            {t}
          </button>
        ))}
      </div>

      <div className="px-4 pt-4">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-navy-200 border-t-navy-800 rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <p className="text-gray-400 text-sm">해당 투자 상품이 없습니다</p>
          </div>
        ) : (
          products.map(p => <ProductCard key={p.id} product={p} />)
        )}
      </div>

      <BottomNav />
    </div>
  )
}
