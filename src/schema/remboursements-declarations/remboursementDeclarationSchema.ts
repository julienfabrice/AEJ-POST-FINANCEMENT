import { z } from 'zod'
import type { REMBOURSEMENT_DECLARATION_T } from '@/types'

export const remboursementDeclarationSchema = z.object({
  promoteur_id: z.number().int().positive('Le promoteur est requis.'),
  budget_id: z.number().int().positive('Le budget est requis.'),
  montant_declare: z.number().positive('Le montant doit être positif.'),
  date_declaree: z.string().min(1, 'La date est requise.'),
  reference_banque: z.string().optional(),
  justificatif_path: z.string().optional(),
  observations: z.string().optional(),
  statut: z.enum(['BROUILLON', 'SOUMIS', 'TRAITE']),
})

export type RemboursementDeclarationFormValues = z.infer<typeof remboursementDeclarationSchema>

export type REMBOURSEMENT_DECLARATION_CREATE_PAYLOAD_T = Omit<
  REMBOURSEMENT_DECLARATION_T,
  'id' | 'created_at' | 'updated_at' | 'promoteur' | 'budget'
>
