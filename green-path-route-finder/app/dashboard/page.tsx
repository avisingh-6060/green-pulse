'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { AQIWidget } from '@/components/dashboard/AQIWidget'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockAQIData } from '@/lib/mockData'
import { AQIData } from '@/lib/types'

interface RouteData {
  route_name: string
  distance: string
  time: string
  pollution: string
  aqi: number
  health_score: number
  coordinates: [number, number][]
}

export default function DashboardPage() {
  const router = useRouter()

  const [aqiData, setAqiData] = useState<AQIData | null>(null)
  const [routes, setRoutes] = useState<RouteData[]>([])
  const [recommended, setRecommended] = useState<RouteData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true)

  /* ================= Auth Protection ================= */
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/auth/signin')
        return
      }

      setCheckingAuth(false)
    }

    checkAuth()
  }, [router])

  /* ================= Fetch AQI ================= */
  useEffect(() => {
    if (checkingAuth) return

    const fetchAQI = async () => {
      try {
        const response = await fetch('/api/aqi?location=Lucknow')

        if (!response.ok) throw new Error('API not reachable')

        const data = await response.json()

        if (data?.success && data?.data) {
          setAqiData(data.data)
        } else {
          setAqiData(mockAQIData)
        }
      } catch {
        setAqiData(mockAQIData)
      }
    }

    fetchAQI()
  }, [checkingAuth])

  /* ================= Fetch Routes (Dynamic Sync) ================= */
  useEffect(() => {
    if (checkingAuth) return

    const fetchRoutes = async () => {
      try {
        // ✅ SAFE: Read last search
        const lastSearch =
          typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('lastSearch') || '{}')
            : {}

        const source = lastSearch.source || 'Charbagh'
        const destination =
          lastSearch.destination || 'Janeshwar Mishra Park'

        const res = await fetch(
          `http://localhost:5000/api/routes?source=${encodeURIComponent(
            source
          )}&destination=${encodeURIComponent(destination)}`
        )

        if (!res.ok) throw new Error('Routes API failed')

        const data = await res.json()

        if (data?.success && Array.isArray(data.routes)) {
          setRoutes(data.routes)
          setRecommended(data.recommended ?? null)
        } else {
          setRoutes([])
          setRecommended(null)
        }
      } catch {
        setRoutes([])
        setRecommended(null)
      } finally {
        setLoading(false)
      }
    }

    fetchRoutes()
  }, [checkingAuth])

  /* ================= Derived Real Stats ================= */
  const totalRoutes = routes.length

  const avgHealth =
    routes.length > 0
      ? Math.round(
          routes.reduce((sum, r) => sum + r.health_score, 0) / routes.length
        )
      : 0

  const bestAQI = recommended?.aqi ?? '--'

  /* ================= Pollution Badge ================= */
  const getPollutionColor = (level: string): string => {
    switch (level) {
      case 'Low':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
      case 'Moderate':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
      case 'High':
        return 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
      case 'Critical':
        return 'bg-red-500/20 text-red-400 border border-red-500/40'
      default:
        return 'bg-slate-500/20 text-slate-400 border border-slate-500/40'
    }
  }

  if (checkingAuth) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Checking authentication...
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Overview" />

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">

          {/* REAL SUMMARY STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-900 border-slate-800 p-6 text-center">
              <p className="text-slate-400 text-sm">Total Routes</p>
              <p className="text-3xl font-bold text-white mt-2">
                {totalRoutes}
              </p>
            </Card>

            <Card className="bg-slate-900 border-slate-800 p-6 text-center">
              <p className="text-slate-400 text-sm">Avg Health Score</p>
              <p className="text-3xl font-bold text-emerald-400 mt-2">
                {avgHealth}
              </p>
            </Card>

            <Card className="bg-slate-900 border-slate-800 p-6 text-center">
              <p className="text-slate-400 text-sm">Best Route AQI</p>
              <p className="text-3xl font-bold text-orange-400 mt-2">
                {bestAQI}
              </p>
            </Card>
          </div>

          {/* AQI + Routes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="lg:col-span-1">
              {aqiData && <AQIWidget data={aqiData} />}
            </div>

            <div className="lg:col-span-2">
              <Card className="bg-slate-900 border-slate-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Live Route Suggestions
                </h3>

                {loading ? (
                  <p className="text-slate-400">Loading routes...</p>
                ) : routes.length === 0 ? (
                  <p className="text-slate-400">No routes available</p>
                ) : (
                  <div className="space-y-3">
                    {routes.map((route, index) => {
                      const isRecommended =
                        recommended?.route_name === route.route_name

                      return (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-4 rounded-lg transition ${
                            isRecommended
                              ? 'bg-emerald-900/30 border border-emerald-500'
                              : 'bg-slate-800/50 hover:bg-slate-800'
                          }`}
                        >
                          <div>
                            <p className="text-sm font-medium text-white">
                              {route.route_name}
                              {isRecommended && (
                                <span className="ml-2 text-emerald-400">
                                  ⭐ Recommended
                                </span>
                              )}
                            </p>

                            <p className="text-xs text-slate-400 mt-1">
                              {route.distance} • {route.time}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-sm font-semibold text-white">
                                {route.health_score}
                              </p>
                              <p className="text-xs text-slate-400">Health</p>
                            </div>

                            <Badge className={getPollutionColor(route.pollution)}>
                              {route.pollution}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </Card>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
