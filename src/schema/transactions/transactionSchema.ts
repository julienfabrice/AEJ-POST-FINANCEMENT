import { z } from 'zod'
import type { TRANSACTION_T } from '@/types'

export const transactionSchema = z.object({
  micro_projet_id: z.number().int().positive('Le micro-projet est requis.'),
  promoteur_id: z.number().int().positive().optional(),
  categorie_id: z.number().int().positive().optional(),
  libelle: z.string().min(1, "L'intitulé est requis."),
  type: z.enum(['DEPENSE', 'RECETTE']),
  montant: z.number().positive('Le montant doit être positif.'),
  statut: z.enum(['BROUILLON', 'SOUMIS', 'VALIDE', 'REJETE', 'ANNULE']),
  mode_paiement: z.string().optional(),
  reference: z.string().optional(),
  observations: z.string().optional(),
  date: z.string().optional(),
})

export type TransactionFormValues = z.infer<typeof transactionSchema>

export type TRANSACTION_CREATE_PAYLOAD_T = Omit<
  TRANSACTION_T,
  'id' | 'created_at' | 'updated_at' | 'saisi_par' | 'micro_projet' | 'categorie'
>
