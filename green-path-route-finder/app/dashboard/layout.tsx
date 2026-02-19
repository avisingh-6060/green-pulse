'use client'

import { Navbar } from '@/components/layout/Navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <div className="pt-24 px-6 pb-10 max-w-7xl mx-auto">
        {children}
      </div>
    </>
  )
}
