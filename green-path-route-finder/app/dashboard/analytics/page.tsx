'use client'

import { useEffect, useState } from 'react'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { Card } from '@/components/ui/card'

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      const res = await fetch('/api/analytics')
      const result = await res.json()
      setData(result)
      setLoading(false)
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return <div className="p-10 text-white">Loading analytics...</div>
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Health Impact Center" />

      <div className="p-6 grid md:grid-cols-4 gap-4">

        <Card className="bg-slate-900 p-6">
          <h3 className="text-slate-400 text-sm">Live AQI</h3>
          <p className="text-3xl text-white font-bold">{data.aqi}</p>
        </Card>

        <Card className="bg-slate-900 p-6">
          <h3 className="text-slate-400 text-sm">PM 2.5</h3>
          <p className="text-3xl text-white font-bold">{data.pm25}</p>
        </Card>

        <Card className="bg-slate-900 p-6">
          <h3 className="text-slate-400 text-sm">PM 10</h3>
          <p className="text-3xl text-white font-bold">{data.pm10}</p>
        </Card>

        <Card className="bg-slate-900 p-6">
          <h3 className="text-slate-400 text-sm">Health Score</h3>
          <p className="text-3xl text-emerald-400 font-bold">
            {data.healthScore}
          </p>
        </Card>

      </div>
    </div>
  )
}
