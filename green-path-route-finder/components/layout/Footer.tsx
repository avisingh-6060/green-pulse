'use client'

import Link from 'next/link'
import { Leaf } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-5 h-5 text-emerald-500" />
              <span className="text-lg font-bold text-white">Green Pulse</span>
            </div>
            <p className="text-sm text-slate-400">  Choose the route your lungs prefer.</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-slate-400 hover:text-emerald-500 transition">Routes</Link></li>
              <li><Link href="#" className="text-sm text-slate-400 hover:text-emerald-500 transition">Analytics</Link></li>
              <li><Link href="#" className="text-sm text-slate-400 hover:text-emerald-500 transition">API</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-slate-400 hover:text-emerald-500 transition">About</Link></li>
              <li><Link href="#" className="text-sm text-slate-400 hover:text-emerald-500 transition">Blog</Link></li>
              <li><Link href="#" className="text-sm text-slate-400 hover:text-emerald-500 transition">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-slate-400 hover:text-emerald-500 transition">Privacy</Link></li>
              <li><Link href="#" className="text-sm text-slate-400 hover:text-emerald-500 transition">Terms</Link></li>
              <li><Link href="#" className="text-sm text-slate-400 hover:text-emerald-500 transition">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <p className="text-center text-sm text-slate-400">
            © 2024 Green Pulse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
