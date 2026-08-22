import { Briefcase } from 'lucide-react'
import { Section } from './Section'
import { Field } from './Field'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

export function RattachementsInfos({ projet }: { projet: MICRO_PROJET_T }) {
  return (
    <Section title="Rattachements" icon={Briefcase}>
      <dl className="grid grid-cols-2 gap-4">
        <Field label="Agence" value={projet.agence?.libelle || projet.agence?.nom} />
        <Field label="Secteur d'activité" value={projet.secteur?.libelle || projet.secteur?.nom} />
        <Field label="Dispositif" value={projet.dispositif?.libelle || projet.dispositif?.nom} />
        <Field label="Guichet" value={projet.guichet?.libelle || projet.guichet?.nom} />
        <Field label="Organisme" value={projet.organisme?.libelle || projet.organisme?.nom} />
        <Field label="Commune" value={projet.commune?.nom || projet.commune?.libelle} />
      </dl>
    </Section>
  )
}
