import React from 'react'

interface FieldProps {
  label?: string
  value?: React.ReactNode
  empty?: boolean
}

export function Field({ label, value, empty }: FieldProps) {
  if (empty) return <div className="bg-aej-bg h-full w-full" />
  return (
    <div className="bg-white p-3 flex flex-col gap-1">
      <div className="text-[11.5px] font-semibold text-aej-slate-2 tracking-wide">{label}</div>
      <div className="text-[13.5px] font-medium text-aej-ink">{value}</div>
    </div>
  )
}
