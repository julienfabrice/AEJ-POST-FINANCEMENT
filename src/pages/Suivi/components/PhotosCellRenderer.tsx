import type { ICellRendererParams } from 'ag-grid-community'
import { FileText } from 'lucide-react'
import type { EXPLOITATION_T } from '@/types'

/**
 * Pièces jointes — NOMBRE de photos de visite liées, précédé d'une icône
 * document (l'icône `doc` de la maquette).
 *
 * ARBITRAGE maquette ↔ API : la maquette avait un champ TEXTE « Pièces
 * jointes » qui contenait un nom de fichier. Ce champ n'existe pas côté API :
 * les pièces jointes sont une RELATION (`visite_photos`, ressource
 * `/visite-photos`). Un champ absent de l'API n'est ni inventé ni simulé — la
 * colonne affiche donc le décompte réel de la relation, déjà embarquée par
 * `GET /exploitations` (aucune requête supplémentaire).
 */
export const PhotosCellRenderer = (params: ICellRendererParams<EXPLOITATION_T>) => {
  const nombre = params.data?.visite_photos?.length ?? 0

  if (nombre === 0) {
    return <span className="text-[12.5px] text-slate-500">—</span>
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-[12.5px] text-slate-500">
      <FileText className="h-3.5 w-3.5 shrink-0" />
      {nombre}
    </span>
  )
}
