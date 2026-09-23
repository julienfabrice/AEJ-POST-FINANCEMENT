import React from 'react'

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mt-5 mb-2 pb-1.5 border-b border-slate-100">
      {children}
    </h4>
  )
}

export function FieldGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-slate-100 rounded-lg overflow-hidden bg-white">
      {children}
    </div>
  )
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="p-3 border-b border-r border-slate-100 last:border-b-0 sm:[&:nth-last-child(1)]:border-b-0 sm:[&:nth-last-child(2)]:border-b-0 even:border-r-0">
      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-[13px] font-medium text-slate-700">
        {children}
      </div>
    </div>
  )
}
