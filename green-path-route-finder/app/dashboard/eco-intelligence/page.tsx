'use client'

import { useEffect, useState } from 'react'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { Card } from '@/components/ui/card'

interface RouteData {
  id: number
  source: string
  destination: string
  distance: string
  time: string
  pollution: string
  health_score: number
  created_at: string
}

export default function EcoIntelligencePage() {
  const [routes, setRoutes] = useState<RouteData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRoutes() {
      try {
        const res = await fetch(
          'http://localhost:5000/api/routes/history'
        )

        if (!res.ok) {
          throw new Error('Failed to fetch routes')
        }

        const json = await res.json()

        // Backend returns { success: true, data: [...] }
        setRoutes(json.data || [])
      } catch (error) {
        console.error('Failed to fetch routes:', error)
        setRoutes([])
      } finally {
        setLoading(false)
      }
    }

    fetchRoutes()
  }, [])

  if (loading) {
    return (
      <div className="p-10 text-white">
        Loading Eco Intelligence...
      </div>
    )
  }

  const totalRoutes = routes.length

  const avgHealth =
    totalRoutes > 0
      ? Math.round(
          routes.reduce(
            (acc, route) => acc + route.health_score,
            0
          ) / totalRoutes
        )
      : 0

  // AQI not stored in history table → using pollution level mapping
  const avgAQI =
    totalRoutes > 0
      ? Math.round(
          routes.reduce((acc, route) => {
            if (route.pollution === 'Low') return acc + 40
            if (route.pollution === 'Moderate') return acc + 90
            if (route.pollution === 'High') return acc + 160
            return acc + 250
          }, 0) / totalRoutes
        )
      : 0

  const sortedRoutes =
    totalRoutes > 0
      ? [...routes].sort(
          (a, b) => b.health_score - a.health_score
        )
      : []

  const bestRoute = sortedRoutes[0]
  const worstRoute =
    sortedRoutes.length > 0
      ? sortedRoutes[sortedRoutes.length - 1]
      : undefined

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Eco Intelligence" />

      <div className="flex-1 overflow-auto p-6 space-y-6">

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4">

          <Card className="bg-slate-900 border-slate-800 p-6">
            <h3 className="text-sm text-slate-400">
              Total Routes Analyzed
            </h3>
            <p className="text-3xl font-bold text-white mt-2">
              {totalRoutes}
            </p>
          </Card>

          <Card className="bg-slate-900 border-slate-800 p-6">
            <h3 className="text-sm text-slate-400">
              Average Health Score
            </h3>
            <p className="text-3xl font-bold text-emerald-400 mt-2">
              {avgHealth}
            </p>
          </Card>

          <Card className="bg-slate-900 border-slate-800 p-6">
            <h3 className="text-sm text-slate-400">
              Average AQI Faced
            </h3>
            <p className="text-3xl font-bold text-orange-400 mt-2">
              {avgAQI}
            </p>
          </Card>

        </div>

        {/* Insight Card */}
        <Card className="bg-emerald-500/10 border border-emerald-500/40 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            Behavioral Insight
          </h3>

          <p className="text-sm text-emerald-100">
            Based on your historical routes, your average pollution exposure
            corresponds to an AQI of {avgAQI}. Maintaining routes below this
            level could improve your health score significantly.
          </p>
        </Card>

        {/* Route Ranking */}
        <Card className="bg-slate-900 border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Route Performance Ranking
          </h3>

          {sortedRoutes.length === 0 ? (
            <p className="text-slate-400 text-sm">
              No route data available.
            </p>
          ) : (
            <div className="space-y-3">
              {sortedRoutes.map((route, index) => (
                <div
                  key={route.id}
                  className="flex justify-between items-center bg-slate-800 p-3 rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium">
                      {route.source} → {route.destination}
                    </p>
                    <p className="text-xs text-slate-400">
                      Distance: {route.distance} | Time: {route.time}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-emerald-400 font-bold">
                      {route.health_score}
                    </p>
                    <p className="text-xs text-slate-400">
                      Rank #{index + 1}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Best & Worst */}
        {bestRoute && worstRoute && (
          <div className="grid md:grid-cols-2 gap-4">

            <Card className="bg-emerald-500/10 border border-emerald-500/40 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                🥇 Best Performing Route
              </h3>
              <p className="text-emerald-100 text-sm">
                {bestRoute.source} → {bestRoute.destination} achieved
                the highest health score of {bestRoute.health_score}.
              </p>
            </Card>

            <Card className="bg-red-500/10 border border-red-500/40 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                🔴 Most Polluted Route
              </h3>
              <p className="text-red-200 text-sm">
                {worstRoute.source} → {worstRoute.destination} had
                the lowest health score of {worstRoute.health_score}.
              </p>
            </Card>

          </div>
        )}

      </div>
    </div>
  )
}
