import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'http://localhost:5000/api/routes'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const source =
      searchParams.get('source') ||
      searchParams.get('from')

    const destination =
      searchParams.get('destination') ||
      searchParams.get('to')

    const mode = searchParams.get('mode') || 'balanced'

    if (!source || !destination) {
      return NextResponse.json(
        {
          success: false,
          message: 'Source and destination are required',
        },
        { status: 400 }
      )
    }

    // 🔥 Forward request to backend (REAL ROUTES)
    const response = await fetch(
      `${BACKEND_URL}?source=${encodeURIComponent(
        source
      )}&destination=${encodeURIComponent(destination)}`,
      {
        method: 'GET',
      }
    )

    const data = await response.json()

    return NextResponse.json(data)

  } catch (error) {
    console.error('Route Proxy Error:', error)

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch routes',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { source, destination } = body

    if (!source || !destination) {
      return NextResponse.json(
        {
          success: false,
          message: 'Source and destination are required',
        },
        { status: 400 }
      )
    }

    // 🔥 Forward POST as GET to backend
    const response = await fetch(
      `${BACKEND_URL}?source=${encodeURIComponent(
        source
      )}&destination=${encodeURIComponent(destination)}`,
      {
        method: 'GET',
      }
    )

    const data = await response.json()

    return NextResponse.json(data)

  } catch (error) {
    console.error('Route Proxy Error:', error)

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to process request',
      },
      { status: 500 }
    )
  }
}
