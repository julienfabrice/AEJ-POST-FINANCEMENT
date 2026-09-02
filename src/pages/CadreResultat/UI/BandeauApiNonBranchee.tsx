import { Info } from 'lucide-react'
import { CADRE_RESULTAT_API_PRETE, MESSAGE_BANDEAU_API_NON_BRANCHEE } from '../constants'

/**
 * Bandeau d'INFORMATION — « l'écran est prêt, les données arriveront ».
 *
 * ── Pourquoi bleu et non rouge ──
 * Ce n'est PAS une erreur : rien n'est cassé, rien n'a échoué, aucune requête
 * n'a même été tentée (`enabled: false`). Un bandeau rouge ferait croire à une
 * panne et déclencherait des signalements pour un état parfaitement nominal.
 * On reprend donc le bleu d'information de la palette produit
 * (#E5EDFB / #2D6BD4, cf. `src/constants/colors.ts`), et non le rouge
 * (#FBE7E5 / #D6453B) que le dépôt réserve aux vraies défaillances.
 *
 * ── Pourquoi il DISPARAÎT tout seul ──
 * Le composant ne rend rien quand `CADRE_RESULTAT_API_PRETE` vaut `true`. Le
 * jour du branchement, il n'y a donc RIEN à retirer de la page : le bandeau
 * s'efface avec le drapeau, comme tout le reste du dispositif. C'est la raison
 * pour laquelle la condition vit ici et non chez l'appelant — un `{!PRETE && …}`
 * dans la page serait un second endroit à ne pas oublier.
 *
 * Discret par construction : une seule ligne, pas d'icône d'alerte, pas de
 * bouton de fermeture (il n'y a rien à acquitter), typographie du corps de
 * page.
 */
export function BandeauApiNonBranchee() {
  if (CADRE_RESULTAT_API_PRETE) return null

  return (
    <div
      // `role="status"` et non `role="alert"` : l'information est utile mais
      // n'exige aucune action immédiate, et n'a pas à interrompre un lecteur
      // d'écran au milieu de sa lecture.
      role="status"
      className="flex items-start gap-2.5 rounded-[7px] border border-[#E5EDFB] bg-[#E5EDFB]/60 px-3.5 py-2.5"
    >
      <Info className="mt-[1px] h-4 w-4 shrink-0 text-[#2D6BD4]" aria-hidden="true" />
      <p className="text-[12.5px] leading-[1.5] text-[#2D6BD4]">
        {MESSAGE_BANDEAU_API_NON_BRANCHEE}
      </p>
    </div>
  )
}
