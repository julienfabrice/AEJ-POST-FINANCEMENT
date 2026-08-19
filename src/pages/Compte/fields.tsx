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
 * La maquette de référence proposait « titre » et « région » ; ni l'un ni
 * l'autre n'existe ici : le personnel AEJ n'a pas de titre, et son rattachement
 * (agence / organisme) relève de l'administration, pas du compte. `adresse`
 * les remplace — c'est le champ libre que `PUT /personnels/{id}` accepte.
 */
export type EditableField = 'telephone' | 'adresse' | 'password'

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
 * La grille est construite comme une DONNÉE, pas comme du JSX répété : ajouter
 * une ligne ne demande qu'une entrée ici.
 */
export function buildDetails(user: PERSONNEL_T): DetailItem[] {
  return [
    {
      label: 'Nom complet',
      value: `${user.prenom} ${user.nom}`.trim() || EMPTY_VALUE,
      icon: UserCog,
    },
    { label: 'Email', value: orEmpty(user.email), icon: Mail },
    { label: 'Téléphone', value: orEmpty(user.telephone), icon: Phone, field: 'telephone' },
    { label: 'Adresse', value: orEmpty(user.adresse), icon: MapPin, field: 'adresse' },
    { label: 'Rôle', value: orEmpty(user.role?.libelle), icon: BadgeCheck },
    // ⚠️ `FONCTION_T` porte `nom`, pas `libelle`, contrairement aux autres relations.
    { label: 'Fonction', value: orEmpty(user.fonction?.nom), icon: Briefcase },
    { label: 'Agence régionale', value: orEmpty(user.agence?.libelle), icon: Building2 },
    { label: 'Organisme', value: orEmpty(user.organisme?.libelle), icon: Building2 },
    {
      label: 'Mot de passe',
      // Le backend ne renvoie pas de date de dernière modification : on se
      // rabat sur le seul signal disponible (`mot_de_passe_change`, inversé).
      value:
        user.mot_de_passe_change === 0
          ? 'Mot de passe initial — à personnaliser'
          : 'Mot de passe personnalisé',
      icon: KeyRound,
      field: 'password',
    },
  ]
}
