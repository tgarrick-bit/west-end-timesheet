'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { User as AppUser } from '@/types'
import { convertEnhancedUserToAppUser } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  appUser: AppUser | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, userData: Partial<AppUser>) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchAppUser(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchAppUser(session.user.id)
      } else {
        setAppUser(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchAppUser(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching app user:', error)
        return
      }

      setAppUser(data)
    } catch (error) {
      console.error('Error fetching app user:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    // Demo accounts for testing
    const demoUsers = [
      {
        id: 'admin-demo',
        email: 'admin@westendworkforce.com',
        password: 'admin123',
        first_name: 'Tracy',
        last_name: 'Garrick',
        role: 'admin'
      },
      {
        id: 'employee-demo',
        email: 'employee@westendworkforce.com', 
        password: 'employee123',
        first_name: 'John',
        last_name: 'Smith',
        role: 'employee'
      },
      {
        id: 'manager-demo',
        email: 'jane.smith@abccorp.com',
        password: 'manager123',
        first_name: 'Jane',
        last_name: 'Smith',
        role: 'manager',
        company: 'ABC Corporation'
      }
    ]

    // Check demo users first
    const demoUser = demoUsers.find(u => u.email === email && u.password === password)
    if (demoUser) {
      const userData = { 
        id: demoUser.id, 
        email: demoUser.email, 
        first_name: demoUser.first_name, 
        last_name: demoUser.last_name, 
        role: demoUser.role,
        client_id: undefined,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        company: demoUser.company || undefined
      } as AppUser

      setUser({ id: demoUser.id, email: demoUser.email } as User)
      setAppUser(userData)
      
      // Role-based routing after successful login
      if (demoUser.role === 'admin') {
        router.push('/admin')
      } else if (demoUser.role === 'manager') {
        router.push('/manager')
      } else if (demoUser.role === 'employee') {
        router.push('/dashboard')
      }
      
      return { error: null }
    }

    // If not demo user, try Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, userData: Partial<AppUser>) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (!error && userData) {
      // Create user profile in our users table
      const { error: profileError } = await supabase
        .from('users')
        .insert([{
          id: userData.id || '',
          email: userData.email || email,
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          role: userData.role || 'employee',
          client_id: userData.client_id,
          is_active: true,
        }])
      
      if (profileError) {
        console.error('Error creating user profile:', profileError)
      }
    }
    
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  }

  const value = {
    user,
    appUser,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}


