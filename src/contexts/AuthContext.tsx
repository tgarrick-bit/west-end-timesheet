'use client'

import { createContext, useContext, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { User as AppUser } from '@/types'

interface AuthContextType {
  user: User | null
  appUser: AppUser | null
  session: Session | null
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


  const signIn = async (email: string, password: string) => {
    // Demo users for testing
    const demoUsers = [
      {
        id: '1',
        email: 'admin@westendworkforce.com',
        password: 'admin123',
        first_name: 'Tracy',
        last_name: 'Garrick',
        role: 'admin'
      },
      {
        id: '2',
        email: 'employee@westendworkforce.com',
        password: 'employee123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'employee'
      },
      {
        id: '3',
        email: 'manager@westendworkforce.com',
        password: 'manager123',
        first_name: 'Sarah',
        last_name: 'Johnson',
        role: 'client_approver'
      },
      {
        id: '4',
        email: 'payroll@westendworkforce.com',
        password: 'payroll123',
        first_name: 'Mike',
        last_name: 'Wilson',
        role: 'payroll'
      }
    ];

    const user = demoUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      setUser({ id: user.id, email: user.email } as User);
      setAppUser({ 
        id: user.id, 
        email: user.email, 
        first_name: user.first_name, 
        last_name: user.last_name, 
        role: user.role 
      } as AppUser);
      return { error: null };
    }
    
    return { error: new Error('Invalid email or password') };
  }

  const signUp = async (email: string, password: string, userData: Partial<AppUser>) => {
    return { error: new Error('Sign up not implemented in demo mode') }
  }

  const signOut = async () => {
    setUser(null)
    setAppUser(null)
    setSession(null)
  }

  const resetPassword = async (email: string) => {
    return { error: new Error('Password reset not implemented in demo mode') }
  }

  const value = {
    user,
    appUser,
    session,
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


