import { Card } from '@/components/ui/card'

interface GroupItem {
  titre: string
  code: string
  agence: string
  nbImp: number
  retard: number
}

interface GroupCardProps {
  title: string
  items: GroupItem[]
  empty: string
  badgeColor: string
}

function GroupCard({ title, items, empty, badgeColor }: GroupCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-[#EEF2F7]">
        <h3 className="text-[13.5px] font-bold text-[#131C29]">{title}</h3>
        <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
          {items.length}
        </span>
      </div>
      <div className="p-4 flex-1 flex flex-col gap-2">
        {items.length === 0 ? (
          <div className="text-[13px] text-[#8595A8] italic flex-1 flex items-center justify-center text-center p-4 bg-[#fafbfd] rounded-md border border-dashed border-[#E5EAF1]">
            {empty}
          </div>
        ) : (
          items.map((it, idx) => (
            <div
              key={idx}
              className="group p-3 bg-white border border-[#E5EAF1] hover:border-[#D0D7E2] rounded-md shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <b className="block text-[13px] text-[#131C29] group-hover:text-[#2D6BD4] transition-colors">
                {it.titre}
              </b>
              <span className="text-[11.5px] text-[#5A6B80] leading-snug flex items-center gap-1 mt-1">
                {it.code} · {it.agence}
              </span>
              {(it.nbImp > 0 || it.retard > 0) && (
                <div className="mt-2 pt-2 border-t border-[#EEF2F7] border-dashed text-[11px] font-medium text-[#D6453B] flex items-center gap-2">
                  {it.nbImp > 0 && <span>{it.nbImp} échéance(s) impayée(s)</span>}
                  {it.retard > 0 && <span>{it.retard} j de retard</span>}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  )
}

interface GroupsGridProps {
  dossiersGroups: {
    AJOUR: GroupItem[]
    LEGER: GroupItem[]
    LOURD: GroupItem[]
  }
}

export function GroupsGrid({ dossiersGroups }: GroupsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <GroupCard
        title="À jour"
        items={dossiersGroups.AJOUR}
        empty="Aucun dossier à jour"
        badgeColor="bg-[#E7F6EC] text-[#0FA958]"
      />
      <GroupCard
        title="≤ 3 échéances impayées"
        items={dossiersGroups.LEGER}
        empty="Aucun dossier concerné"
        badgeColor="bg-[#FEF5E6] text-[#E7722B]"
      />
      <GroupCard
        title="> 3 échéances impayées"
        items={dossiersGroups.LOURD}
        empty="Aucun dossier concerné"
        badgeColor="bg-[#FBE7E5] text-[#D6453B]"
      />
    </div>
  )
}
