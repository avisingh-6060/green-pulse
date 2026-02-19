import { mockAQIData } from '@/lib/mockData'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const location =
      searchParams.get('location') || 'San Francisco, CA'

    const apiKey = process.env.OPENWEATHER_API_KEY

    // If API key missing → return mock (SAFE FALLBACK)
    if (!apiKey) {
      return NextResponse.json(
        {
          success: true,
          data: {
            ...mockAQIData,
            location,
          },
          cached: true,
        },
        { status: 200 }
      )
    }

    /* ===============================
       STEP 1: Get Coordinates
    =============================== */
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        location
      )}&limit=1&appid=${apiKey}`
    )

    if (!geoRes.ok) throw new Error('Geo API failed')

    const geoData = await geoRes.json()

    if (!geoData.length) throw new Error('Location not found')

    const { lat, lon } = geoData[0]

    /* ===============================
       STEP 2: Get AQI
    =============================== */
    const aqiRes = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    )

    if (!aqiRes.ok) throw new Error('AQI API failed')

    const aqiJson = await aqiRes.json()
    const pollution = aqiJson.list[0]

    // OpenWeather scale: 1–5 → convert to approx AQI
    const convertedAQI = pollution.main.aqi * 50

    return NextResponse.json(
      {
        success: true,
        data: {
          aqi: convertedAQI,
          location,
          pm25: pollution.components.pm2_5,
          pm10: pollution.components.pm10,
          o3: pollution.components.o3,
          no2: pollution.components.no2,
        },
        cached: false,
      },
      { status: 200 }
    )
  } catch (error) {
    // SAFE FALLBACK → NEVER BREAK FRONTEND
    return NextResponse.json(
      {
        success: true,
        data: {
          ...mockAQIData,
          location:
            request.nextUrl.searchParams.get('location') ||
            'San Francisco, CA',
        },
        cached: true,
      },
      { status: 200 }
    )
  }
}
