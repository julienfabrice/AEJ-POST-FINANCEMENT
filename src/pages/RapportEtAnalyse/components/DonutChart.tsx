import { CHART_COLORS } from '@/mock/rapports.mock'

interface DonutChartProps {
  data: { k: string; v: number }[]
  total: number
}

export function DonutChart({ data, total }: DonutChartProps) {
  const displayTotal = total || 1
  const C = 2 * Math.PI * 54
  let start = 0

  const fmt = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num)
  }

  const isMillion = total >= 1_000_000
  const centerText = isMillion ? (total / 1_000_000).toFixed(1).replace('.', ',') : fmt(total)
  const centerLabel = isMillion ? 'MILLIONS F' : 'TOTAL'

  return (
    <div className="flex gap-[22px] items-center flex-wrap">
      <div className="flex-none">
        <svg viewBox="0 0 140 140" width="146" height="146">
          {data.map((d, i) => {
            const len = (d.v / displayTotal) * C
            const strokeDashoffset = -start
            start += len
            return (
              <circle
                key={i}
                cx="70"
                cy="70"
                r="54"
                fill="none"
                stroke={CHART_COLORS[i % CHART_COLORS.length]}
                strokeWidth="20"
                strokeDasharray={`${len.toFixed(2)} ${(C - len).toFixed(2)}`}
                strokeDashoffset={strokeDashoffset.toFixed(2)}
                transform="rotate(-90 70 70)"
              />
            )
          })}
          <circle cx="70" cy="70" r="44" fill="#fff" />
          <text 
            x="70" y="66" 
            textAnchor="middle" 
            fontWeight="800" 
            fontSize="22" 
            fill="#131C29"
          >
            {centerText}
          </text>
          <text 
            x="70" y="83" 
            textAnchor="middle" 
            fontSize="8.5" 
            fill="#8595A8" 
            letterSpacing="1"
          >
            {centerLabel}
          </text>
        </svg>
      </div>
      <div className="flex-1 min-w-[180px] flex flex-col gap-[9px]">
        {data.length > 0 ? data.map((d, i) => {
          const pct = displayTotal ? Math.round((d.v / displayTotal) * 100) : 0
          return (
            <div key={i} className="flex items-center gap-[9px] text-[12.5px]">
              <span 
                className="w-[11px] h-[11px] rounded-[3px] flex-none inline-block" 
                style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
              />
              <span className="flex-1 text-[#131C29] font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                {d.k}
              </span>
              <b className="font-mono">{(d.v / 1_000_000).toFixed(2).replace('.', ',')}M</b>
              <span className="text-[#5A6B80] text-[11.5px] w-[36px] text-right font-semibold">
                {pct}%
              </span>
            </div>
          )
        }) : (
          <div className="text-[#8595A8] text-[13px] text-center p-4">—</div>
        )}
      </div>
    </div>
  )
}
