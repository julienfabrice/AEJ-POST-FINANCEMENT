import { useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useProjetsStore } from '@/store/useProjetsStore'
import { money } from '@/helpers/money'
import { Folder, Flag } from 'lucide-react'
import { projetsServices } from '@/services/projets.services'
import { exploitationServices } from '@/services/exploitations.services'
import { remboursementServices } from '@/services/remboursements.services'

const R = ({ label, value }: { label: React.ReactNode, value: React.ReactNode }) => (
  <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
    <span className="text-slate-500 text-[13px]">{label}</span>
    <div className="text-[13px] font-medium text-slate-800">{value}</div>
  </div>
)
export function AntecedentsModal() {
  const { antecedentsModalProjet: projet, setAntecedentsModalProjet } = useProjetsStore()

  const { data: projetsRes } = projetsServices.useGetAll(1, 100, {
    promoteur_id: projet?.promoteur?.id?.toString()
  })
  const { data: exploitations } = exploitationServices.useGetAll()
  const { data: remboursements } = remboursementServices.useGetAll()

  const fetchedProjets = useMemo(() => projetsRes?.data || [], [projetsRes])

  const { 
    enCoursCount, enCoursMontant, 
    totalRembourser, dejaRembourse, 
    impayesCount, impayesRetard,
    contentieuxCount
  } = useMemo(() => {
    let enCoursC = 0
    let enCoursM = 0
    let totalRemb = 0
    let dejaRemb = 0
    let impayesC = 0
    let maxRetard = 0
    let contentieuxC = 0

    fetchedProjets.forEach(p => {
      // Projets en cours
      if (p.stade_projet === 'EN_COURS' || p.statut === 'EN_COURS' || p.statut === 'APPROUVE') {
        enCoursC++
        enCoursM += Number(p.montant_total) || 0
      }

      // Contentieux
      if (p.statut === 'CONTENTIEUX') {
        contentieuxC++
      }

      // Endettement
      if (p.plan_remboursement) {
        totalRemb += Number(p.plan_remboursement.montant_credit) || 0
      }
      
      if (p.recouvrements && Array.isArray(p.recouvrements)) {
        dejaRemb += p.recouvrements.reduce((acc, r) => acc + (Number(r.montant_recouvre) || 0), 0)
      }
    })

    // Remboursements impayés (si api est dispo)
    if (remboursements && projet?.promoteur_id) {
      const promoteurId = projet.promoteur_id
      const mesRemb = remboursements.filter(r => 
        r.promoteur_id === promoteurId && 
        (r.statut === 'NON_PAYE' || r.statut === 'PARTIEL')
      )
      impayesC = mesRemb.length
      maxRetard = 0 // Pas de date_echeance disponible dans le modèle actuel
      
      // On additionne les montants payés
      dejaRemb += remboursements
        .filter(r => r.promoteur_id === promoteurId)
        .reduce((acc, r) => acc + (Number(r.montant_paye) || 0), 0)
    }

    return { 
      enCoursCount: enCoursC, 
      enCoursMontant: enCoursM, 
      totalRembourser: totalRemb, 
      dejaRembourse: dejaRemb,
      impayesCount: impayesC,
      impayesRetard: maxRetard,
      contentieuxCount: contentieuxC
    }
  }, [fetchedProjets, remboursements, projet])

  const mesVisites = useMemo(() => {
    if (!exploitations) return []
    const projetIds = new Set(fetchedProjets.map(p => p.id))
    return exploitations.filter(e => projetIds.has(e.micro_projet_id))
  }, [exploitations, fetchedProjets])

  if (!projet || !projet.promoteur) return null

  const promoteur = projet.promoteur
  const resteDu = totalRembourser - dejaRembourse
  const hasGarantieAppelee = false

  return (
    <Dialog open={!!projet} onOpenChange={(val) => !val && setAntecedentsModalProjet(null)}>
      <DialogContent className="max-w-[640px] p-0 gap-0 overflow-hidden bg-white">
        <DialogHeader className="px-6 py-4 border-b border-aej-line bg-slate-50/50">
          <DialogTitle className="text-[16px] font-semibold text-slate-800">
            Antécédents — {promoteur.prenom} {promoteur.nom}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar bg-slate-50/30">
          
          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6">
            <span className="text-[13px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{promoteur.matriculeaej || 'N/A'}</span>
            <span className="text-[13px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{promoteur.telephone || 'N/A'}</span>
            <span className="text-[13px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{projet.commune?.libelle || 'Commune Inconnue'}</span>
            <span className="text-[13px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{projet.secteur?.libelle || 'Secteur Inconnu'}</span>
          </div>

          {contentieuxCount > 0 && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-md p-3 text-[13px] flex items-center gap-2 mb-6">
              <Flag className="w-4 h-4 text-red-500" />
              {contentieuxCount} dossier(s) en contentieux — avocat de l'AEJ saisi.
            </div>
          )}

          <div className="mb-8">
            <h4 className="text-[14px] font-semibold text-slate-800 mb-3 uppercase tracking-wide">Situation d'endettement</h4>
            <div className="bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
              <div className="px-3">
                <R 
                  label="Prêt(s) en cours" 
                  value={
                    enCoursCount > 0 
                      ? <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 font-medium rounded-sm">{enCoursCount} prêt(s) actif(s) · {money(enCoursMontant)}</Badge> 
                      : <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 font-medium rounded-sm">Aucun prêt en cours</Badge>
                  } 
                />
                <R label="Total à rembourser" value={<span className="font-mono">{money(totalRembourser)}</span>} />
                <R label="Déjà remboursé" value={<span className="font-mono text-emerald-600">{money(dejaRembourse)}</span>} />
                <R label="Reste dû" value={<span className={`font-mono ${resteDu > 0 ? 'text-orange-600' : 'text-slate-500'}`}>{money(resteDu)}</span>} />
                <R 
                  label="Échéances impayées" 
                  value={
                    impayesCount > 0 
                      ? <Badge variant="outline" className={`font-medium rounded-sm ${impayesCount > 3 ? 'text-red-600 border-red-200 bg-red-50' : 'text-amber-600 border-amber-200 bg-amber-50'}`}>{impayesCount} impayé(s) · {impayesRetard} j de retard</Badge>
                      : <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 font-medium rounded-sm">À jour</Badge>
                  } 
                />
                {hasGarantieAppelee && (
                  <R label="Garantie appelée" value={<Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 font-medium rounded-sm">{money(200000)} le 12/05/2023</Badge>} />
                )}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-[14px] font-semibold text-slate-800 mb-3 uppercase tracking-wide">Participation aux projets ({fetchedProjets.length})</h4>
            <div className="space-y-2">
              {fetchedProjets.map(p => (
                <div key={p.id} className="bg-white border border-slate-200 rounded-lg p-3 flex items-center gap-3 hover:border-orange-300 transition-colors cursor-pointer shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <Folder className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-800 text-[13px] truncate">{p.code} — {p.intitule}</div>
                    <div className="text-slate-500 text-[12px] truncate mt-0.5">{p.dispositif?.libelle || 'N/A'} · {p.agence?.libelle || 'N/A'} · créé le {p.created_at ? new Date(p.created_at).toLocaleDateString('fr-FR') : 'N/A'}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono text-[13px] font-medium text-slate-700">{money(Number(p.montant_total) || 0)}</div>
                    <Badge variant="outline" className="mt-1 text-[10px] uppercase font-semibold text-slate-500 border-slate-200">{p.statut}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[14px] font-semibold text-slate-800 mb-3 uppercase tracking-wide">Visites de suivi ({mesVisites.length})</h4>
            <div className="space-y-3">
              {mesVisites.map((v) => (
                <div key={v.id} className="bg-white border-l-2 border-l-blue-400 rounded-r-lg p-3 shadow-sm border-y border-r border-slate-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-semibold text-[13px] text-slate-800">
                      {v.created_at ? new Date(v.created_at).toLocaleDateString('fr-FR') : 'N/A'} — {v.agent?.nom || 'Agent AEJ'}
                    </span>
                    <span className="text-[12px] text-slate-500 italic ml-auto">{v.etat_activite || 'N/A'}</span>
                  </div>
                  <p className="text-[13px] text-slate-600 m-0 leading-relaxed">{v.observations || 'Aucune observation'}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="px-6 py-4 border-t border-aej-line bg-white flex justify-end">
          <Button variant="outline" onClick={() => setAntecedentsModalProjet(null)}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
