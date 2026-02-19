'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { User, Bell, Shield, Zap } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [notifications, setNotifications] = useState(true)
  const [dataSharing, setDataSharing] = useState(false)
  const [saving, setSaving] = useState(false)

  /* ================================
     Load Logged In User
  ================================= */
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.replace('/auth/signin')
        return
      }

      setEmail(data.user.email ?? '')

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', data.user.id)
        .single()

      if (profile?.full_name) {
        setName(profile.full_name)
      }
    }

    loadUser()
  }, [router])

  /* ================================
     Save Profile Changes
  ================================= */
  const handleSave = async () => {
    setSaving(true)

    const { data } = await supabase.auth.getUser()
    if (!data.user) return

    // Update full name
    await supabase
      .from('profiles')
      .update({ full_name: name })
      .eq('id', data.user.id)

    // Update password if entered
    if (password.trim() !== '') {
      await supabase.auth.updateUser({ password })
    }

    setSaving(false)
    alert('Settings updated successfully!')
  }

  /* ================================
     Logout
  ================================= */
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/auth/signin')
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Settings" />

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">

          {/* Profile Settings */}
          <Card className="bg-slate-900 border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <User className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-white">Profile Settings</h3>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <Label className="text-white block mb-2">Full Name</Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div>
                <Label className="text-white block mb-2">Email Address</Label>
                <Input
                  type="email"
                  value={email}
                  disabled
                  className="bg-slate-800 border-slate-700 text-white opacity-70"
                />
              </div>

              <div>
                <Label className="text-white block mb-2">Change Password</Label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-slate-900 border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Bell className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-white">Push Notifications</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Get alerts about air quality changes
                  </p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
            </div>
          </Card>

          {/* Privacy Settings */}
          <Card className="bg-slate-900 border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Shield className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-white">Privacy & Data</h3>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-white">Share Anonymous Data</p>
                <p className="text-xs text-slate-400 mt-1">
                  Help improve air quality predictions
                </p>
              </div>
              <Switch checked={dataSharing} onCheckedChange={setDataSharing} />
            </div>
          </Card>

          {/* Advanced + Logout */}
          <Card className="bg-slate-900 border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Zap className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-white">Account</h3>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full text-red-400 border-slate-700 hover:bg-red-500/10"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </Card>

        </div>
      </div>
    </div>
  )
}
