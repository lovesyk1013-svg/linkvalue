'use client'
import Header from '@/components/layout/Header'
import BottomNav from '@/components/layout/BottomNav'
import { Gift, Star, Ticket, CreditCard } from 'lucide-react'

const benefitItems = [
  { icon: Gift, title: '제품 할인', desc: '파트너사 상품 특별 할인', color: 'bg-purple-50 text-purple-600' },
  { icon: Star, title: '멤버십 쿠폰', desc: 'LV 멤버 전용 쿠폰 혜택', color: 'bg-gold-50 text-gold-600' },
  { icon: Ticket, title: '이벤트', desc: '정기 이벤트 및 경품', color: 'bg-navy-50 text-navy-700' },
  { icon: CreditCard, title: '포인트 적립', desc: '참여 시 포인트 자동 적립', color: 'bg-green-50 text-green-600' },
]

export default function BenefitsPage() {
  return (
    <div className="pb-20 page-enter">
      <Header title="혜택" showBell />

      <div className="mx-4 mt-4 bg-navy-gradient rounded-2xl p-5 relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-white/5 -translate-y-6 translate-x-6" />
        <p className="text-gold-400 text-xs font-bold mb-1">LINKVALUE</p>
        <h2 className="text-white font-bold text-xl leading-snug">멤버십 혜택</h2>
        <p className="text-blue-200 text-sm mt-1">멤버만을 위한 특별한 혜택을 누려보세요</p>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4">
        {benefitItems.map(({ icon: Icon, title, desc, color }) => (
          <div key={title} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={20} />
            </div>
            <p className="text-navy-900 font-bold text-sm mb-1">{title}</p>
            <p className="text-gray-400 text-xs">{desc}</p>
          </div>
        ))}
      </div>

      <div className="mx-4 mt-6 bg-gray-50 rounded-2xl p-6 text-center">
        <p className="text-gray-500 text-sm">더 많은 혜택이 준비 중입니다</p>
      </div>

      <BottomNav />
    </div>
  )
}
