import { z } from 'zod'

export const ligneDecaissementSchema = z.object({
  numero_ligne: z.number().int().positive(),
  object_ligne: z.string().optional(),
  montant_ligne: z.number().positive('Le montant doit être positif.'),
  mode_decaisse: z.enum(['CHEQUE', 'VIREMENT']),
  date_prevue: z.string().optional(),
  intitule_prestataire: z.string().min(1, 'Le prestataire est requis.'),
  numero_compte: z.string().optional(),
  contact: z.string().optional(),
  statut: z.enum(['VALIDE', 'NON_VALIDE']),
  observations: z.string().optional(),
})

export const planDecaissementSchema = z.object({
  micro_projet_id: z.number().int().positive('Le micro-projet est requis.'),
  budget_id: z.number().int().positive().optional(),
  compte_financement_id: z.number().int().positive().optional(),
  montant_planifie: z.number().positive('Le montant planifié doit être positif.'),
  date_prevue: z.string().optional(),
  lignes: z.array(ligneDecaissementSchema).min(1, 'Ajoutez au moins une ligne par prestataire.'),
})

export type LigneDecaissementFormValues = z.infer<typeof ligneDecaissementSchema>
export type PlanDecaissementFormValues = z.infer<typeof planDecaissementSchema>
