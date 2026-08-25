import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  echeancierGeneratorSchema,
  type EcheancierGeneratorFormValues,
} from '@/schema/plan-remboursements/echeancierGeneratorSchema'
import { generateEcheancier, type EcheanceRow } from '@/lib/echeancier'
import { planRemboursementServices } from '@/services/planRemboursements.services'

const DEFAULT_VALUES: EcheancierGeneratorFormValues = {
  micro_projet_id: 0,
  budget_id: undefined,
  capital: 0,
  taux_annuel: 0,
  duree_mois: 12,
  differe_mois: 0,
  date_debut: '',
}

export function useEcheancierGenerator() {
  const form = useForm<EcheancierGeneratorFormValues>({
    resolver: zodResolver(echeancierGeneratorSchema),
    defaultValues: DEFAULT_VALUES,
  })
  const [preview, setPreview] = useState<EcheanceRow[]>([])
  const { mutate: saveEcheancier, isPending: isSaving } = planRemboursementServices.useSaveEcheancier()

  const onGenerate = form.handleSubmit((values) => {
    const rows = generateEcheancier({
      capital: values.capital,
      tauxAnnuel: values.taux_annuel,
      dureeMois: values.duree_mois,
      differeMois: values.differe_mois,
      dateDebut: values.date_debut,
    })
    setPreview(rows)
  })

  const onSave = () => {
    const values = form.getValues()
    if (preview.length === 0) return
    const payload = preview.map((row) => ({
      micro_projet_id: values.micro_projet_id,
      budget_id: values.budget_id,
      echeance_mensuelle: row.echeance_mensuelle,
      montant_echeance: row.montant_echeance,
      periode: row.periode,
      capital_rembourse: row.capital_rembourse,
      capital_restant: row.capital_restant,
      interets: row.interets,
      amortissement_capital: row.amortissement_capital,
    }))
    saveEcheancier(payload, { onSuccess: () => setPreview([]) })
  }

  return { form, preview, onGenerate, onSave, isSaving }
}
