'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const pathname = usePathname()

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Overview', href: '/dashboard' },
    { name: 'Route Finder', href: '/dashboard/route-finder' },
    { name: 'Eco Intelligence', href: '/dashboard/eco-intelligence' },
    { name: 'Exposure Intelligence', href: '/exposure-intelligence' },
    
    // ✅ NEW FEATURE TAB (AirGuard 360™)
    { name: 'AirGuard 360™', href: '/dashboard/airguard-360' },

    { name: 'Settings', href: '/dashboard/settings' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition">
            <Leaf className="w-6 h-6 text-emerald-500" />
          </div>
          <span className="text-xl font-bold text-white hidden sm:inline">
            Green Pulse
          </span>
        </Link>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors duration-200 ${
                  isActive
                    ? 'text-emerald-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </div>

        {/* Right Auth */}
        <div className="flex items-center gap-4">
          <Link
            href="/auth/signin"
            className="text-sm text-slate-300 hover:text-white transition"
          >
            Sign In
          </Link>

          <Link href="/auth/signup">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
              Sign Up
            </Button>
          </Link>
        </div>

      </div>
    </nav>
  )
}
