'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Navbar } from '@/components/layout/Navbar'
import { Mail, Lock, Leaf, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function SignInPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!email || !password) {
        setError('Please enter email and password')
        setLoading(false)
        return
      }

      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }

      router.push('/dashboard')

    } catch (err) {
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24">
        <div className="max-w-md mx-auto px-4">
          <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm p-8">

            <div className="flex justify-center mb-8">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/50">
                <Leaf className="w-6 h-6 text-emerald-500" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-white text-center mb-2">
              Welcome Back
            </h1>

            <p className="text-slate-400 text-center text-sm mb-6">
              Sign in to your Green Pulse account
            </p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <Label className="text-white block mb-2">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white pl-10"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white block mb-2">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white pl-10"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold h-10"
              >
                {loading ? 'Signing in...' : 'Sign In'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-800">
              <p className="text-center text-sm text-slate-400">
                Don't have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="text-emerald-500 hover:text-emerald-400 font-semibold"
                >
                  Sign up
                </Link>
              </p>
            </div>

          </Card>
        </div>
      </div>
    </>
  )
}
