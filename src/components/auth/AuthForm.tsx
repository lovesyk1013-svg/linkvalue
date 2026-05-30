'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Eye, EyeOff, Lock, Mail, User, Phone } from 'lucide-react'

type Mode = 'login' | 'signup'

export default function AuthForm() {
  const [mode, setMode] = useState<Mode>('login')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        })
        if (error) throw error
        window.location.href = '/'
      } else {
        if (!form.name.trim()) throw new Error('이름을 입력해주세요.')
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { name: form.name, phone: form.phone } },
        })
        if (error) throw error
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email: form.email,
            name: form.name,
            phone: form.phone || null,
            role: 'user',
          })
        }
        setSuccess('회원가입이 완료되었습니다. 이메일을 확인해주세요.')
      }
    } catch (err: any) {
      const msg = err.message || '오류가 발생했습니다.'
      if (msg.includes('Invalid login')) setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      else if (msg.includes('already registered')) setError('이미 가입된 이메일입니다.')
      else setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      {/* Hero */}
      <div className="bg-navy-gradient px-6 pt-16 pb-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-white font-black text-4xl tracking-tight">L</span>
          <span className="text-gold-400 font-black text-4xl tracking-tight">V</span>
        </div>
        <div className="text-white font-bold text-xl tracking-[0.3em] mb-2">LINKVALUE</div>
        <p className="text-blue-200 text-sm">사람을 잇다, 가치를 만든다</p>
      </div>

      {/* Tab */}
      <div className="flex border-b border-gray-100">
        {(['login', 'signup'] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(''); setSuccess('') }}
            className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
              mode === m
                ? 'text-navy-900 border-b-2 border-navy-900'
                : 'text-gray-400'
            }`}
          >
            {m === 'login' ? '로그인' : '회원가입'}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-6 pt-6 gap-4">
        {mode === 'signup' && (
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              name="name" value={form.name} onChange={handleChange} required
              placeholder="이름" type="text"
              className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100"
            />
          </div>
        )}

        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            name="email" value={form.email} onChange={handleChange} required
            placeholder="이메일" type="email"
            className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100"
          />
        </div>

        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            name="password" value={form.password} onChange={handleChange} required
            placeholder="비밀번호 (8자 이상)" type={showPw ? 'text' : 'password'}
            minLength={8}
            className="w-full pl-10 pr-10 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100"
          />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {showPw ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
          </button>
        </div>

        {mode === 'signup' && (
          <div className="relative">
            <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              name="phone" value={form.phone} onChange={handleChange}
              placeholder="연락처 (선택)" type="tel"
              className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100"
            />
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-xl border border-green-100">
            {success}
          </div>
        )}

        <button
          type="submit" disabled={loading}
          className="w-full bg-navy-gradient text-white font-bold py-4 rounded-xl mt-2 relative overflow-hidden disabled:opacity-60 active:scale-[0.98] transition-transform"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              처리 중...
            </span>
          ) : (
            <span>{mode === 'login' ? '로그인' : '가입하기'}</span>
          )}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gold-gradient" />
        </button>

        {mode === 'login' && (
          <p className="text-center text-xs text-gray-400 mt-2">
            아직 회원이 아니신가요?{' '}
            <button type="button" onClick={() => setMode('signup')} className="text-navy-700 font-semibold">
              회원가입
            </button>
          </p>
        )}
      </form>

      <p className="text-center text-xs text-gray-300 py-6">
        © 2024 LinkValue. All rights reserved.
      </p>
    </div>
  )
}
