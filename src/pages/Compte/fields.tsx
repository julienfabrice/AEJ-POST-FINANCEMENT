import {
  BadgeCheck,
  Briefcase,
  Building2,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  UserCog,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { PERSONNEL_T } from '@/types/personnels.types'

/**
 * Champs réellement modifiables par l'utilisateur sur son propre compte.
 *
 */
export type EditableField = 'identite' | 'email' | 'telephone' | 'adresse' | 'password'

export interface DetailItem {
  label: string
  value: string
  icon: LucideIcon
  /** Absent = carte en lecture seule. */
  field?: EditableField
}

/** Valeur affichée quand le backend ne renvoie rien. */
export const EMPTY_VALUE = 'Non renseigné'

const orEmpty = (value?: string | null) => (value?.trim() ? value : EMPTY_VALUE)

/**
 * La grille est construite comme une DONNÉE: ajouter
 * une ligne ne demande qu'une entrée ici.
 */
export function buildDetails(user: PERSONNEL_T): DetailItem[] {
  return [
    {
      label: 'Nom complet',
      value: `${user.prenom} ${user.nom}`.trim() || EMPTY_VALUE,
      icon: UserCog,
      field: 'identite',
    },
    { label: 'Email', value: orEmpty(user.email), icon: Mail, field: 'email' },
    { label: 'Téléphone', value: orEmpty(user.telephone), icon: Phone, field: 'telephone' },
    { label: 'Adresse', value: orEmpty(user.adresse), icon: MapPin, field: 'adresse' },
    { label: 'Rôle', value: orEmpty(user.role?.libelle), icon: BadgeCheck },
    { label: 'Fonction', value: orEmpty(user.fonction?.nom), icon: Briefcase },
    { label: 'Agence régionale', value: orEmpty(user.agence?.libelle), icon: Building2 },
    { label: 'Organisme', value: orEmpty(user.organisme?.libelle), icon: Building2 },
    {
      label: 'Mot de passe',
     
      value: 'Mot de passe initial',
      icon: KeyRound,
      field: 'password',
    },
  ]
}
