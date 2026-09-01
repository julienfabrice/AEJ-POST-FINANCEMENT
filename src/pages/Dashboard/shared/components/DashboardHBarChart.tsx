interface HBarItem {
  label: string
  /** Valeur numérique utilisée pour calculer la largeur relative de la barre */
  value: number
  /** Texte affiché à droite de la barre (ex: "8 · 25.5M") */
  meta: string
}

interface Props {
  items: HBarItem[]
  labelWidth?: string
}

/**
 * Graphique à barres horizontales générique.
 * Chaque barre est proportionnelle à la valeur max.
 * Affiche label | barre | métadonnée.
 */
export function DashboardHBarChart({ items, labelWidth = '130px' }: Props) {
  const max = Math.max(...items.map(i => i.value), 1)

  return (
    <div className="flex flex-col gap-[11px]">
      {items.map((item, idx) => {
        const width = (item.value / max) * 100
        return (
          <div
            key={idx}
            className="grid items-center gap-[12px] text-[12.5px]"
            style={{ gridTemplateColumns: `${labelWidth} 1fr 70px` }}
          >
            <span className="truncate font-medium text-[#5A6B80]">{item.label}</span>
            <div className="bg-[#eef1f6] rounded-[20px] h-[11px] overflow-hidden">
              <div
                className="h-full rounded-[20px] transition-all"
                style={{
                  width: `${width}%`,
                  background: 'linear-gradient(90deg, #E7722B, #20A83A)'
                }}
              />
            </div>
            <span className="text-right font-bold font-mono text-[#131C29]">{item.meta}</span>
          </div>
        )
      })}
    </div>
  )
}
