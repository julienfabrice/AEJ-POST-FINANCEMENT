import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { UnitesPage } from '@/pages/Unites/UnitesPage'
import { PartenairesPage } from '@/pages/Partenaires/PartenairesPage'
import { LocalitesPage } from '@/pages/Localites/LocalitesPage'

export const Route = createFileRoute('/dev-preview')({
  component: DevPreviewPage,
})

const PAGES = {
  unites: { label: 'Unités de gestion', Component: UnitesPage },
  partenaires: { label: 'Partenaires financiers', Component: PartenairesPage },
  localites: { label: 'Localités', Component: LocalitesPage },
} as const

function DevPreviewPage() {
  const [active, setActive] = useState<keyof typeof PAGES>('unites')
  const { Component } = PAGES[active]

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Bandeau d'avertissement : cette route contourne l'authentification,
          uniquement pour la prévisualisation locale — à retirer avant tout
          merge vers main. */}
      <div className="bg-red-600 text-white text-xs font-semibold text-center py-1.5">
        ⚠️ MODE PRÉVISUALISATION DEV — sans authentification, ne pas mergre vers main
      </div>
      <div className="flex items-center gap-2 px-6 py-3 bg-white border-b border-slate-200">
        {Object.entries(PAGES).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setActive(key as keyof typeof PAGES)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              active === key ? 'bg-[#E7722B] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="p-6">
        <Component />
      </div>
    </div>
  )
}
