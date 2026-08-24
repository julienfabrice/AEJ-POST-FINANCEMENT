import { z } from 'zod'

export const configurationSchema = z.object({
  // --- Système ---
  logo_systeme: z.string().optional().nullable(),
  sigle_systeme: z.string().min(1, 'Le sigle du système est requis.'),
  intitule_systeme: z.string().min(1, "L'intitulé du système est requis."),

  // --- Structure ---
  logo_structure: z.string().optional().nullable(),
  sigle_structure: z.string().min(1, 'Le sigle de la structure est requis.'),
  intitule_structure: z.string().min(1, "L'intitulé de la structure est requis."),
  adresse_sociale_structure: z.string().optional().nullable(),
  email_structure: z.email('Adresse e-mail invalide.'),
  whatsapp_structure: z.string().min(1, 'Le numéro WhatsApp est requis.'),
  telephone_structure: z.string().min(1, 'Le téléphone est requis.'),

  // --- Devise ---
  sigle_monnaie_pays: z.string().min(1, 'Le sigle de la monnaie est requis.'),
  sigle_devise_principale: z.string().min(1, 'La devise principale est requise.'),
  taux_devise_principale: z.number().positive('Le taux doit être positif.'),

  // --- Sécurité ---
  mise_en_maintenance: z.boolean(),
  delai_inactivite_minutes: z.number().int().min(1, 'Doit être supérieur à 0.'),
  nombre_session_possible: z.number().int().min(1, 'Doit être supérieur à 0.'),
  nombre_tentatives_connexion: z.number().int().min(1, 'Doit être supérieur à 0.'),
  delai_code_otp_minutes: z.number().int().min(1, 'Doit être supérieur à 0.'),
  delai_changement_mdp_mois: z.number().int().min(1, 'Doit être supérieur à 0.'),
  delai_suppression_secondes: z.number().int().min(1, 'Doit être supérieur à 0.'),

  // --- Notifications (WhatsApp) ---
  code_instance_whatsapp: z.string().optional().nullable(),
  token_instance_whatsapp: z.string().optional().nullable(),

  // --- Notifications (SMTP) ---
  email_notifications: z.email('Adresse e-mail invalide.'),
  mot_de_passe_email_notifications: z.string().min(1, 'Le mot de passe est requis.'),
  smtp_email_notifications: z.email('Adresse e-mail SMTP invalide.'),
  smtp_host_notifications: z.string().min(1, 'Le host SMTP est requis.'),
  smtp_port_notifications: z.number().int().min(1, 'Port invalide.'),
  smtp_encrypt_notifications: z.enum(['tls', 'ssl', 'none']),
})

export type ConfigurationFormValues = z.infer<typeof configurationSchema>
