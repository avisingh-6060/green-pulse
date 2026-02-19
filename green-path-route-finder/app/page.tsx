'use client'

import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function Home() {
  return (
    <>
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-24 overflow-hidden">

        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />

        {/* Soft Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-950/45 to-slate-950/80" />

        {/* Subtle Emerald Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500 rounded-full blur-3xl opacity-10" />

        {/* ================= MAIN CONTENT ================= */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Badge */}
          <div className="mb-8 inline-block">
            <div className="px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/40 backdrop-blur-sm">
              <p className="text-sm text-emerald-400 font-semibold">
                🌍 Health-First Navigation
              </p>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent drop-shadow-lg">
            Choose the route your Lungs prefer
          </h1>

          {/* Description */}
          <p className="text-xl text-slate-200 mb-14 max-w-2xl mx-auto drop-shadow">
            GreenPulse helps you travel smarter by choosing routes that protect your lungs,
            reduce pollution exposure, and improve your daily commute using real-time AI insights.
          </p>

          {/* ================= INNOVATION HIGHLIGHT ================= */}
          <div className="mt-10 flex justify-center">
            <div className="max-w-4xl w-full bg-slate-900/20 backdrop-blur-[1.5px] border border-emerald-500/20 rounded-2xl p-8 shadow-2xl">

              <h3 className="text-2xl font-semibold text-emerald-400 mb-8 text-center">
                🚀 What Makes GreenPulse Innovative?
              </h3>

              <div className="grid md:grid-cols-2 gap-8 text-left text-slate-300">

                <div>
                  <p className="font-semibold text-white mb-2">
                    🧠 AI-Powered Route Intelligence
                  </p>
                  <p className="text-sm text-slate-400">
                    Combines AQI, traffic congestion, and route exposure to calculate the healthiest path.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-white mb-2">
                    🌫 Pollution Exposure Modeling
                  </p>
                  <p className="text-sm text-slate-400">
                    Predicts cumulative pollution exposure instead of just shortest distance.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-white mb-2">
                    📊 Predictive Peak Analysis
                  </p>
                  <p className="text-sm text-slate-400">
                    Forecasts high-risk pollution hours using real-time environmental data.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-white mb-2">
                    🌱 Health-First Navigation
                  </p>
                  <p className="text-sm text-slate-400">
                    Designed to prioritize your lungs, not just travel time.
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ================= PROJECT FEATURES ================= */}
      <section className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <h2 className="text-4xl font-bold text-white mb-4">
            Powerful Features of GreenPulse
          </h2>

          <p className="text-xl text-slate-400 mb-16">
            Built with AI-driven environmental intelligence to protect your health.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {[
              {
                title: '🌫 Real-Time AQI Monitoring',
                desc: 'Live air quality tracking to help you avoid polluted areas instantly.',
              },
              {
                title: '🧠 AI Health Score Engine',
                desc: 'Smart scoring system combining AQI, traffic congestion, and route exposure.',
              },
              {
                title: '🚦 Traffic + Pollution Mapping',
                desc: 'Integrated route analysis based on real-time traffic and environmental risk.',
              },
              {
                title: '📊 Predictive Peak Analysis',
                desc: 'Forecast peak pollution hours and make smarter travel decisions.',
              },
              {
                title: '🗺 Smart Route Optimization',
                desc: 'AI-powered route comparison to suggest the healthiest path.',
              },
              {
                title: '🌱 Sustainability Insights',
                desc: 'Track your environmental impact and contribute to greener commuting.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-emerald-500/40 hover:shadow-emerald-500/10 hover:shadow-xl transition duration-300"
              >
                <h3 className="text-xl font-semibold text-emerald-400 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400">
                  {feature.desc}
                </p>
              </div>
            ))}

          </div>

        </div>
      </section>

      <Footer />
    </>
  )
}
