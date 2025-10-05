import type React from "react"

export function FactCardComponent({
  icon,
  title,
  description,
}: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-2xl transform transition-all duration-300 group-hover:scale-105 group-hover:from-orange-500/30 group-hover:to-red-500/30" />

      <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-950/90 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-8 transition-all duration-300 group-hover:border-orange-400/40 group-hover:shadow-[0_0_30px_rgba(251,146,60,0.3)]">
        <div className="mb-4 text-5xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
          <div className="inline-block p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl border border-orange-500/30 shadow-[0_0_20px_rgba(251,146,60,0.4)]">
            {icon}
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-orange-300 via-orange-200 to-yellow-300 bg-clip-text text-transparent">
          {title}
        </h3>

        <p className="text-gray-300 leading-relaxed text-sm">{description}</p>

        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-full" />
      </div>
    </div>
  )
}
