'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Package, Users, TrendingUp } from 'lucide-react'
import Header from '@/components/layout/Header'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { Product, Order } from '@/types'

function formatKRW(n: number) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만`
  return n.toLocaleString()
}

export default function AdminPage() {
  const { profile, loading, isAdmin } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<'products' | 'orders'>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (!loading && (!profile || !isAdmin)) { router.push('/'); return }
    if (isAdmin) fetchAll()
  }, [loading, isAdmin])

  const fetchAll = async () => {
    const { data: p } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    const { data: o } = await supabase.from('orders').select('*, product:products(title), user:profiles(name, email)').order('created_at', { ascending: false })
    if (p) setProducts(p)
    if (o) setOrders(o)
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('삭제하시겠습니까?')) return
    await supabase.from('products').delete().eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const updateOrderStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  if (loading) return <div className="flex items-center justify-center h-dvh"><div className="w-8 h-8 border-2 border-navy-200 border-t-navy-800 rounded-full animate-spin" /></div>

  const totalUsers = new Set(orders.map(o => o.user_id)).size
  const totalAmount = orders.filter(o => o.status !== 'cancelled').reduce((s: number, o: any) => s + o.amount, 0)

  return (
    <div className="pb-8 page-enter">
      <Header title="관리자" back showBell={false} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 px-4 py-4">
        {[
          { icon: Package, label: '상품', value: products.length + '개' },
          { icon: Users, label: '회원', value: totalUsers + '명' },
          { icon: TrendingUp, label: '총 신청', value: formatKRW(totalAmount) + '원' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-50 text-center">
            <Icon size={18} className="text-navy-600 mx-auto mb-1" />
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-navy-900 font-bold text-sm">{value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 mb-4">
        {[['products', '상품 관리'], ['orders', '신청 관리']] .map(([key, label]) => (
          <button key={key} onClick={() => setTab(key as any)}
            className={`px-5 py-2 rounded-full text-sm font-medium ${tab === key ? 'bg-navy-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'products' && (
        <>
          <div className="flex items-center justify-between px-4 mb-3">
            <span className="text-sm text-gray-500">총 {products.length}개</span>
            <button onClick={() => { setEditProduct(null); setShowForm(true) }}
              className="flex items-center gap-1.5 bg-navy-900 text-white text-sm px-4 py-2 rounded-xl">
              <Plus size={14} /> 상품 등록
            </button>
          </div>
          <div className="px-4 space-y-2">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-50 flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-navy-100 overflow-hidden flex-shrink-0">
                  {p.image_url ? <img src={p.image_url} alt="" className="w-full h-full object-cover" /> :
                    <div className="w-full h-full bg-navy-gradient flex items-center justify-center"><span className="text-gold-400 text-xs font-black">LV</span></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-navy-900 font-semibold text-sm truncate">{p.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{p.status === 'active' ? '활성' : '마감'}</span>
                    <span className="text-xs text-gray-400">{p.type === 'investment' ? '투자' : '공동구매'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => { setEditProduct(p); setShowForm(true) }} className="p-2">
                    <Edit size={15} className="text-navy-500" />
                  </button>
                  <button onClick={() => deleteProduct(p.id)} className="p-2">
                    <Trash2 size={15} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'orders' && (
        <div className="px-4 space-y-2">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-50">
              <div className="flex justify-between items-start mb-1">
                <p className="text-navy-900 font-semibold text-sm">{order.user?.name || '알 수 없음'}</p>
                <select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value)}
                  className={`text-xs px-2 py-1 rounded-full border-0 focus:outline-none font-medium ${
                    order.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                    order.status === 'cancelled' ? 'bg-red-50 text-red-500' :
                    'bg-gold-50 text-gold-600'
                  }`}>
                  <option value="pending">검토중</option>
                  <option value="confirmed">확정</option>
                  <option value="cancelled">취소</option>
                </select>
              </div>
              <p className="text-gray-500 text-xs truncate">{order.product?.title}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-navy-800 font-bold">{order.amount?.toLocaleString()}원</p>
                <p className="text-gray-400 text-xs">{new Date(order.created_at).toLocaleDateString('ko-KR')}</p>
              </div>
              {order.memo && <p className="text-gray-400 text-xs mt-1">메모: {order.memo}</p>}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editProduct}
          adminId={profile!.id}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); fetchAll() }}
        />
      )}
    </div>
  )
}

function ProductForm({ product, adminId, onClose, onSaved }: {
  product: Product | null; adminId: string; onClose: () => void; onSaved: () => void
}) {
  const [form, setForm] = useState({
    title: product?.title || '',
    description: product?.description || '',
    category: product?.category || '식품',
    type: product?.type || 'group_buy',
    status: product?.status || 'active',
    price: product?.price?.toString() || '',
    original_price: product?.original_price?.toString() || '',
    target_amount: product?.target_amount?.toString() || '',
    interest_rate: product?.interest_rate?.toString() || '',
    duration_months: product?.duration_months?.toString() || '',
    deadline: product?.deadline?.split('T')[0] || '',
    image_url: product?.image_url || '',
    account_bank: product?.account_bank || '',
    account_number: product?.account_number || '',
    account_holder: product?.account_holder || '',
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    const payload: any = {
      title: form.title,
      description: form.description,
      category: form.category,
      type: form.type,
      status: form.status,
      price: Number(form.price) || 0,
      original_price: form.original_price ? Number(form.original_price) : null,
      target_amount: form.target_amount ? Number(form.target_amount) : null,
      interest_rate: form.interest_rate ? Number(form.interest_rate) : null,
      duration_months: form.duration_months ? Number(form.duration_months) : null,
      deadline: form.deadline || null,
      image_url: form.image_url || null,
      account_bank: form.account_bank || null,
      account_number: form.account_number || null,
      account_holder: form.account_holder || null,
      created_by: adminId,
    }
    if (product) {
      await supabase.from('products').update(payload).eq('id', product.id)
    } else {
      payload.current_amount = 0
      payload.participant_count = 0
      await supabase.from('products').insert(payload)
    }
    setSaving(false)
    onSaved()
  }

  const input = (label: string, key: string, type = 'text', placeholder = '') => (
    <div>
      <label className="text-xs font-medium text-gray-600 mb-1 block">{label}</label>
      <input type={type} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-navy-700" />
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-full flex items-start justify-center pt-8 pb-8">
        <div className="bg-white w-full max-w-[430px] mx-4 rounded-3xl overflow-hidden">
          <div className="bg-navy-gradient px-5 py-4 flex items-center justify-between">
            <h2 className="text-white font-bold">{product ? '상품 수정' : '상품 등록'}</h2>
            <button onClick={onClose} className="text-white/70 text-xl">&times;</button>
          </div>
          <div className="p-5 space-y-3">
            {input('상품명 *', 'title', 'text', '상품 제목을 입력하세요')}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">유형</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white">
                  <option value="group_buy">공동구매</option>
                  <option value="investment">투자</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">상태</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white">
                  <option value="active">활성 (모집중)</option>
                  <option value="upcoming">예정</option>
                  <option value="closed">마감</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">카테고리</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white">
                {['식품', '생활', '가전', '뷰티', '여행', '기타'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {form.type === 'group_buy' ? (
              <div className="grid grid-cols-2 gap-3">
                {input('판매가 (원) *', 'price', 'number', '0')}
                {input('정가 (원)', 'original_price', 'number', '0')}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {input('연 수익률 (%)', 'interest_rate', 'number', '10')}
                {input('기간 (개월)', 'duration_months', 'number', '12')}
              </div>
            )}

            {input('목표 금액 (원)', 'target_amount', 'number', '500000000')}
            {input('마감일', 'deadline', 'date')}
            {input('이미지 URL', 'image_url', 'url', 'https://...')}

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">상품 설명</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={4} placeholder="상품 상세 설명"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none resize-none focus:border-navy-700" />
            </div>

            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs font-semibold text-gray-700 mb-2">입금 계좌 정보</p>
              {input('은행', 'account_bank', 'text', '국민은행')}
              <div className="mt-3">{input('계좌번호', 'account_number', 'text', '1234-56-789012')}</div>
              <div className="mt-3">{input('예금주', 'account_holder', 'text', '홍길동')}</div>
            </div>

            <button onClick={handleSave} disabled={saving || !form.title || !form.price}
              className="w-full bg-navy-gradient text-white font-bold py-4 rounded-xl mt-2 relative overflow-hidden disabled:opacity-50">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gold-gradient" />
              {saving ? '저장 중...' : product ? '수정하기' : '등록하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
