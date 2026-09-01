interface BarItem {
  label: string
  value: number
  /** Si true, couleur verte (ex: SUIVI, REMBOURSEMENT). Sinon orange. */
  highlighted?: boolean
}

interface Props {
  items: BarItem[]
  height?: string
}

/**
 * Histogramme vertical générique.
 * Chaque barre est proportionnelle à la valeur max de la série.
 * Couleur configurable via `highlighted`.
 */
export function DashboardBarChart({ items, height = '170px' }: Props) {
  const max = Math.max(...items.map(s => s.value), 1)

  return (
    <div className="flex items-end gap-[10px] overflow-x-auto pt-[10px] min-w-[400px]" style={{ height }}>
      {items.map((item, idx) => {
        const barHeight = 8 + (item.value / max) * 88
        const gradient = item.highlighted
          ? 'linear-gradient(#20A83A, #178A2E)'
          : 'linear-gradient(#E7722B, #C85E18)'

        return (
          <div key={idx} className="flex-1 flex flex-col items-center gap-[7px] h-full justify-end group">
            <span className="text-[11px] font-bold text-[#131C29]">{item.value}</span>
            <div
              className="w-full max-w-[38px] rounded-t-[6px] transition-all group-hover:opacity-80"
              style={{ height: `${barHeight}%`, background: gradient }}
            />
            <span className="text-[11px] text-[#5A6B80] text-center leading-[1.2] w-full break-words">
              {item.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
