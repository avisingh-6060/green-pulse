'use client'

import { StatsCard as StatsCardType } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

interface StatsCardProps {
  stat: StatsCardType
}

export function StatsCard({ stat }: StatsCardProps) {
  return (
    <Card className="bg-slate-900 border-slate-800 p-6 hover:border-emerald-500/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl">{stat.icon}</div>
        {stat.trend && (
          <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 rounded-full px-2 py-1">
            <TrendingUp className="w-3 h-3" />
            <span className="text-xs font-semibold">+{stat.trend}%</span>
          </div>
        )}
      </div>
      <p className="text-sm text-slate-400 mb-2">{stat.label}</p>
      <p className="text-3xl font-bold text-white">{stat.value}</p>
    </Card>
  )
}
