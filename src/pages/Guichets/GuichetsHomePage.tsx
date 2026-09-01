import { useState, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { GuichetCard } from './UI/GuichetCard'
import { dispositifServices } from '@/services/dispositifs.services'
import { ROUTES } from '@/constants/routes'

export function GuichetsHomePage() {
  const { data: guichets, isLoading } = dispositifServices.useGetAll()
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filtered = useMemo(() => {
    if (!search.trim() || !guichets) return guichets || []
    const q = search.toLowerCase()
    return guichets.filter((g: any) => g.intitule.toLowerCase().includes(q) || g.code.toLowerCase().includes(q))
  }, [guichets, search])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#131C29]">Guichets opérationnels</h1>
          <p className="text-sm text-[#5A6B80] mt-1">Choisissez le guichet dont vous voulez suivre les dossiers.</p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Nom, téléphone ou N° de dossier"
            className="pl-9 h-10 bg-white border-slate-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">
          {filtered.map((g: any) => (
            <GuichetCard
              key={g.id}
              guichet={g}
              onClick={() => navigate({ to: ROUTES.DISPOSITIFS })}
            />
          ))}
        </div>
      )}

      <div className="bg-white border border-[#E5EAF1] rounded-[11px] p-5">
        <h3 className="text-[15px] font-bold text-[#131C29] mb-2">Vue d'ensemble</h3>
        <p className="text-[13px] text-[#5A6B80] leading-relaxed">
          Chaque guichet suit sa propre procédure : AGR (récupération, plans d'affaires,
          transmission, traitement du partenaire, décaissement, suivi), MPE/MEPS (avec
          imputation aux agences, plans de décaissement et chaîne de validation) et Projets
          structurants / Start-Up (avec conventions de prêt du service Risques, Garanties et
          Contentieux).
        </p>
      </div>
    </div>
  )
}