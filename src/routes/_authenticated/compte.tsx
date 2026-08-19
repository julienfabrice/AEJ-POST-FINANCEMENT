import { createFileRoute } from '@tanstack/react-router'
import { ComptePage } from '@/pages/Compte'

/**
 * Placé DIRECTEMENT sous `_authenticated`, hors des arbres `_agent`/`_benef` :
 * tout utilisateur connecté a un compte. Aucun garde de permission — on ne gère
 * ici que ses propres informations.
 */
export const Route = createFileRoute('/_authenticated/compte')({
  component: ComptePage,
})
