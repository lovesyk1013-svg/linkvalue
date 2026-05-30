'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import BottomNav from '@/components/layout/BottomNav'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { Order } from '@/types'

function formatKRW(n: number) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억원`
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만원`
  return `${n.toLocaleString()}원`
}

export default function OrdersPage() {
  const { profile, loading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (!loading && !profile) { router.push('/auth'); return }
    if (!profile) return
    const fetch = async () => {
      const { data } = await supabase
        .from('orders').select('*, product:products(title, type)').eq('user_id', profile.id).order('created_at', { ascending: false })
      if (data) setOrders(data as Order[])
    }
    fetch()
  }, [profile, loading])

  return (
    <div className="pb-20 page-enter">
      <Header title="신청 내역" back showBell={false} />
      <div className="px-4 py-4 space-y-3">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <p className="text-gray-400 text-sm">신청 내역이 없습니다</p>
          </div>
        ) : orders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
            <div className="flex justify-between items-start mb-2">
              <p className="text-navy-900 font-semibold text-sm flex-1 pr-2">{(order.product as any)?.title}</p>
              <span className={`text-xs px-2.5 py-1 rounded-full flex-shrink-0 ${
                order.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                order.status === 'cancelled' ? 'bg-red-50 text-red-500' :
                'bg-gold-50 text-gold-600'
              }`}>
                {order.status === 'pending' ? '검토중' : order.status === 'confirmed' ? '확정' : '취소'}
              </span>
            </div>
            <p className="text-navy-800 font-bold text-lg">{formatKRW(order.amount)}</p>
            {order.memo && <p className="text-gray-500 text-xs mt-1">메모: {order.memo}</p>}
            <p className="text-gray-400 text-xs mt-2">{new Date(order.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  )
}
