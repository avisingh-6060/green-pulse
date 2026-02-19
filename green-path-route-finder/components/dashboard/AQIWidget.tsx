'use client'

import { AQIData } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Wind, AlertCircle } from 'lucide-react'

interface AQIWidgetProps {
  data: AQIData
}

export function AQIWidget({ data }: AQIWidgetProps) {
  const getAQIColor = (value: number) => {
    if (value <= 50) return 'text-emerald-500'
    if (value <= 100) return 'text-yellow-500'
    if (value <= 150) return 'text-orange-500'
    return 'text-red-500'
  }

  const getAQILabel = (value: number) => {
    if (value <= 50) return 'Good'
    if (value <= 100) return 'Moderate'
    if (value <= 150) return 'Unhealthy for Sensitive Groups'
    return 'Unhealthy'
  }

  const getHealthAdvisory = (value: number) => {
    if (value <= 50)
      return {
        text: 'Air quality is good. Safe for outdoor activities.',
        color: 'text-emerald-400',
        border: 'border-emerald-500/50',
        bg: 'bg-emerald-500/10',
      }

    if (value <= 100)
      return {
        text: 'Moderate air quality. Sensitive individuals should limit prolonged exposure.',
        color: 'text-yellow-400',
        border: 'border-yellow-500/50',
        bg: 'bg-yellow-500/10',
      }

    if (value <= 150)
      return {
        text: 'Unhealthy for sensitive groups. Reduce outdoor exertion.',
        color: 'text-orange-400',
        border: 'border-orange-500/50',
        bg: 'bg-orange-500/10',
      }

    return {
      text: 'Unhealthy air quality. Limit outdoor activities.',
      color: 'text-red-400',
      border: 'border-red-500/50',
      bg: 'bg-red-500/10',
    }
  }

  const advisory = getHealthAdvisory(data.overall)

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Air Quality Index</h3>
        <Wind className="w-5 h-5 text-emerald-500" />
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <div className={`text-5xl font-bold ${getAQIColor(data.overall)} mb-2`}>
            {data.overall}
          </div>
          <p className="text-sm text-slate-400">{getAQILabel(data.overall)}</p>
          <p className="text-xs text-slate-500 mt-2">{data.location}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">PM 2.5</p>
            <p className="text-lg font-semibold text-white">{data.pm25}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">PM 10</p>
            <p className="text-lg font-semibold text-white">{data.pm10}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">O₃</p>
            <p className="text-lg font-semibold text-white">{data.o3}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">NO₂</p>
            <p className="text-lg font-semibold text-white">{data.no2}</p>
          </div>
        </div>

        {/* Dynamic Advisory */}
        <div className={`${advisory.bg} border ${advisory.border} rounded-lg p-3 flex gap-2`}>
          <AlertCircle className={`w-4 h-4 ${advisory.color} flex-shrink-0 mt-0.5`} />
          <p className={`text-sm ${advisory.color}`}>
            {advisory.text}
          </p>
        </div>
      </div>
    </Card>
  )
}
