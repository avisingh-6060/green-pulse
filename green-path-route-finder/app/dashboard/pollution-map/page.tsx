'use client'

import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { Card } from '@/components/ui/card'
import { MapPin, AlertCircle } from 'lucide-react'

export default function PollutionMapPage() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Pollution Map" />

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Map Placeholder */}
          <Card className="bg-slate-900 border-slate-800 h-96 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50" />
            <div className="relative text-center z-10">
              <MapPin className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400 text-lg font-semibold mb-2">Interactive Map</p>
              <p className="text-slate-500 text-sm">Integrate with Mapbox or Google Maps API</p>
            </div>
          </Card>

          {/* Legend and Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AQI Legend */}
            <Card className="bg-slate-900 border-slate-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">AQI Scale</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-white">Good (0-50)</p>
                    <p className="text-xs text-slate-400">Air quality is satisfactory</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-yellow-500" />
                  <div>
                    <p className="text-sm font-medium text-white">Moderate (51-100)</p>
                    <p className="text-xs text-slate-400">Acceptable for most</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-orange-500" />
                  <div>
                    <p className="text-sm font-medium text-white">Unhealthy (101-150)</p>
                    <p className="text-xs text-slate-400">Sensitive groups affected</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-red-500" />
                  <div>
                    <p className="text-sm font-medium text-white">Very Unhealthy (151+)</p>
                    <p className="text-xs text-slate-400">Everyone may be affected</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Real-time Data */}
            <Card className="bg-slate-900 border-slate-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Real-time Pollutants</h3>
              <div className="space-y-3">
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">PM 2.5</p>
                  <p className="text-lg font-semibold text-white">28 μg/m³</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">PM 10</p>
                  <p className="text-lg font-semibold text-white">45 μg/m³</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Ozone (O₃)</p>
                  <p className="text-lg font-semibold text-white">35 ppb</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">NO₂</p>
                  <p className="text-lg font-semibold text-white">42 ppb</p>
                </div>
              </div>
            </Card>

            {/* Tips */}
            <Card className="bg-emerald-500/10 border border-emerald-500/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-emerald-500" />
                Health Tips
              </h3>
              <ul className="space-y-3">
                <li className="text-sm text-emerald-100">✓ Use air quality data when planning routes</li>
                <li className="text-sm text-emerald-100">✓ Wear masks in high pollution areas</li>
                <li className="text-sm text-emerald-100">✓ Exercise in low AQI times</li>
                <li className="text-sm text-emerald-100">✓ Check forecasts regularly</li>
              </ul>
            </Card>
          </div>

          {/* Implementation Info */}
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <p className="text-sm text-slate-300">
              <strong>Next Steps:</strong> To implement real-time pollution mapping, integrate with AQI data providers like OpenWeatherMap, IQAir, or AirNow API, and use Mapbox GL JS or Google Maps API for interactive mapping and visualization.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
