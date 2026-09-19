import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useRemboursementsModal } from '../../hooks/actions/remboursements/useRemboursementsModal'
import { EcheanceFormModal } from './EcheanceFormModal'
import { StatusBadge, rembStatutBadge } from '@/pages/EspacePartenaireFinancier/components/StatusBadge'
import { money } from '@/helpers/money'
import { formatDate } from '@/helpers/date'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Loader2, Edit2, CheckCircle2, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function RemboursementsModal() {
  const {
    projet,
    planRemboursement,
    echeances,
    stats,
    isLoading,
    handleClose,
    toggleStatut,
    echeanceForm
  } = useRemboursementsModal()

  const open = !!projet

  return (
    <>
      <Sheet open={open} onOpenChange={(val) => !val && handleClose()}>
        <SheetContent className="sm:max-w-[600px] w-[90vw] overflow-y-auto p-0">
          <div className="p-6">
            <SheetHeader className="mb-6">
              <SheetTitle>
                <div className="flex flex-col gap-1">
                  <div className="text-[11px] text-[#5A6B80] uppercase tracking-wider font-semibold">
                    <span className="font-mono">{projet?.code}</span> · remboursements
                  </div>
                  <div className="text-[17px] text-[#131C29]">{projet?.intitule}</div>
                  <div className="text-[12px] text-[#5A6B80]">
                    {projet?.promoteur?.prenom} {projet?.promoteur?.nom} · {projet?.agence?.nom || '—'}
                  </div>
                </div>
              </SheetTitle>
            </SheetHeader>

            {isLoading ? (
               <div className="flex flex-col items-center justify-center py-16 text-[#5A6B80]">
                 <Loader2 size={32} className="animate-spin text-[#E7722B] mb-2" />
                 <span className="text-[13px]">Chargement des données...</span>
               </div>
            ) : (
              <div className="space-y-6">
                {stats && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-[1px] bg-[#EEF2F7] border border-[#EEF2F7] rounded-lg overflow-hidden">
                    <div className="bg-white p-[10px_12px]">
                      <div className="text-[11px] text-[#8595A8] font-semibold mb-[2px]">Montant du crédit</div>
                      <div className="text-[13px] font-medium text-[#131C29]">{money(stats.montantCredit)}</div>
                    </div>
                    <div className="bg-white p-[10px_12px]">
                      <div className="text-[11px] text-[#8595A8] font-semibold mb-[2px]">Taux / Durée</div>
                      <div className="text-[13px] font-medium text-[#131C29]">{stats.tauxInteret}% · {stats.duree} mois</div>
                    </div>
                    <div className="bg-white p-[10px_12px]">
                      <div className="text-[11px] text-[#8595A8] font-semibold mb-[2px]">Total dû</div>
                      <div className="text-[13px] font-medium text-[#131C29]">{money(stats.totalDu)}</div>
                    </div>
                    <div className="bg-white p-[10px_12px]">
                      <div className="text-[11px] text-[#8595A8] font-semibold mb-[2px]">Total payé</div>
                      <div className="text-[13px] font-medium text-[#10B981]">{money(stats.totalPaye)}</div>
                    </div>
                    <div className="bg-white p-[10px_12px]">
                      <div className="text-[11px] text-[#8595A8] font-semibold mb-[2px]">Reste dû</div>
                      <div className="text-[13px] font-medium text-[#E7722B]">{money(stats.resteDu)}</div>
                    </div>
                    <div className="bg-white p-[10px_12px]">
                      <div className="text-[11px] text-[#8595A8] font-semibold mb-[2px]">Décision</div>
                      <div className="text-[13px] font-medium text-[#131C29]">
                        <Badge variant="outline" className="font-normal rounded-sm px-1.5 py-0">
                          {planRemboursement?.decision || '—'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-[10px_12px] text-[12px]">
                  <div className="flex items-center justify-between mb-1">
                    <b className="flex items-center gap-1.5 text-[#131C29]">
                      <FileText className="w-4 h-4" /> 
                      Tableau d'amortissement ({echeances.length} mensualités)
                    </b>
                  </div>
                  <div className="text-[#5A6B80]">
                    Formule : <b>{stats ? money(stats.montantCredit) : '0 FCFA'}</b> sur <b>{stats?.duree || 0} mois</b> à <b>{stats?.tauxInteret || 0}%</b> → <b>{stats ? money(stats.mensualiteCalculee) : '0'} FCFA/mois</b>.
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-[13px] text-[#131C29] uppercase tracking-wider mb-3">
                    Échéances ({echeances.length})
                  </div>
                  
                  <div className="space-y-2">
                    {echeances?.map((r) => {
                      const isPaye = r.statut === 'PAYE'
                      const isPartiel = r.statut === 'PARTIEL'
                      const badge = rembStatutBadge(r.statut)
                      
                      return (
                        <div 
                          key={r.id} 
                          className={`relative flex flex-col gap-2 p-[12px_14px] border border-[#EEF2F7] rounded-lg bg-white transition-colors
                            ${isPaye ? 'border-l-4 border-l-[#10B981]' : (isPartiel ? 'border-l-4 border-l-[#F59E0B]' : '')}
                          `}
                        >
                          <div className="absolute top-3 right-3">
                            <StatusBadge label={badge.label} variant={badge.variant} />
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className={`w-[26px] h-[26px] rounded-md text-white flex items-center justify-center text-[12px] font-bold font-mono shrink-0 mt-0.5
                              ${isPaye ? 'bg-[#10B981]' : (isPartiel ? 'bg-[#F59E0B]' : 'bg-[#131C29]')}
                            `}>
                              {r.periode}
                            </div>
                            
                            <div className="flex-1 min-w-0 pr-20">
                              <b className="block text-[13.5px] text-[#131C29]">
                                Échéance {formatDate(r.date_echeance)}
                              </b>
                              <span className="text-[11.5px] text-[#5A6B80]">
                                Mensualité {money(Number(r.montant_echeance))} · Restant {money(Number(r.capital_restant))}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-end gap-3 pt-1">
                            <label className="flex items-center gap-1.5 text-[11.5px] text-[#5A6B80] whitespace-nowrap cursor-pointer">
                              <Checkbox 
                                checked={isPaye} 
                                onCheckedChange={(checked) => toggleStatut(r, !!checked)}
                                className="w-4 h-4 rounded-sm border-[#CBD5E1]"
                              />
                              Remboursé
                            </label>
                            
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="w-7 h-7 text-[#5A6B80]" 
                              onClick={() => echeanceForm.handleOpen(r)}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      )
                    }) || (
                      <p className="text-[13px] text-[#5A6B80] m-0">Aucune échéance saisie.</p>
                    )}
                  </div>
                  
                  {stats && stats.resteDu > 0 && (
                    <div className="mt-4 flex gap-2">
                      <Button onClick={() => echeanceForm.handleOpen()} size="sm" className="bg-[#131c29] text-white">
                        <Plus className="w-4 h-4 mr-1.5" />
                        Ajouter manuellement
                      </Button>
                    </div>
                  )}
                  
                  {stats && stats.resteDu <= 0 && echeances.length > 0 && (
                    <p className="mt-3 text-[12px] text-[#5A6B80] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> 
                      Montant du crédit intégralement programmé selon le tableau d'amortissement.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <EcheanceFormModal formHook={echeanceForm} />
    </>
  )
}
