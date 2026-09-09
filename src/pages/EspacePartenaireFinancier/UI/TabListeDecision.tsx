import { useState } from 'react'
import { FileText, Loader2, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataPagination } from '@/components/generics/data-pagination'
import { projetsServices } from '@/services/projets.services'
import { StatusBadge, approbationBadge } from '../components/StatusBadge'
import { money } from "@/helpers/money"
import { formatDate } from '@/helpers/date'
import { refLabel } from '@/types/referentials.types'

interface Props {
  type: 'APPROUVE' | 'REJETE'
}

export function TabListeDecision({ type }: Props) {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(20)
  const [search, setSearch] = useState('')
  const [stadeFilter, setStadeFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const statutFilter = type === 'APPROUVE' ? 'APPROUVE' : 'NON_APPROUVE'

  const { data: responseData, isLoading, isFetching, error } = projetsServices.useGetAll(page, perPage, {
    statut: statutFilter,
    search: search || undefined,
    stade_projet: stadeFilter !== 'all' ? stadeFilter : undefined,
    type_projet: typeFilter !== 'all' ? typeFilter : undefined,
  })

  const list = responseData?.data ?? []
  const total = responseData?.pagination?.total ?? list.length
  const badge = approbationBadge(statutFilter)

  return (
    <Card className="p-0 overflow-hidden border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)]">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-[18px] py-[15px] border-b border-[#EEF2F7]">
        <div className="flex items-center gap-3">
          <h3 className="text-[14.5px] font-bold text-[#131C29]">
            {type === 'APPROUVE' ? 'Dossiers approuvés' : 'Dossiers rejetés'}
          </h3>
          <StatusBadge label={String(total)} variant={badge.variant} />
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-48 sm:w-60">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-8 h-8 text-[12px] bg-slate-50 border-slate-200"
            />
          </div>

          <Select
            value={stadeFilter}
            onValueChange={(val) => {
              setStadeFilter(val)
              setPage(1)
            }}
          >
            <SelectTrigger className="h-8 text-[12px] w-[130px] bg-slate-50 border-slate-200">
              <SelectValue placeholder="Stade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les stades</SelectItem>
              <SelectItem value="CREATION">Création</SelectItem>
              <SelectItem value="DEVELOPPEMENT">Développement</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={typeFilter}
            onValueChange={(val) => {
              setTypeFilter(val)
              setPage(1)
            }}
          >
            <SelectTrigger className="h-8 text-[12px] w-[130px] bg-slate-50 border-slate-200">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="INDIVIDUEL">Individuel</SelectItem>
              <SelectItem value="COLLECTIF">Collectif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Corps */}
      <div className="px-[18px] py-[16px]">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-[#5A6B80]">
            <Loader2 size={30} className="animate-spin text-[#E7722B] mb-2" />
            <span className="text-[13px]">Chargement des dossiers...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-[#D6453B]">
            <FileText size={36} className="mx-auto mb-2 opacity-60" />
            <b className="block text-[14px] mb-1 font-['Archivo']">Erreur de chargement</b>
            <span className="text-[12px]">Impossible de récupérer les dossiers.</span>
          </div>
        )}

        {!isLoading && !error && list.length === 0 && (
          <div className="text-center py-14 text-[#5A6B80]">
            <FileText size={40} className="mx-auto mb-3 opacity-40" />
            <b className="block text-[#131C29] text-[15px] mb-1 font-['Archivo']">
              {type === 'APPROUVE' ? 'Aucun dossier approuvé' : 'Aucun dossier rejeté'}
            </b>
            <span className="text-[12px]">Aucun résultat trouvé pour les filtres sélectionnés.</span>
          </div>
        )}

        {!isLoading && !error && list.map((d) => {
          const promoteurName = d.promoteur ? `${d.promoteur.nom} ${d.promoteur.prenom}` : '—'
          const montant = d.montant_total ? Number(d.montant_total) : 0
          const guichetLabel = d.guichet ? refLabel(d.guichet) : null
          const agenceLabel = d.agence ? refLabel(d.agence) : null
          const dateLabel = d.date_transmission_partenaire || d.workflow_instance?.started_at || d.created_at

          return (
            <div
              key={d.id}
              className="flex items-start gap-3 border border-[#E5EAF1] rounded-[8px] px-[14px] py-3 bg-white mb-2 hover:bg-[#fafbfe] transition-colors"
            >
              {/* icône */}
              <div className="w-[26px] h-[26px] rounded-[8px] bg-[#131C29] text-white grid place-items-center flex-none mt-0.5">
                <FileText size={13} />
              </div>

              {/* info */}
              <div className="flex-1 min-w-0">
                <b className="block text-[13px] text-[#131C29]">
                  {d.code} — {d.intitule}
                </b>
                <span className="text-[11.5px] text-[#5A6B80]">
                  {promoteurName}
                  {guichetLabel && ` · ${guichetLabel}`}
                  {agenceLabel && ` · ${agenceLabel}`}
                  {d.stade_projet && ` · ${d.stade_projet}`}
                  {d.type_projet && ` (${d.type_projet})`}
                  {dateLabel && ` · du ${formatDate(dateLabel)}`}
                  {d.workflow_instance?.current_etape_code && ` · Étape: ${d.workflow_instance.current_etape_code}`}
                </span>
              </div>

              {/* montant */}
              {montant > 0 && (
                <span className="text-[13px] font-semibold text-[#131C29] whitespace-nowrap font-mono">
                  {money(montant)}
                </span>
              )}


              <StatusBadge label={d.stade_projet} variant={badge.variant} />
              {/* badge */}
              <StatusBadge label={d.type_projet} variant={badge.variant} />
            </div>
          )
        })}
      </div>

      {/* Pagination avec DataPagination du design system */}
      {total > 0 && (
        <DataPagination
          page={page}
          perPage={perPage}
          total={total}
          onPageChange={setPage}
          onPerPageChange={(newPerPage) => {
            setPerPage(newPerPage)
            setPage(1)
          }}
          itemLabel={{ singular: 'dossier', plural: 'dossiers' }}
          isFetching={isFetching}
        />
      )}
    </Card>
  )
}


