'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, Share2, Heart, Users, Clock, TrendingUp, CreditCard, Copy, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { Product } from '@/types'

function formatKRW(n: number) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억원`
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만원`
  return `${n.toLocaleString()}원`
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { profile } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [showOrder, setShowOrder] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [memo, setMemo] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('products').select('*').eq('id', id).single()
      setProduct(data)
      setLoading(false)
    }
    fetch()
  }, [id])

  const copyAccount = () => {
    if (product?.account_number) {
      navigator.clipboard.writeText(product.account_number)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleOrder = async () => {
    if (!profile) { router.push('/auth'); return }
    setSubmitting(true)
    const amount = product!.type === 'group_buy'
      ? product!.price * quantity
      : quantity * 10000

    const { error } = await supabase.from('orders').insert({
      user_id: profile.id,
      product_id: product!.id,
      amount,
      quantity: product!.type === 'group_buy' ? quantity : null,
      status: 'pending',
      memo,
    })
    if (!error) {
      await supabase.from('products').update({
        participant_count: (product!.participant_count || 0) + 1,
        current_amount: (product!.current_amount || 0) + amount,
      }).eq('id', product!.id)
      setSubmitted(true)
    }
    setSubmitting(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-dvh">
      <div className="w-8 h-8 border-2 border-navy-200 border-t-navy-800 rounded-full animate-spin" />
    </div>
  )
  if (!product) return <div className="p-8 text-center text-gray-400">상품을 찾을 수 없습니다</div>

  const progress = product.target_amount ? Math.min((product.current_amount / product.target_amount) * 100, 100) : null
  const discountRate = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : null

  return (
    <div className="pb-28 page-enter">
      {/* Image */}
      <div className="relative h-72 bg-navy-900">
        {product.image_url ? (
          <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-navy-gradient flex items-center justify-center">
            <span className="text-gold-400 text-5xl font-black">LV</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-12">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <ChevronLeft size={20} className="text-white" />
          </button>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Heart size={18} className="text-white" strokeWidth={1.8} />
            </button>
            <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Share2 size={18} className="text-white" strokeWidth={1.8} />
            </button>
          </div>
        </div>
        {product.status === 'active' && (
          <div className="absolute top-14 left-4 mt-2">
            <span className="bg-gold-500 text-white text-xs font-bold px-3 py-1 rounded-full">모집중</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pt-5">
        <p className="text-gold-600 text-xs font-semibold mb-1">{product.category}</p>
        <h1 className="text-navy-900 font-bold text-xl leading-snug mb-4">{product.title}</h1>

        {/* Price / Rate */}
        {product.type === 'group_buy' ? (
          <div className="flex items-end gap-2 mb-4">
            {product.original_price && (
              <span className="text-gray-400 text-sm line-through">{formatKRW(product.original_price)}</span>
            )}
            <span className="text-navy-900 font-bold text-2xl">{formatKRW(product.price)}</span>
            {discountRate && <span className="text-red-500 font-bold text-base">{discountRate}%</span>}
          </div>
        ) : (
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5 bg-navy-50 px-4 py-2 rounded-xl">
              <TrendingUp size={16} className="text-navy-700" />
              <span className="text-navy-800 font-bold text-lg">연 {product.interest_rate}%</span>
            </div>
            {product.duration_months && (
              <span className="text-gray-500 text-sm">{product.duration_months}개월</span>
            )}
          </div>
        )}

        {/* Progress */}
        {progress !== null && (
          <div className="bg-gray-50 rounded-2xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-navy-800">
                {product.type === 'investment' ? '모집 현황' : '구매 현황'}
              </span>
              <span className="text-gold-600 font-bold text-sm">{Math.round(progress)}%</span>
            </div>
            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-navy-gradient rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>현재: {formatKRW(product.current_amount)}</span>
              <span>목표: {formatKRW(product.target_amount!)}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
              <Users size={12} />
              <span>{product.participant_count}명 참여</span>
            </div>
          </div>
        )}

        {/* Account Info */}
        {product.account_bank && (
          <div className="border border-navy-100 rounded-2xl p-4 mb-4 bg-navy-50/50">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={16} className="text-navy-700" />
              <span className="text-navy-800 font-semibold text-sm">입금 계좌 안내</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">은행</span>
                <span className="text-sm font-medium text-navy-900">{product.account_bank}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">계좌번호</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-navy-900">{product.account_number}</span>
                  <button onClick={copyAccount} className="p-1">
                    {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-400" />}
                  </button>
                </div>
              </div>
              {product.account_holder && (
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">예금주</span>
                  <span className="text-sm font-medium text-navy-900">{product.account_holder}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-navy-900 font-bold text-base mb-3">상품 안내</h2>
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
        </div>
      </div>

      {/* Order Modal */}
      {showOrder && !submitted && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowOrder(false)}>
          <div className="bg-white w-full max-w-[430px] mx-auto rounded-t-3xl p-6" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
            <h3 className="text-navy-900 font-bold text-lg mb-4">주문 신청</h3>

            {product.type === 'group_buy' && (
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">수량</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-lg font-bold">−</button>
                  <span className="text-lg font-bold text-navy-900 w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-lg font-bold">+</button>
                </div>
                <p className="text-navy-800 font-bold text-xl mt-3">{formatKRW(product.price * quantity)}</p>
              </div>
            )}

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">메모 (선택)</label>
              <input
                value={memo} onChange={e => setMemo(e.target.value)}
                placeholder="입금자명 또는 요청사항"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-navy-700"
              />
            </div>

            {product.account_bank && (
              <div className="bg-navy-50 rounded-xl p-3 mb-4 text-sm">
                <p className="font-semibold text-navy-800 mb-1">입금 계좌</p>
                <p className="text-gray-600">{product.account_bank} {product.account_number}</p>
                <p className="text-gray-600">예금주: {product.account_holder}</p>
              </div>
            )}

            <button onClick={handleOrder} disabled={submitting}
              className="w-full bg-navy-gradient text-white font-bold py-4 rounded-xl relative overflow-hidden disabled:opacity-60">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gold-gradient" />
              {submitting ? '처리 중...' : '신청하기'}
            </button>
          </div>
        </div>
      )}

      {/* Success */}
      {submitted && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-8">
          <div className="bg-white rounded-3xl p-8 text-center w-full max-w-sm">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-500" />
            </div>
            <h3 className="text-navy-900 font-bold text-lg mb-2">신청 완료!</h3>
            <p className="text-gray-500 text-sm mb-6">위의 계좌로 입금하시면 담당자가 확인 후 처리해드립니다.</p>
            <button onClick={() => { setSubmitted(false); setShowOrder(false) }}
              className="w-full bg-navy-gradient text-white font-bold py-3 rounded-xl">
              확인
            </button>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      {!showOrder && !submitted && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-4 py-4">
          <button
            onClick={() => profile ? setShowOrder(true) : router.push('/auth')}
            className="w-full bg-navy-gradient text-white font-bold py-4 rounded-xl relative overflow-hidden active:scale-[0.98] transition-transform"
          >
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gold-gradient" />
            {profile ? '신청하기' : '로그인 후 신청'}
          </button>
        </div>
      )}
    </div>
  )
}
