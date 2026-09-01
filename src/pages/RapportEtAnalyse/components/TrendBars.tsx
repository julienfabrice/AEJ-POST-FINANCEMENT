interface TrendBarsProps {
  data: { k: string; v: number; lbl: string }[]
}

export function TrendBars({ data }: TrendBarsProps) {
  const max = Math.max(...data.map(d => d.v), 1)

  return (
    <div className="flex items-end gap-[10px] pt-[10px] h-full min-h-[130px]">
      {data.map((d, i) => {
        const heightPct = 12 + (d.v / max) * 80
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-[7px] h-full justify-end">
            <span className="text-[11px] font-bold text-[#131C29]">
              {d.v}
            </span>
            <div 
              className="w-full max-w-[38px] rounded-t-[6px] bg-gradient-to-t from-[#0A9A54] to-[#20A83A] relative transition-all duration-500 ease-in-out"
              style={{ height: `${heightPct}%` }}
            />
            <span className="text-[11px] text-[#5A6B80] text-center leading-tight">
              {d.lbl}
            </span>
          </div>
        )
      })}
    </div>
  )
}
