import dayjs from 'dayjs'
import { FileText } from 'lucide-react'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import { SectionTitle, FieldGrid, Field } from './Shared'

interface ExaminerMetadataProps {
  projet: MICRO_PROJET_T | null
  sigle_monnaie_pays: string
}

export function ExaminerMetadata({ projet, sigle_monnaie_pays }: ExaminerMetadataProps) {
  return (
    <>
      <SectionTitle>Informations du plan</SectionTitle>
      <FieldGrid>
        <Field label="Créé le">
          {projet?.plan_decaissement?.created_at || projet?.created_at 
            ? dayjs(projet?.plan_decaissement?.created_at || projet?.created_at).format('DD/MM/YYYY') 
            : 'N/A'
          }
        </Field>
        <Field label="Organisme / Partenaire">
          {projet?.organisme?.libelle || projet?.organisme?.nom || 'N/A'}
        </Field>
        <Field label="Dispositif / Guichet">
          {projet?.dispositif?.libelle || projet?.dispositif?.nom || 'N/A'} 
          {projet?.guichet ? ` — ${projet.guichet.libelle || projet.guichet.nom}` : ''}
        </Field>
        <Field label="Secteur d'activité">
          {projet?.secteur?.libelle || projet?.secteur?.nom || 'N/A'}
        </Field>
        <Field label="Plan signé (PDF)">
          {projet?.plan_decaissement?.justificatif_path ? (
            <span className="inline-flex items-center gap-1.5 text-blue-600 font-semibold hover:underline cursor-pointer">
              <FileText className="w-3.5 h-3.5" />
              Télécharger le justificatif
            </span>
          ) : (
            <span className="text-slate-400">Aucun justificatif</span>
          )}
        </Field>
        <Field label="Montant du plan de décaissement">
          <span className="font-mono font-bold text-slate-800 text-[13px]">
            {projet?.plan_decaissement?.montant_planifie 
              ? `${Number(projet.plan_decaissement.montant_planifie).toLocaleString('fr-FR')} ${sigle_monnaie_pays}` 
              : 'N/A'
            }
          </span>
        </Field>
        <Field label="Coût total du projet">
          <span className="font-mono font-semibold text-slate-600 text-[13px]">
            {projet?.montant_total 
              ? `${Number(projet.montant_total).toLocaleString('fr-FR')} ${sigle_monnaie_pays}` 
              : 'N/A'
            }
          </span>
        </Field>
      </FieldGrid>
    </>
  )
}
