import { Tag } from 'lucide-react'
import { Section } from './Section'
import { Field } from './Field'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

export function ProjetInfos({ projet }: { projet: MICRO_PROJET_T }) {
  return (
    <Section title="Détails du projet" icon={Tag}>
      <dl className="grid grid-cols-2 gap-4">
        <Field 
          label="Montant total" 
          value={projet.montant_total ? `${new Intl.NumberFormat('fr-FR').format(parseFloat(projet.montant_total))} FCFA` : undefined} 
        />
        <Field label="Stade du projet" value={projet.stade_projet} />
        <Field label="Type de projet" value={projet.type_projet} />
      </dl>
      <div className="mt-3">
        <Field label="Description" value={projet.description} />
      </div>
    </Section>
  )
}
