'use client'
import Link from 'next/link'
import { Users, Clock, TrendingUp } from 'lucide-react'
import type { Product } from '@/types'

function formatKRW(n: number) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(0)}억원`
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만원`
  return `${n.toLocaleString()}원`
}

function getDaysLeft(deadline: string | null) {
  if (!deadline) return null
  const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000)
  return diff > 0 ? diff : 0
}

interface Props {
  product: Product
  variant?: 'default' | 'compact'
}

export default function ProductCard({ product, variant = 'default' }: Props) {
  const progress = product.target_amount
    ? Math.min((product.current_amount / product.target_amount) * 100, 100)
    : null
  const daysLeft = getDaysLeft(product.deadline)
  const discountRate = product.original_price && product.price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null

  if (variant === 'compact') {
    return (
      <Link href={`/products/${product.id}`} className="block">
        <div className="card-hover bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50">
          <div className="relative h-32 bg-navy-100">
            {product.image_url ? (
              <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-navy-gradient flex items-center justify-center">
                <span className="text-gold-400 text-2xl font-black">LV</span>
              </div>
            )}
            {discountRate && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {discountRate}%
              </div>
            )}
          </div>
          <div className="p-3">
            <p className="text-xs text-gray-400 mb-1">{product.category}</p>
            <h3 className="text-sm font-bold text-navy-900 line-clamp-2 leading-snug">{product.title}</h3>
            <div className="mt-2">
              {product.original_price && (
                <p className="text-xs text-gray-400 line-through">{formatKRW(product.original_price)}</p>
              )}
              <p className="text-sm font-bold text-navy-900">{formatKRW(product.price)}</p>
            </div>
            <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400">
              <Users size={11} />
              <span>{product.participant_count}명 구매중</span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="card-hover bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 mb-3">
        <div className="relative h-44 bg-navy-100">
          {product.image_url ? (
            <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-navy-gradient flex items-center justify-center">
              <span className="text-gold-400 text-3xl font-black">LV</span>
            </div>
          )}
          <div className="absolute inset-0 bg-card-gradient" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {product.status === 'active' && (
              <span className="bg-gold-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">모집중</span>
            )}
            {product.type === 'investment' && (
              <span className="bg-navy-900/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">투자</span>
            )}
          </div>

          {daysLeft !== null && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/40 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              <Clock size={11} />
              <span>D-{daysLeft}</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <p className="text-xs text-gold-600 font-semibold mb-1">{product.category}</p>
          <h3 className="text-base font-bold text-navy-900 leading-snug mb-3">{product.title}</h3>

          {product.type === 'investment' && product.interest_rate && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1 bg-navy-50 px-3 py-1.5 rounded-lg">
                <TrendingUp size={13} className="text-navy-700" />
                <span className="text-navy-800 text-sm font-bold">연 {product.interest_rate}%</span>
              </div>
              {product.duration_months && (
                <span className="text-gray-400 text-xs">· {product.duration_months}개월</span>
              )}
            </div>
          )}

          {product.type === 'group_buy' && (
            <div className="flex items-center gap-3 mb-3">
              {product.original_price && (
                <span className="text-gray-400 text-sm line-through">{formatKRW(product.original_price)}</span>
              )}
              <span className="text-navy-900 font-bold text-lg">{formatKRW(product.price)}</span>
              {discountRate && (
                <span className="text-red-500 text-sm font-bold">{discountRate}%↓</span>
              )}
            </div>
          )}

          {progress !== null && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-gray-500">
                  {product.type === 'investment' ? '모집금액' : '구매현황'}
                </span>
                <span className="text-xs font-bold text-navy-800">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-navy-gradient rounded-full progress-animate"
                  style={{ '--target-width': `${progress}%`, width: `${progress}%` } as React.CSSProperties}
                />
              </div>
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-xs text-gray-400">{formatKRW(product.current_amount)}</span>
                <span className="text-xs text-gray-400">{formatKRW(product.target_amount!)}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
            <Users size={12} />
            <span>{product.participant_count}명 참여중</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
