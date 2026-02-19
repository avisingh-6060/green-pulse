'use client'

import { Route } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Clock, MapPin, Zap, Wind } from 'lucide-react'

interface RouteCardProps {
  route: Route
  onSelect?: () => void
}

export function RouteCard({ route, onSelect }: RouteCardProps) {
  const getPollutionColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
      case 'Moderate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      case 'High':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50'
      case 'Critical':
        return 'bg-red-500/20 text-red-400 border-red-500/50'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50'
    }
  }

  return (
    <Card className="bg-slate-900 border-slate-800 p-6 hover:border-emerald-500/50 transition-colors cursor-pointer group">
      <div className="space-y-4">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-white text-lg mb-1">
              {route.route_name || route.name}
            </h3>
          </div>

          <Badge className={getPollutionColor(route.pollution)}>
            {route.pollution}
          </Badge>
        </div>

        {/* Time & Distance */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span className="text-sm">{route.time}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <span className="text-sm">{route.distance}</span>
          </div>
        </div>

        {/* AQI Display (Smart Suggestion Added) */}
        {route.aqi !== undefined && (
          <div className="flex items-center justify-between bg-slate-800/40 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-semibold text-white">
                Air Quality
              </span>
            </div>
            <span className="text-sm font-semibold text-slate-300">
              AQI: {route.aqi} ({route.pollution})
            </span>
          </div>
        )}

        {/* Health Score */}
        <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold text-white">
              Health Score
            </span>
          </div>
          <span className="text-lg font-bold text-emerald-500">
            {route.healthScore}
          </span>
        </div>

        {/* Button */}
        <Button
          onClick={onSelect}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition"
        >
          Select Route <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

      </div>
    </Card>
  )
}
