import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-background text-foreground">
      <h1 className="text-4xl font-bold">Vite + React + Shadcn UI</h1>
      <p className="text-muted-foreground">
        Le projet est initialisé et Shadcn est fonctionnel.
      </p>
      <div className="flex gap-4">
        <Button>Bouton par défaut</Button>
        <Button variant="secondary">Bouton secondaire</Button>
        <Button variant="destructive">Bouton destructif</Button>
      </div>
    </div>
  )
}

export default App
