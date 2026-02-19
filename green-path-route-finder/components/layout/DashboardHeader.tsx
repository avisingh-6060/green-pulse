'use client'

interface DashboardHeaderProps {
  title: string
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <div className="border-b border-slate-800 bg-slate-900/50 sticky top-0 z-40">
      <div className="flex items-center justify-between p-6">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
      </div>
    </div>
  )
}
