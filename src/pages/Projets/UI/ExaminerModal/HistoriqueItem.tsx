import dayjs from 'dayjs'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function HistoriqueItem({ item, allRoles }: { item: any, allRoles: any[] }) {
  // item is WORKFLOW_INSTANCE_HISTORY_T from the API
  const action = item.action?.toUpperCase() || ''
  const isValide   = action === 'APPROVE' || action === 'VALIDER' || action === 'VALIDE' || action === 'ACCEPTE'
  const isAjourne  = action === 'REJECT' || action === 'REJETER' || action === 'AJOURNE' || action === 'RETOUR'
  const isSoumis   = action === 'SUBMIT' || action === 'SOUMIS' || action === 'START' || action === 'INITIATE'

  // Look up role name
  const foundRole = allRoles?.find(r => r.role_code === item.role_code || r.code === item.role_code)
  const roleName = foundRole?.name || foundRole?.libelle || item.role_code || item.etape_code || 'Action système'

  // Resolve user name from potential API relations
  const userObj = item.user || item.actor || item.acted_by_user || (typeof item.acted_by === 'object' ? item.acted_by : null)
  const acteurName = userObj 
    ? `${userObj.prenom || ''} ${userObj.nom || userObj.name || ''}`.trim() || 'Utilisateur inconnu'
    : (item.acted_by ? `Utilisateur #${item.acted_by}` : 'Système')

  return (
    <div className="flex gap-3 text-sm">
      <div className="flex flex-col items-center gap-1">
        <div className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center flex-none mt-0.5',
          isValide  && 'bg-green-100 text-green-600',
          isAjourne && 'bg-red-100 text-red-600',
          isSoumis  && 'bg-blue-100 text-blue-600',
          (!isValide && !isAjourne && !isSoumis) && 'bg-slate-100 text-slate-600'
        )}>
          {isValide  && <CheckCircle2 className="w-4 h-4" />}
          {isAjourne && <XCircle className="w-4 h-4" />}
          {isSoumis  && <Clock className="w-4 h-4" />}
          {(!isValide && !isAjourne && !isSoumis) && <CheckCircle2 className="w-4 h-4" />}
        </div>
        <div className="w-px flex-1 bg-slate-100" />
      </div>
      <div className="pb-4 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-800">{roleName}</span>
          <span className="text-slate-400">—</span>
          <span className="text-slate-600">{acteurName}</span>
          <span className="text-slate-400 text-xs ml-auto">
            {item.acted_at || item.created_at ? dayjs(item.acted_at || item.created_at).format('DD/MM/YYYY HH:mm') : ''}
          </span>
        </div>
        <div className="mt-1 flex items-start gap-2">
          {item.action && (
            <Badge variant="secondary" className={cn(
              'pointer-events-none uppercase text-[10px] tracking-wider',
              isValide  && 'bg-green-50 text-green-700',
              isAjourne && 'bg-red-50 text-red-700',
              isSoumis  && 'bg-blue-50 text-blue-700',
            )}>
              {item.action}
            </Badge>
          )}
          <span className="text-slate-500 text-[13px] mt-0.5 leading-snug">
            {item.comment || "Aucun commentaire laissé."}
          </span>
        </div>
      </div>
    </div>
  )
}
