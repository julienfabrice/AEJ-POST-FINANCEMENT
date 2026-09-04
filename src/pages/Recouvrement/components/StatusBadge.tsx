export type BadgeCls = 'am' | 'gr' | 'bl' | 'or' | 'rd' | 'gy'

export function StatusBadge({ text, cls }: { text: string | number; cls: BadgeCls }) {
  const classes: Record<BadgeCls, string> = {
    am: 'bg-[#FBF1D6] text-[#8a6503]',
    gr: 'bg-[#E3F6E7] text-[#178A2E]',
    bl: 'bg-[#E5EDFB] text-[#2D6BD4]',
    or: 'bg-[#FBEADE] text-[#C85E18]',
    rd: 'bg-[#FBE7E5] text-[#D6453B]',
    gy: 'bg-[#eef1f6] text-[#5A6B80]',
  }
  return (
    <span
      className={`inline-flex items-center text-[11.5px] font-semibold px-[9px] py-[3px] rounded-full whitespace-nowrap ${classes[cls]}`}
    >
      {text}
    </span>
  )
}
