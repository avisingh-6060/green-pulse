import { Route, AQIData, StatsCard } from './types'

export const mockRoutes: Route[] = [
  {
    id: 1,
    name: 'Green Route - Park Path',
    time: '20 mins',
    distance: '8.2 km',
    healthScore: 92,
    pollution: 'Low',
    description: 'Scenic route through parks and residential areas',
  },
  {
    id: 2,
    name: 'Balanced Route - Main Street',
    time: '18 mins',
    distance: '7.5 km',
    healthScore: 68,
    pollution: 'Moderate',
    description: 'Mixed urban and residential with some traffic',
  },
  {
    id: 3,
    name: 'Fast Route - Highway Express',
    time: '15 mins',
    distance: '9.8 km',
    healthScore: 45,
    pollution: 'High',
    description: 'Fastest but through high traffic areas',
  },
  {
    id: 4,
    name: 'Premium Green - Woodland Trail',
    time: '25 mins',
    distance: '6.8 km',
    healthScore: 95,
    pollution: 'Low',
    description: 'Longest route but best air quality',
  },
]

export const mockAQIData: AQIData = {
  overall: 62,
  pm25: 28,
  pm10: 45,
  o3: 35,
  no2: 42,
  location: 'San Francisco, CA',
  lastUpdated: new Date().toISOString(),
}

export const mockStats: StatsCard[] = [
  {
    label: 'Avg Health Score',
    value: '78',
    icon: '❤️',
    trend: 12,
  },
  {
    label: 'Routes Optimized',
    value: '240',
    icon: '🛣️',
    trend: 8,
  },
  {
    label: 'Emissions Saved',
    value: '2.4T',
    icon: '🌍',
    trend: 15,
  },
  {
    label: 'Community Impact',
    value: '15.2K',
    icon: '👥',
    trend: 22,
  },
]

export const recentRoutes = [
  {
    id: 1,
    from: 'Downtown',
    to: 'Airport',
    date: 'Today, 2:30 PM',
    healthScore: 82,
    pollution: 'Low',
  },
  {
    id: 2,
    from: 'Home',
    to: 'Office',
    date: 'Today, 8:15 AM',
    healthScore: 75,
    pollution: 'Moderate',
  },
  {
    id: 3,
    from: 'Downtown',
    to: 'Harbor',
    date: 'Yesterday, 6:45 PM',
    healthScore: 89,
    pollution: 'Low',
  },
  {
    id: 4,
    from: 'Mall',
    to: 'Home',
    date: 'Yesterday, 4:20 PM',
    healthScore: 68,
    pollution: 'Moderate',
  },
]

export const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      'Up to 5 routes per day',
      'Basic health scoring',
      'Real-time AQI data',
      'Mobile app access',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: 'per month',
    features: [
      'Unlimited routes',
      'Advanced health analytics',
      'Custom notifications',
      'API access',
      'Priority support',
      'Weekly health reports',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
]
