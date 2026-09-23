import { z } from 'zod'

export const executionLigneDecaissementSchema = z.object({
  ligne_decaissement_id: z.number(),
  statut: z.enum(['VALIDE', 'NON_VALIDE']),
  mode_decaisse: z.enum(['CHEQUE', 'VIREMENT']),
  date_decaisse: z.string(),
  justificatif_path: z.string(),
  observations: z.string().optional()
})

export type ExecutionLigneDecaissementPayload = z.infer<typeof executionLigneDecaissementSchema>
