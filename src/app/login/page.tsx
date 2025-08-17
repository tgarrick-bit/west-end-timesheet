'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState<string | null>(null)

  const sendLink = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email })
    setMsg(error ? error.message : 'Check your email for the magic link.')
  }

  return (
    <div className="p-8 max-w-md">
      <h1 className="text-xl font-semibold mb-4">Sign in</h1>
      <input className="border rounded px-3 py-2 w-full mb-3"
        type="email" placeholder="you@company.com"
        value={email} onChange={e=>setEmail(e.target.value)} />
      <button className="bg-black text-white rounded px-4 py-2" onClick={sendLink}>
        Send magic link
      </button>
      {msg && <p className="mt-3">{msg}</p>}
    </div>
  )
}
