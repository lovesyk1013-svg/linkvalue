'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, ChevronRight, LogOut, ClipboardList, Settings, Shield } from 'lucide-react'
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

export default function MyPage() {
  const { profile, loading, signOut, isAdmin } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    if (!profile) return
    const fetch = async () => {
      const { data } = await supabase
        .from('orders').select('*, product:products(*)').eq('user_id', profile.id).order('created_at', { ascending: false }).limit(5)
      if (data) {
        setOrders(data as Order[])
        setTotalAmount(data.reduce((s, o) => s + o.amount, 0))
      }
    }
    fetch()
  }, [profile])

  if (loading) return <div className="flex items-center justify-center h-dvh"><div className="w-8 h-8 border-2 border-navy-200 border-t-navy-800 rounded-full animate-spin" /></div>

  if (!profile) {
    return (
      <div className="pb-20 page-enter">
        <Header title="MY" showBell={false} />
        <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
          <div className="w-20 h-20 rounded-full bg-navy-50 flex items-center justify-center mb-4">
            <User size={36} className="text-navy-300" />
          </div>
          <p className="text-navy-900 font-bold text-lg mb-2">로그인이 필요합니다</p>
          <p className="text-gray-400 text-sm mb-8">링크밸류 멤버에게만 제공되는<br/>특별한 혜택을 누려보세요</p>
          <Link href="/auth" className="w-full bg-navy-gradient text-white font-bold py-4 rounded-xl text-center block relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gold-gradient" />
            로그인 / 회원가입
          </Link>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="pb-20 page-enter">
      <Header title="MY" showBell={false} />

      {/* Profile Card */}
      <div className="mx-4 mt-4 bg-navy-gradient rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-8 translate-x-8" />
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gold-500/20 border-2 border-gold-400 flex items-center justify-center">
            <User size={22} className="text-gold-400" />
          </div>
          <div>
            <p className="text-white font-bold text-base">{profile.name} 님</p>
            <span className="text-gold-400 text-xs font-semibold">LV Member</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-blue-200 text-xs mb-1">총 투자금액</p>
            <p className="text-white font-bold text-base">{formatKRW(totalAmount)}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-blue-200 text-xs mb-1">신청 건수</p>
            <p className="text-white font-bold text-base">{orders.length}건</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      {orders.length > 0 && (
        <div className="mx-4 mt-4">
          <h2 className="text-navy-900 font-bold text-base mb-3">최근 신청 내역</h2>
          <div className="space-y-2">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl p-4 border border-gray-50 shadow-sm">
                <div className="flex justify-between items-start">
                  <p className="text-navy-900 font-medium text-sm flex-1 pr-2">{(order.product as any)?.title || '상품'}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    order.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                    order.status === 'cancelled' ? 'bg-red-50 text-red-500' :
                    'bg-gold-50 text-gold-600'
                  }`}>
                    {order.status === 'pending' ? '검토중' : order.status === 'confirmed' ? '확정' : '취소'}
                  </span>
                </div>
                <p className="text-navy-700 font-bold text-base mt-1">{formatKRW(order.amount)}</p>
                <p className="text-gray-400 text-xs mt-1">{new Date(order.created_at).toLocaleDateString('ko-KR')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu */}
      <div className="mx-4 mt-4 bg-white rounded-2xl overflow-hidden border border-gray-50 shadow-sm">
        {isAdmin && (
          <Link href="/admin" className="flex items-center justify-between px-4 py-4 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-gold-500" />
              <span className="text-navy-900 font-semibold text-sm">관리자 페이지</span>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </Link>
        )}
        <Link href="/my/orders" className="flex items-center justify-between px-4 py-4 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <ClipboardList size={18} className="text-navy-600" />
            <span className="text-navy-900 text-sm">전체 신청 내역</span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </Link>
        <button onClick={signOut} className="flex items-center justify-between px-4 py-4 w-full">
          <div className="flex items-center gap-3">
            <LogOut size={18} className="text-gray-400" />
            <span className="text-gray-500 text-sm">로그아웃</span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
