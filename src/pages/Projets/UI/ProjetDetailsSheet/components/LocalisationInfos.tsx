import { MapPin } from 'lucide-react'
import { Section } from './Section'
import { Field } from './Field'
import { formatDate } from '@/helpers/age'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

export function LocalisationInfos({ projet }: { projet: MICRO_PROJET_T }) {
  return (
    <Section title="Localisation & Traçabilité" icon={MapPin}>
      <dl className="grid grid-cols-2 gap-4">
        <Field label="Localisation" value={projet.localisation} />
        <Field label="Date de certification" value={formatDate(projet.date_certification)} />
        <Field label="Transmis au partenaire" value={formatDate(projet.date_transmission_partenaire)} />
      </dl>
    </Section>
  )
}
