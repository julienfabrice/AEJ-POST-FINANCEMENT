import { Link } from '@tanstack/react-router'
import { LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

/** Lien tronqué, expiré ou déjà consommé : `uid` ou `token` manquant. */
export function InvalidLink() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <LinkIcon className="size-6 text-destructive" />
      </div>

      <h1 className="text-2xl font-extrabold">Lien invalide</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Ce lien est incomplet ou n’est plus valable. Demandez-en un nouveau depuis l’écran de
        connexion.
      </p>

      <Button
        asChild
        className="mt-6 h-12 w-full cursor-pointer bg-[#E7722B] text-base font-semibold text-white hover:bg-[#C85E18]"
      >
        <Link to={ROUTES.LOGIN}>Retour à la connexion</Link>
      </Button>
    </div>
  )
}
