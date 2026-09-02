import { Card } from '@/components/ui/card'

export function TableauBordSuiviPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-[#131C29]">Tableau de bord de suivi</h1>
        <p className="mt-1 text-sm text-[#5A6B80]">
          Visualisation Power BI des indicateurs de suivi et exploitation.
        </p>
      </div>

      <Card className="p-0 overflow-hidden border-slate-200 rounded-lg shadow-sm h-[calc(100vh-210px)] w-full">
        <iframe 
          title="Tableau de bord Power BI" 
          width="100%" 
          height="100%" 
          src="https://app.powerbi.com/view?r=eyJrIjoiMzc4MzBlZmMtMTg3Ny00MDQ3LTg1ODktYzFhMzcxMzU3MzEyIiwidCI6IjZkMjZlN2JkLTAxNTQtNDkwMC1hNmM0LWZjMjZmM2I4ZmRiZiJ9" 
          frameBorder="0" 
          allowFullScreen={true}
        />
      </Card>
    </div>
  )
}
