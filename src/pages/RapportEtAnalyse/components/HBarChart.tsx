interface HBarChartProps {
  data: { k: string; m: number }[]
}

export function HBarChart({ data }: HBarChartProps) {
  const maxM = Math.max(...data.map(d => d.m), 1)

  if (data.length === 0) {
    return <div className="text-[#8595A8] text-[13px] text-center p-4">Aucune donnée</div>
  }

  return (
    <div className="flex flex-col gap-[11px]">
      {data.map((r, i) => (
        <div key={i} className="grid grid-cols-[130px_1fr_52px] items-center gap-[12px] text-[12.5px]">
          <span className="text-[#5A6B80] font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
            {r.k}
          </span>
          <div className="bg-[#eef1f6] rounded-[20px] h-[11px] overflow-hidden">
            <div 
              className="h-full rounded-[20px] bg-gradient-to-r from-[#E7722B] to-[#20A83A] transition-all duration-500" 
              style={{ width: `${(r.m / maxM) * 100}%` }}
            />
          </div>
          <span className="text-right font-bold font-mono text-[#131C29]">
            {(r.m / 1_000_000).toFixed(2).replace('.', ',')}M
          </span>
        </div>
      ))}
    </div>
  )
}
