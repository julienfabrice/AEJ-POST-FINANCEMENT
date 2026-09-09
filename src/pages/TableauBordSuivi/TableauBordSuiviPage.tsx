import { Card } from '@/components/ui/card'

export function TableauBordSuiviPage() {
  return (
    <div className="space-y-4">
      <Card className="p-0 overflow-hidden border-slate-200 rounded-lg shadow-sm h-[100vh] w-full">
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
