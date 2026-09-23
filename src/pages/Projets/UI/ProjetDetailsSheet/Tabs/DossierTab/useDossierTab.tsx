import React from 'react'
import { Badge } from '@/components/ui/badge'
import { FileText } from 'lucide-react'
import { formatDate } from '@/helpers/date'
import { money } from '@/helpers/money'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import { sexeServices } from '@/services/sexes.services'
import { situationMatrimonialeServices } from '@/services/situationsMatrimoniales.services'
import { pieceIdentiteServices } from '@/services/piecesIdentites.services'
import { lieuHabitationServices } from '@/services/lieuHabitations.services'
import { paysServices } from '@/services/pays.services'
import { niveauEtudeServices } from '@/services/niveauxEtudes.services'

export type FieldData = {
  label?: string
  value?: React.ReactNode
  empty?: boolean
}

export type SectionData = {
  title: string
  fields: FieldData[]
}

export function useDossierTab(projet: MICRO_PROJET_T) {
  const { data: sexes } = sexeServices.useGetAll()
  const { data: situations } = situationMatrimonialeServices.useGetAll()
  const { data: typePieces } = pieceIdentiteServices.useGetAll()
  const { data: lieuxHabitation } = lieuHabitationServices.useGetAll()
  const { data: pays } = paysServices.useGetAll()
  const { data: niveauxEtudes } = niveauEtudeServices.useGetAll()

  // ── Promoteur ──────────────────────────────────────────────────────────────
  const p = projet.promoteur

  const nomComplet = `${p?.prenom || ''} ${p?.nom || ''}`.trim() || '—'

  const rawSexe = sexes?.find(s => s.id === p?.sexe_id)?.libelle || '—'
  const sexeLibelle = rawSexe.charAt(0).toUpperCase() + rawSexe.slice(1).toLowerCase()

  const rawSituation = situations?.find(s => s.id === p?.situationmatrimoniale_id)?.libelle || '—'
  const situationLibelle = rawSituation.charAt(0).toUpperCase() + rawSituation.slice(1).toLowerCase()

  const typePieceLibelle = typePieces?.find(t => t.id === p?.typepieceidentite_id)?.libelle || '—'
  const numeroCni = p?.numerocni || '—'

  const lieuHabitation = lieuxHabitation?.find(l => l.id === p?.lieuhabitation_id)?.nom || '—'
  const paysNationalite = pays?.find(pay => pay.id === p?.paysnationalite_id)?.nom || '—'
  const rawNiveauEtude = niveauxEtudes?.find(n => n.id === p?.niveauetude_id)?.libelle || '—'
  const niveauEtude = rawNiveauEtude.charAt(0).toUpperCase() + rawNiveauEtude.slice(1).toLowerCase()

  const promoteurFields: FieldData[] = [
    { label: "Nom & prénoms",             value: nomComplet },
    { label: "Matricule AEJ",             value: <span className="font-mono text-aej-slate">{p?.matriculeaej || '—'}</span> },
    { label: "Genre / Date de naissance", value: `${sexeLibelle} · ${formatDate(p?.datenaissance)}` },
    { label: "Situation matrimoniale",    value: situationLibelle },
    { label: "Pièce d'identité",          value: <span className="font-mono text-aej-slate">{typePieceLibelle} — {numeroCni}</span> },
    { label: "Téléphone",                 value: <span className="font-mono text-aej-slate">{p?.telephone || '—'}</span> },
    { label: "Lieu d'habitation",         value: lieuHabitation },
    { label: "Lieu de naissance",         value: p?.lieunaissance || '—' },
    { label: "Pays de nationalité",       value: paysNationalite },
    { label: "Niveau d'étude",            value: niveauEtude },
    { empty: true },
  ]

  // ── Projet ─────────────────────────────────────────────────────────────────
  const projetFields: FieldData[] = [
    { label: "Code", value: <span className="font-mono text-aej-slate">{projet.code || '—'}</span> },
    { label: "Type", value: projet.type_projet || '—' },
    { label: "Secteur", value: projet.secteur?.libelle || '—' },
    { label: "Montant sollicité", value: <span className="font-semibold text-aej-ink">{projet.montant_total && money(Number(projet.montant_total))}</span> },
    { label: "Guichet", value: projet.guichet?.libelle || '—' },
    { label: "Partenaire financier", value: projet.organisme?.libelle || '—' },
    { label: "Agence", value: projet.agence?.nom || '—' },
    { label: "Date de création", value: <span className="font-mono text-aej-slate">{formatDate(projet.created_at)}</span> },
  ]

  // ── Transmission au partenaire ─────────────────────────────────────────────
  const lot = projet.lot_transmission

  const fichierCourrier = lot?.fichier_courrier
    ? <span className="inline-flex items-center gap-1.5 text-aej-blue font-medium hover:underline cursor-pointer"><FileText className="w-3.5 h-3.5" />{lot.fichier_courrier.split('/').pop()}</span>
    : '—'

  const fichierRepartition = lot?.fichier_repartition
    ? <span className="inline-flex items-center gap-1.5 text-aej-blue font-medium hover:underline cursor-pointer"><FileText className="w-3.5 h-3.5" />{lot.fichier_repartition.split('/').pop()}</span>
    : '—'

  const transmissionFields: FieldData[] = [
    { label: "Réf. du courrier", value: lot?.reference_courrier || '—' },
    { label: "Titre du courrier", value: lot?.titre || '—' },
    { label: "Date de transmission", value: formatDate(lot?.date_transmission) },
    { label: "Taux de couverture", value: lot?.taux_recouvrement != null ? `${lot.taux_recouvrement} %` : '—' },
    { label: "Durée du différé", value: lot?.duree_differee != null ? `${lot.duree_differee} mois` : '—' },
    { label: "Réf. de la convention", value: lot?.reference_convention || '—' },
    { label: "Fichier courrier", value: fichierCourrier },
    { label: "Fichier répartition", value: fichierRepartition },
  ]

  // ── Financement & remboursement ────────────────────────────────────────────
  const budget = projet.budget
  const planRemb = budget?.plan_remboursements ?? projet.plan_remboursement ?? null
  const compte = projet.compte_financement

  // Statut budget
  const budgetStatutColors: Record<string, string> = {
    APPROUVE:     'bg-aej-green-soft text-aej-green-deep',
    NON_APPROUVE: 'bg-red-50 text-red-600',
    EN_ATTENTE:   'bg-aej-line-2 text-aej-ink-3',
  }
  const budgetStatut = budget?.statut ?? null
  const budgetStatutBadge = budgetStatut
    ? <Badge className={`${budgetStatutColors[budgetStatut] ?? 'bg-aej-line-2 text-aej-ink-3'} hover:opacity-90 shadow-none border-0 px-2 py-0.5 text-[11px]`}>{budgetStatut}</Badge>
    : '—'

  // Déblocage
  const deblocage = budget?.deblocage === true
    ? <Badge className="bg-aej-green-soft text-aej-green-deep hover:bg-aej-green-soft shadow-none border-0 px-2 py-0.5 text-[11px]">Effectué</Badge>
    : budget?.deblocage === false
    ? <Badge className="bg-aej-line-2 text-aej-ink-3 hover:bg-aej-line shadow-none border-0 px-2 py-0.5 text-[11px]">Non effectué</Badge>
    : '—'

  const fichierConvention = planRemb?.fichier_convention
    ? <span className="inline-flex items-center gap-1.5 text-aej-blue font-medium hover:underline cursor-pointer"><FileText className="w-3.5 h-3.5" />{planRemb.fichier_convention.split('/').pop()}</span>
    : '—'

  const financementFields: FieldData[] = [
    { label: "Date d'ouverture du compte", value: formatDate(compte?.date_ouverture) },
    { label: "Avis partenaire",            value: compte?.avis_partenaire || '—' },
    { label: "Montant du crédit",          value: budget?.montant_accorde ? <span className="font-semibold text-aej-ink">{money(Number(budget.montant_accorde))}</span> : '—' },
    { label: "Approbation",               value: budgetStatutBadge },
    { label: "Taux d'intérêt",            value: planRemb?.interets != null ? `${planRemb.interets} %` : '—' },
    { label: "Durée du prêt",             value: planRemb?.duree_pret != null ? `${planRemb.duree_pret} mois` : '—' },
    { label: "Durée du remboursement",    value: planRemb?.duree_remboursement != null ? `${planRemb.duree_remboursement} mois` : '—' },
    { label: "Convention signée",         value: budget?.signature_convention === 'SIGNEE'
        ? <Badge className="bg-aej-green-soft text-aej-green-deep hover:bg-aej-green-soft shadow-none border-0 px-2 py-0.5 text-[11px]">Signée</Badge>
        : budget?.signature_convention === 'NON_SIGNEE'
        ? <Badge className="bg-aej-line-2 text-aej-ink-3 hover:bg-aej-line shadow-none border-0 px-2 py-0.5 text-[11px]">Non signée</Badge>
        : '—' },
    { label: "Déblocage",                 value: deblocage },
    { label: "Contrat / convention",      value: fichierConvention },
    { empty: true },
  ]

  const sections: SectionData[] = [
    { title: "Promoteur",                          fields: promoteurFields },
    { title: "Projet",                             fields: projetFields },
    { title: "Transmission au partenaire financier", fields: transmissionFields },
    { title: "Financement & remboursement (budgets)", fields: financementFields },
  ]

  return { sections, planRemboursementId: planRemb?.id }
}
