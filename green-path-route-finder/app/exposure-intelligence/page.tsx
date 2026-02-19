'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface RouteResult {
  name: string
  distance: number
  duration: string
  aqi: number
  exposure: number
  risk: 'Low' | 'Medium' | 'High'
  via: string[]
}

interface TempRoute {
  name: string
  distance: number
  duration: string
  baseAqi: number
  exposure: number
  via: string[]
}

export default function ExposureIntelligence() {
  const [from, setFrom] = useState<string>('')
  const [to, setTo] = useState<string>('')
  const [routes, setRoutes] = useState<RouteResult[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const normalizeLocation = (value: string): string => {
    return value
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (char: string) => char.toUpperCase())
  }

  const calculateRisk = (exposure: number): 'Low' | 'Medium' | 'High' => {
    if (exposure < 200) return 'Low'
    if (exposure < 400) return 'Medium'
    return 'High'
  }

  const generateHealthImpact = (
    exposure: number,
    isSafest: boolean
  ) => {
    const cigarettes =
      exposure > 0 ? Math.max(1, Math.round(exposure / 400)) : 0

    const indoorHours =
      exposure > 0 ? Math.max(1, Math.round(exposure / 250)) : 0

    if (isSafest) {
      return {
        cigarettes,
        indoorHours,
        tone: 'text-green-400',
        message:
          'This is the lowest exposure route available. Healthier option selected.',
      }
    }

    return {
      cigarettes,
      indoorHours,
      tone: 'text-red-400',
      message:
        'Higher pollution exposure detected compared to the recommended route.',
    }
  }

  const getPlaceName = async (
    lat: number,
    lon: number
  ): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      )
      const data = await res.json()

      return (
        data?.address?.suburb ||
        data?.address?.neighbourhood ||
        data?.address?.road ||
        ''
      )
    } catch {
      return ''
    }
  }

  const handleCalculate = async (): Promise<void> => {
    if (!from || !to) return

    try {
      setLoading(true)

      const formattedFrom = normalizeLocation(from)
      const formattedTo = normalizeLocation(to)

      const routeRes = await fetch(
        `/api/routes?source=${encodeURIComponent(
          formattedFrom
        )}&destination=${encodeURIComponent(formattedTo)}`
      )

      if (!routeRes.ok) {
        throw new Error('Route API failed')
      }

      const routeData = await routeRes.json()

      if (!routeData?.routes || routeData.routes.length === 0) {
        alert('No routes found')
        setRoutes([])
        setLoading(false)
        return
      }

      const rawRoutes = routeData.routes.slice(0, 2)

      const tempRoutes: TempRoute[] = await Promise.all(
        rawRoutes.map(async (route: any, index: number) => {
          const distanceValue: number =
            typeof route.rawDistance === 'number'
              ? route.rawDistance
              : parseFloat(route.distance)

          const baseAqi: number = route.aqi || 0
          const exposure: number = distanceValue * baseAqi * 0.5

          let viaNames: string[] = []

          if (rawRoutes.length > 1 && route.coordinates?.length > 6) {
            const coordinates = route.coordinates

            const mid1 =
              coordinates[Math.floor(coordinates.length / 3)]
            const mid2 =
              coordinates[Math.floor((coordinates.length * 2) / 3)]

            const place1 = await getPlaceName(mid1[0], mid1[1])
            const place2 = await getPlaceName(mid2[0], mid2[1])

            viaNames = [place1, place2].filter(Boolean)
          }

          return {
            name: route.route_name || `Route ${index + 1}`,
            distance: distanceValue,
            duration: route.time || '',
            baseAqi,
            exposure,
            via: viaNames,
          }
        })
      )

      const maxExposure: number = Math.max(
        ...tempRoutes.map((r) => r.exposure)
      )

      const calculatedRoutes: RouteResult[] = tempRoutes.map(
        (route: TempRoute) => {
          let adjustedAqi: number = route.baseAqi

          if (maxExposure > 0) {
            const exposureRatio: number =
              route.exposure / maxExposure
            adjustedAqi = Math.round(
              route.baseAqi * (0.85 + exposureRatio * 0.3)
            )
          }

          return {
            name: route.name,
            distance: route.distance,
            duration: route.duration,
            aqi: adjustedAqi,
            exposure: route.exposure,
            risk: calculateRisk(route.exposure),
            via: route.via,
          }
        }
      )

      setRoutes(calculatedRoutes)
      setLoading(false)
    } catch (error) {
      console.error(error)
      alert('Error analyzing routes')
      setLoading(false)
    }
  }

  const safestRoute =
    routes.length > 0
      ? routes.reduce((prev, curr) =>
          curr.exposure < prev.exposure ? curr : prev
        )
      : null

  const getMeterColor = (risk: 'Low' | 'Medium' | 'High'): string => {
    if (risk === 'Low') return 'bg-green-500'
    if (risk === 'Medium') return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getMeterWidth = (exposure: number): string => {
    if (!routes.length) return '0%'
    const max: number = Math.max(
      ...routes.map((r) => r.exposure)
    )
    return `${(exposure / max) * 100}%`
  }

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-slate-950 pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4 text-center">

          {/* INPUT SECTION */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-10">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Input
                placeholder="Source"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
              <Input
                placeholder="Destination"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <Button
              onClick={handleCalculate}
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 text-white w-full"
            >
              {loading ? 'Analyzing Routes...' : 'Compare Exposure'}
            </Button>
          </div>

          {/* EMPTY STATE */}
          {routes.length === 0 && (
            <p className="text-slate-400">
              Enter source and destination to analyze exposure.
            </p>
          )}

          {/* ROUTE CARDS */}
          {routes.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8">
              {routes.map((route, index) => {
                const isSafest =
                  safestRoute?.name === route.name

                const impact = generateHealthImpact(
                  route.exposure,
                  isSafest
                )

                return (
                  <div
                    key={index}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg text-left relative"
                  >
                    {isSafest && (
                      <div className="absolute top-4 right-4 text-xs bg-emerald-500 text-white px-3 py-1 rounded-full">
                        AI Recommended
                      </div>
                    )}

                    <h3 className="text-xl font-semibold text-white mb-4">
                      {route.name}
                    </h3>

                    <p className="text-slate-400 mb-2">
                      AQI: <span className="text-white">{route.aqi}</span>
                    </p>

                    <p className="text-slate-400 mb-2">
                      Exposure Index:{' '}
                      <span className="text-white">
                        {route.exposure.toFixed(1)}
                      </span>
                    </p>

                    <div className="mt-4 p-4 rounded-lg bg-slate-800 border border-slate-700">
                      <h4 className="text-sm font-semibold text-emerald-400 mb-2">
                        🧠 AI Health Impact
                      </h4>

                      <p className={`text-sm ${impact.tone}`}>
                        🫁 This route equals smoking {impact.cigarettes}{' '}
                        cigarette{impact.cigarettes !== 1 ? 's' : ''}.
                      </p>

                      <p className={`text-sm ${impact.tone}`}>
                        🚶 This commute equals {impact.indoorHours}{' '}
                        hour{impact.indoorHours !== 1 ? 's' : ''} of indoor pollution exposure.
                      </p>

                      <p className="text-xs text-slate-400 mt-2">
                        {impact.message}
                      </p>
                    </div>

                    <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden mt-4">
                      <div
                        className={`${getMeterColor(route.risk)} h-3 transition-all duration-500`}
                        style={{
                          width: getMeterWidth(route.exposure),
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

        </div>
      </section>

      <Footer />
    </>
  )
}
