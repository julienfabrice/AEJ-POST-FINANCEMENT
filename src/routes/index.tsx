import { createFileRoute } from '@tanstack/react-router'
import { Button } from "@/components/ui/button"
import { Check, Mail, Trash2 } from "lucide-react"

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-background text-foreground">
      <h1 className="text-4xl font-bold">Vite + React + Shadcn UI + TanStack</h1>
      <p className="text-muted-foreground">
        Le projet est initialisé et Shadcn est fonctionnel avec le Router.
      </p>
      <div className="flex gap-4">
        <Button>
          <Check /> Bouton par défaut
        </Button>
        <Button variant="secondary">
          <Mail /> Bouton secondaire
        </Button>
        <Button variant="destructive">
          <Trash2 /> Bouton destructif
        </Button>
      </div>
    </div>
  )
}
