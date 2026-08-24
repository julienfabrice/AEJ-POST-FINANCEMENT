import { User } from 'lucide-react'
import { Section } from './Section'
import { Field } from './Field'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

export function PromoteurInfos({ projet }: { projet: MICRO_PROJET_T }) {
  return (
    <Section title="Promoteur" icon={User}>
      {projet.promoteur ? (
        <dl className="grid grid-cols-2 gap-4">
          <Field label="Nom et Prénoms" value={`${projet.promoteur.prenom} ${projet.promoteur.nom}`} />
          <Field label="Matricule" value={projet.promoteur.matriculeaej} />
          <Field label="Téléphone" value={projet.promoteur.telephone} />
          <Field label="Email" value={projet.promoteur.email} />
        </dl>
      ) : (
        <div className="text-sm text-muted-foreground">Aucun promoteur associé.</div>
      )}
    </Section>
  )
}
