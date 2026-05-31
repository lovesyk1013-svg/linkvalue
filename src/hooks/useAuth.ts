'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

export function useAuth() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const isAdmin = profile?.role === 'admin'

  useEffect(() => {
    let mounted = true

    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user && mounted) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle()
          if (mounted) setProfile(data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && mounted) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle()
        if (mounted) setProfile(data)
      } else {
        if (mounted) setProfile(null)
      }
      if (mounted) setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return { profile, loading, isAdmin }
}
