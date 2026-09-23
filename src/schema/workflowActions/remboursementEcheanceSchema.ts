import { z } from 'zod'

export const remboursementEcheanceSchema = z.object({
  plan_remboursement_id: z.number().int().positive(),
  periode: z.number().int().min(1, 'La période est requise.'),
  date_echeance: z.string().min(1, 'La date est requise.'),
  montant_echeance: z.number({ message: 'Le montant est requis.' }).min(0),
  capital_rembourse: z.number({ message: 'Requis.' }).min(0),
  capital_restant: z.number({ message: 'Requis.' }).min(0),
  interets: z.number({ message: 'Requis.' }).min(0),
  amortissement_capital: z.number({ message: 'Requis.' }).min(0),
  statut: z.enum(['PAYE', 'PARTIEL', 'NON_PAYE']),
})

export type RemboursementEcheanceFormValues = z.infer<typeof remboursementEcheanceSchema>

export const remboursementStatutSchema = z.object({
  statut: z.enum(['PAYE', 'PARTIEL', 'NON_PAYE']),
})

export type RemboursementStatutFormValues = z.infer<typeof remboursementStatutSchema>
