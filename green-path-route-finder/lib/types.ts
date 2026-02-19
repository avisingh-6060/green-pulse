// ===============================
// Pollution & Route Modes
// ===============================
export type PollutionLevel = 'Low' | 'Moderate' | 'High' | 'Critical'
export type RouteMode = 'fastest' | 'balanced' | 'health'

// ===============================
// Route Interface (Updated)
// ===============================
export interface Route {
  id?: number

  // Backend uses route_name
  route_name?: string

  // Fallback name support (UI compatibility)
  name?: string

  time: string
  distance: string

  // Backend sends health_score
  health_score?: number

  // Frontend uses camelCase
  healthScore?: number

  pollution: PollutionLevel

  // Newly added AQI value
  aqi?: number

  temperature?: number

  description?: string
}

// ===============================
// AQI Detailed Data
// ===============================
export interface AQIData {
  overall: number
  pm25: number
  pm10: number
  o3: number
  no2: number
  location: string
  lastUpdated: string
}

// ===============================
// Dashboard Stats Card
// ===============================
export interface StatsCard {
  label: string
  value: string
  icon: string
  trend?: number
}

// ===============================
// User
// ===============================
export interface User {
  id: string
  name: string
  email: string
  theme?: 'light' | 'dark'
}

// ===============================
// Route Request
// ===============================
export interface RouteRequest {
  source: string
  destination: string
  mode?: RouteMode
}
