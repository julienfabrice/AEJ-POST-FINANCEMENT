import { Printer } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Section } from './ProjetDetailsSheet/components/Section'
import { Field } from './ProjetDetailsSheet/components/Field'
import { useFicheSynoptiqueModal } from '../hooks/useFicheSynoptiqueModal'

export function FicheSynoptiqueModal() {
  const {
    projet,
    handleClose,
    handlePrint,
    montantSollicite,
    montantDecaisse,
    totalDu,
    totalRembourse,
    currentStep
  } = useFicheSynoptiqueModal()

  if (!projet) return null

  return (
    <Dialog open={!!projet} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b border-slate-200 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-lg">
            Fiche synoptique — {projet.code || 'N/A'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar" id="printable-fiche-synoptique">
          <Section title="Identification">
            <Field label="Code dossier" value={<span className="font-mono">{projet.code || '—'}</span>} />
            <Field label="Guichet" value={`${projet.dispositif?.libelle || '—'} (${projet.dispositif?.code || '—'})`} />
            <Field label="Promoteur" value={`${projet.promoteur?.prenom || ''} ${projet.promoteur?.nom || ''}`} />
            <Field label="Matricule AEJ" value={<span className="font-mono">{projet.promoteur?.matriculeaej || '—'}</span>} />
            <Field label="CIN" value={projet.promoteur?.numerocni || '—'} />
            <Field label="Téléphone" value={<span className="font-mono">{projet.promoteur?.telephone || '—'}</span>} />
            <Field label="Localisation" value={projet.commune?.libelle || '—'} />
            <Field label="Adresse" value={projet.localisation || '—'} />
            <Field label="Agence régionale" value={projet.agence?.libelle || '—'} />
            <Field label="Secteur d'activité" value={projet.secteur?.libelle || '—'} />
          </Section>

          <Section title="Sélection & formation">
            <Field label="Statut de la sélection" value="—" />
            <Field label="Statut de la formation" value="—" />
            <Field label="Date de formation" value="—" />
            <Field label="Prestataire" value="—" />
          </Section>

          <Section title="Financement">
            <Field label="Montant sollicité" value={montantSollicite} />
            <Field label="Partenaire financier" value={projet.organisme?.libelle || '—'} />
            <Field label="Approbation" value={projet.budget?.statut || '—'} />
            <Field label="Montant décaissé" value={montantDecaisse} />
            <Field label="Total dû / remboursé" value={`${totalDu} / ${totalRembourse}`} />
            <Field label="Échéances impayées" value="0" />
            <Field label="Statut actuel" value={
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                {projet.statut || 'N/A'}
              </Badge>
            } />
            <Field empty />
          </Section>

          <Section title="Suivi terrain">
            <Field label="Dernière visite" value="Aucune visite enregistrée" />
            <Field empty />
          </Section>

          <Section title="Progression dans le workflow">
            <div className="bg-white p-3 col-span-1 sm:col-span-2">
              <p className="m-0 text-[13px] text-slate-500 font-medium">
                Étape actuelle — « {currentStep} »
              </p>
            </div>
          </Section>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-slate-200 shrink-0 mt-0">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Fermer
          </Button>
          <Button 
            type="button" 
            className="bg-[#E7722B] hover:bg-[#C85E18] text-white print:hidden"
            onClick={handlePrint}
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
