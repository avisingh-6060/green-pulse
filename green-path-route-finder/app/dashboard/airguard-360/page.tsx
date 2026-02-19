'use client'

import { Card } from '@/components/ui/card'
import { useEffect, useRef, useState } from 'react'

export default function AirGuardPage() {
  const [condition, setCondition] = useState('Normal')
  const [outdoorHours, setOutdoorHours] = useState(2)

  const [lungStress, setLungStress] = useState(0)
  const [exposureScore, setExposureScore] = useState(0)
  const [riskLevel, setRiskLevel] = useState('Low')
  const [lifeGain, setLifeGain] = useState(0)
  const [aiInsight, setAiInsight] = useState('')

  const [liveMode, setLiveMode] = useState(false)
  const [currentAQI, setCurrentAQI] = useState<number | null>(null)
  const [zone, setZone] =
    useState<'safe' | 'moderate' | 'high' | 'critical'>('safe')
  const previousZone =
    useRef<'safe' | 'moderate' | 'high' | 'critical'>('safe')
  const [showAlert, setShowAlert] = useState(false)
  const [muteBeep, setMuteBeep] = useState(false)

  // 🧪 DEMO MODE (for judges)
  const [demoMode, setDemoMode] = useState(false)

  const getMultiplier = () => {
    if (condition === 'Asthma') return 1.4
    if (condition === 'COPD') return 1.8
    return 1
  }

  // ---------------- LUNG LOGIC ----------------
  useEffect(() => {
    const multiplier = getMultiplier()

    let baseStress = 0
    if (outdoorHours <= 1) baseStress = 20
    else if (outdoorHours <= 2) baseStress = 35
    else if (outdoorHours <= 4) baseStress = 55
    else if (outdoorHours <= 6) baseStress = 75
    else baseStress = 90

    const lung = Math.min(Math.floor(baseStress * multiplier), 100)

    setExposureScore(lung)
    setLungStress(lung)

    const safeBaseline = 35
    const difference = lung - safeBaseline
    const estimatedLifeGain =
      difference > 0 ? Number((difference / 25).toFixed(1)) : 0

    setLifeGain(estimatedLifeGain)

    if (lung <= 30) setRiskLevel('Minimal')
    else if (lung <= 50) setRiskLevel('Low')
    else if (lung <= 70) setRiskLevel('Moderate')
    else if (lung <= 85) setRiskLevel('High')
    else setRiskLevel('Critical')

    let insight = ''
    if (lung <= 30)
      insight =
        'Air exposure is within safe limits. Maintain current travel habits.'
    else if (lung <= 50)
      insight =
        'Moderate exposure detected. Try reducing outdoor activity during peak traffic hours.'
    else if (lung <= 70)
      insight =
        'Elevated respiratory load. Prefer indoor transit options.'
    else if (lung <= 85)
      insight =
        'High pollution stress detected. N95 mask recommended.'
    else insight = 'Critical exposure risk. Avoid outdoor activity.'

    setAiInsight(insight)
  }, [condition, outdoorHours])

  // ---------------- AQI ZONE ----------------
  const getZone = (aqi: number) => {
    if (aqi <= 100) return 'safe'
    if (aqi <= 150) return 'moderate'
    if (aqi <= 200) return 'high'
    return 'critical'
  }

  // ---------------- REAL LIVE MODE ----------------
  useEffect(() => {
    if (!liveMode) return

    const fetchAQI = async () => {
      try {
        if (!navigator.geolocation) return

        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords

          const res = await fetch(
            `/api/aqi?lat=${latitude}&lng=${longitude}`
          )
          if (!res.ok) return

          const data = await res.json()
          const aqi = data?.data?.overall
          if (!aqi) return

          setCurrentAQI(aqi)

          const newZone = getZone(aqi)
          const prevZone = previousZone.current
          setZone(newZone)

          const order = ['safe', 'moderate', 'high', 'critical']

          if (order.indexOf(newZone) > order.indexOf(prevZone)) {
            setShowAlert(true)
            triggerBeep(newZone)
          }

          if (order.indexOf(newZone) < order.indexOf(prevZone)) {
            setShowAlert(false)
          }

          previousZone.current = newZone
        })
      } catch (err) {
        console.error(err)
      }
    }

    fetchAQI()
    const interval = setInterval(fetchAQI, 30000)
    return () => clearInterval(interval)
  }, [liveMode, muteBeep])

  // ---------------- DEMO MODE ----------------
  useEffect(() => {
    if (!demoMode) return

    const fakeAQI = 220
    setCurrentAQI(fakeAQI)
    setZone('critical')
    setShowAlert(true)
    triggerBeep('critical')
  }, [demoMode])

  // ---------------- BEEP FUNCTION ----------------
 const triggerBeep = (zoneLevel: string) => {
  if (muteBeep) return

  try {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext

    const audioCtx = new AudioContextClass()

    const playBeep = (delay: number) => {
      setTimeout(() => {
        const oscillator = audioCtx.createOscillator()
        const gainNode = audioCtx.createGain()

        oscillator.type = 'sine'
        oscillator.frequency.value =
          zoneLevel === 'critical' ? 1000 : 800

        gainNode.gain.value = 0.25

        oscillator.connect(gainNode)
        gainNode.connect(audioCtx.destination)

        oscillator.start()

        setTimeout(() => {
          oscillator.stop()
        }, 250)
      }, delay)
    }

    // 🔊 Beep-Beep-Beep pattern
    playBeep(0)
    playBeep(400)
    playBeep(800)

    setTimeout(() => {
      audioCtx.close()
    }, 1200)

  } catch (err) {
    console.error('Beep error:', err)
  }
}


  const arcLength = 251
  const dashOffset = arcLength - (lungStress / 100) * arcLength

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white p-6 pt-24 relative">

      {/* Live Toggle */}
      <div className="fixed top-24 right-6 z-40 bg-slate-800/90 border border-slate-700 p-3 rounded-xl shadow-lg flex items-center gap-3">
        <span className="text-xs text-slate-300">Live Mode</span>
        <input
          type="checkbox"
          checked={liveMode}
          onChange={() => setLiveMode(!liveMode)}
          className="accent-emerald-500"
        />
        {liveMode && (
          <>
            <span className="text-xs text-slate-400">Beep</span>
            <input
              type="checkbox"
              checked={!muteBeep}
              onChange={() => setMuteBeep(!muteBeep)}
              className="accent-red-500"
            />
          </>
        )}
      </div>

      {/* Demo Button */}
      <button
        onClick={() => {
          setDemoMode(!demoMode)
          if (demoMode) setShowAlert(false)
        }}
        className="fixed top-40 right-6 z-40 bg-yellow-500 hover:bg-yellow-600 text-black text-xs px-3 py-2 rounded-lg shadow-lg"
      >
        {demoMode ? 'Stop Demo Alert' : 'Trigger Demo Alert'}
      </button>

      {/* Alert */}
      {showAlert && currentAQI && (
        <div className="fixed top-56 right-6 bg-red-600 text-white p-4 rounded-xl shadow-lg z-50 max-w-sm animate-pulse shadow-red-500/40">

          <h3 className="font-bold text-lg">⚠ Air Quality Warning</h3>
          <p className="text-sm mt-2">
            AQI: {currentAQI} — {zone.toUpperCase()}
          </p>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-emerald-400 tracking-wide">
            AirGuard 360™
          </h1>
          <p className="text-slate-300 mt-3 text-lg">
            Personalized Environmental Health Intelligence
          </p>
        </div>

        {/* Profile */}
        <Card className="p-6 bg-slate-800 border border-slate-700 rounded-xl">
          <h2 className="text-lg font-semibold mb-4 text-white">
            Personal Health Profile
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
            >
              <option>Normal</option>
              <option>Asthma</option>
              <option>COPD</option>
            </select>
            <input
              type="number"
              min={1}
              max={12}
              value={outdoorHours}
              onChange={(e) => setOutdoorHours(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
            />
          </div>
        </Card>

        {/* Metrics */}
        <div className="grid md:grid-cols-3 gap-8">

          <Card className="p-6 bg-slate-800 border border-slate-700 rounded-xl text-center">
            <h2 className="text-lg font-semibold mb-4 text-white">
              Lung Stress Index
            </h2>
            <svg viewBox="0 0 200 120" className="w-64 mx-auto">
              <path
                d="M20 100 A80 80 0 0 1 180 100"
                fill="none"
                stroke="#1e293b"
                strokeWidth="18"
              />
              <path
                d="M20 100 A80 80 0 0 1 180 100"
                fill="none"
                stroke={
                  lungStress <= 30
    ? '#22c55e'
    : lungStress <= 50
    ? '#4ade80'
    : lungStress <= 70
    ? '#facc15'
    : lungStress <= 85
    ? '#f97316'
    : '#ef4444'
                }
                strokeWidth="18"
                strokeDasharray={arcLength}
                strokeDashoffset={dashOffset}
                className="transition-all duration-700 ease-in-out"
              />
            </svg>
            <p className="text-xl font-bold mt-4 text-white">
              {lungStress}%
            </p>
          </Card>

          <Card className="p-6 bg-slate-800 border border-slate-700 rounded-xl">
            <h2 className="text-lg font-semibold mb-4 text-white">
              Pollution Exposure Score
            </h2>
            <p className="text-4xl font-bold text-emerald-400">
              {exposureScore}
            </p>
          </Card>

          <Card className="p-6 bg-slate-800 border border-slate-700 rounded-xl">
            <h2 className="text-lg font-semibold mb-4 text-white">
              Health Risk Status
            </h2>
            <p className={`text-3xl font-bold ${
              riskLevel === 'Minimal'
                ? 'text-green-500'
                : riskLevel === 'Low'
                ? 'text-green-400'
                : riskLevel === 'Moderate'
                ? 'text-yellow-400'
                : riskLevel === 'High'
                ? 'text-orange-500'
                : 'text-red-500'
            }`}>
              {riskLevel}
            </p>
          </Card>
        </div>

        {/* Lifespan */}
        <Card className="p-8 bg-emerald-900/20 border border-emerald-700 rounded-xl">
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">
            Lifespan Impact Estimator
          </h2>
          <p className="text-3xl font-bold text-white">
            +{lifeGain} Years
          </p>
        </Card>

        {/* AI Advisor */}
        <Card className="p-8 bg-indigo-900/20 border border-indigo-700 rounded-xl">
          <h2 className="text-xl font-semibold text-indigo-400 mb-4">
            AI Environmental Advisor
          </h2>
          <p className="text-white">{aiInsight}</p>
        </Card>

      </div>
    </div>
  )
}
