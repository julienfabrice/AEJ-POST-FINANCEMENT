import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { indicateurs, indicateurs_suivi } from '@/mock'

const fmt = (num: number) => new Intl.NumberFormat('fr-FR').format(num)

export function PlanificationTab() {
  const indicSuivi = (indId: number | string) => {
    return indicateurs_suivi
      .filter((s) => s.indicateur_id.toString() === indId.toString())
      .reduce((a, s) => a + (parseFloat(s.valeur) || 0), 0)
  }

  const indicTaux = (ind: any) => {
    if (!ind.valeur_cible) return 0
    const t = Math.round((indicSuivi(ind.id) / ind.valeur_cible) * 100)
    return Math.min(100, t)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
        <CardTitle className="text-lg">Atteinte des cibles</CardTitle>
        <div className="text-xs text-[#8595A8]">valeur cible · valeur suivi · taux</div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {indicateurs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">Aucun indicateur</div>
          ) : (
            indicateurs.map((i) => {
              const s = indicSuivi(i.id)
              const t = indicTaux(i)
              const cl = t >= 75 ? 'bg-[#20A83A]' : t >= 40 ? 'bg-[#E0A106]' : 'bg-[#D6453B]'
              const textCl = t >= 75 ? 'text-[#20A83A]' : t >= 40 ? 'text-[#E0A106]' : 'text-[#D6453B]'

              return (
                <div key={i.id} className="group">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="font-mono text-[#E7722B] border-[#E7722B] bg-[#FBEADE]">
                      {i.code}
                    </Badge>
                    <span className="font-bold text-sm text-[#131C29]">{i.nom}</span>
                    <div className="flex-1"></div>
                    <span className="font-mono text-sm text-[#8595A8]">
                      {fmt(s)} / {fmt(i.valeur_cible)} {i.unite}
                    </span>
                    <span className={`font-mono font-bold text-sm ml-4 ${textCl}`}>
                      {t}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${cl}`}
                      style={{ width: `${Math.min(100, t)}%` }}
                    ></div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
