import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { traiterSchema, type TraiterFormValues } from '@/schema/workflowActions/traiterSchema'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

export function useTraiterForm(projet: MICRO_PROJET_T | null, onReset?: () => void) {
  const budgetActuel = projet?.budget

  const form = useForm<TraiterFormValues>({
    resolver: zodResolver(traiterSchema),
    defaultValues: {
      decision: 'EN_ATTENTE',
      date_ouverture_compte: new Date().toISOString().slice(0, 10),
      montant_credit: 0,
      taux_interet: 0,
      duree_pret: 0,
      duree_remboursement: 0,
      motif_rejet: '',
    },
  })

  const watchDecision = form.watch('decision')

  useEffect(() => {
    if (!projet) return

    let defaultDecision: 'EN_ATTENTE' | 'APPROUVE' | 'REJETE' = 'EN_ATTENTE'
    if (budgetActuel?.statut === 'APPROUVE') defaultDecision = 'APPROUVE'
    if (budgetActuel?.statut === 'NON_APPROUVE') defaultDecision = 'REJETE'

    form.reset({
      decision: defaultDecision,
      date_ouverture_compte: budgetActuel?.date_accord || new Date().toISOString().slice(0, 10),
      montant_credit: Number(budgetActuel?.montant_accorde || projet.montant_total || 0),
      taux_interet: 0,
      duree_pret: 0,
      duree_remboursement: 0,
      motif_rejet: budgetActuel?.observations || '',
    })

    if (onReset) onReset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projet, budgetActuel, form])

  return {
    form,
    watchDecision,
  }
}
