'use client'
import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import Header from '@/components/layout/Header'
import BottomNav from '@/components/layout/BottomNav'
import ProductCard from '@/components/products/ProductCard'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types'

const CATEGORIES = ['전체', '식품', '생활', '가전', '뷰티', '여행', '기타']

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('전체')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      let query = supabase.from('products').select('*').eq('type', 'group_buy').order('created_at', { ascending: false })
      if (category !== '전체') query = query.eq('category', category)
      const { data } = await query
      setProducts(data || [])
      setLoading(false)
    }
    fetchProducts()
  }, [category])

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="pb-20 page-enter">
      <Header title="공동구매" showBell />

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="상품 검색"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-navy-200"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              category === cat
                ? 'bg-navy-900 text-white'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products */}
      <div className="px-4">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-navy-200 border-t-navy-800 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <p className="text-gray-400 text-sm">해당 카테고리에 상품이 없습니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(p => <ProductCard key={p.id} product={p} variant="compact" />)}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
