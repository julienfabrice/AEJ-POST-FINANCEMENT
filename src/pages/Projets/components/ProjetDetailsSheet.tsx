import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import dayjs from 'dayjs'
import { MapPin, Building, User, Calendar, CreditCard, Tag } from 'lucide-react'

interface ProjetDetailsSheetProps {
  projet: MICRO_PROJET_T | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjetDetailsSheet({ projet, open, onOpenChange }: ProjetDetailsSheetProps) {
  if (!projet) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="font-mono">{projet.code}</Badge>
            <Badge variant="outline" className="bg-slate-50">{projet.statut}</Badge>
          </div>
          <SheetTitle className="text-xl font-bold leading-tight">{projet.intitule}</SheetTitle>
          <SheetDescription>
            Ajouté le {dayjs(projet.created_at).format('DD/MM/YYYY')}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Promoteur */}
          <section>
            <h4 className="flex items-center text-sm font-semibold text-slate-900 mb-3">
              <User className="w-4 h-4 mr-2 text-slate-500" />
              Promoteur
            </h4>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              {projet.promoteur ? (
                <>
                  <div className="font-medium text-slate-900">
                    {projet.promoteur.prenom} {projet.promoteur.nom}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    {projet.promoteur.telephone || 'Aucun numéro'}
                  </div>
                  <div className="text-sm text-slate-500">
                    {projet.promoteur.email || 'Aucun email'}
                  </div>
                </>
              ) : (
                <div className="text-sm text-slate-500">Informations non disponibles</div>
              )}
            </div>
          </section>

          <Separator />

          {/* Détails du projet */}
          <section>
            <h4 className="flex items-center text-sm font-semibold text-slate-900 mb-3">
              <Tag className="w-4 h-4 mr-2 text-slate-500" />
              Détails du projet
            </h4>
            <dl className="grid grid-cols-1 gap-y-4 text-sm">
              <div>
                <dt className="text-slate-500 mb-1">Montant total</dt>
                <dd className="font-medium text-lg">
                  {projet.montant_total ? new Intl.NumberFormat('fr-FR').format(parseFloat(projet.montant_total)) : '0'} FCFA
                </dd>
              </div>
              <div>
                <dt className="text-slate-500 mb-1">Stade du projet</dt>
                <dd className="font-medium">{projet.stade_projet || '-'}</dd>
              </div>
              <div>
                <dt className="text-slate-500 mb-1">Type de projet</dt>
                <dd className="font-medium">{projet.type_projet || '-'}</dd>
              </div>
              <div>
                <dt className="text-slate-500 mb-1">Description</dt>
                <dd className="text-slate-700 leading-relaxed">
                  {projet.description || 'Aucune description fournie.'}
                </dd>
              </div>
            </dl>
          </section>

          <Separator />

          {/* Localisation & Agence */}
          <section>
            <h4 className="flex items-center text-sm font-semibold text-slate-900 mb-3">
              <MapPin className="w-4 h-4 mr-2 text-slate-500" />
              Localisation & Suivi
            </h4>
            <dl className="grid grid-cols-1 gap-y-4 text-sm">
              <div>
                <dt className="text-slate-500 mb-1">Localisation</dt>
                <dd className="font-medium">{projet.localisation || '-'}</dd>
              </div>
              <div>
                <dt className="flex items-center text-slate-500 mb-1">
                  <Building className="w-3.5 h-3.5 mr-1" /> Agence
                </dt>
                <dd className="font-medium">{projet.agence?.libelle || '-'}</dd>
              </div>
              <div>
                <dt className="flex items-center text-slate-500 mb-1">
                  <CreditCard className="w-3.5 h-3.5 mr-1" /> Dispositif
                </dt>
                <dd className="font-medium">{projet.dispositif?.libelle || '-'}</dd>
              </div>
              {projet.date_transmission_partenaire && (
                <div>
                  <dt className="flex items-center text-slate-500 mb-1">
                    <Calendar className="w-3.5 h-3.5 mr-1" /> Transmis au partenaire
                  </dt>
                  <dd className="font-medium">{dayjs(projet.date_transmission_partenaire).format('DD/MM/YYYY')}</dd>
                </div>
              )}
            </dl>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}
