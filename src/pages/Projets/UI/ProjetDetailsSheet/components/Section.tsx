import React from 'react'

interface SectionProps {
  title: string
  children: React.ReactNode
}

export function Section({ title, children }: SectionProps) {
  return (
    <div className="mb-7">
      <h3 className="text-[12px] font-bold text-aej-ink-2 mb-3 uppercase tracking-wider">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1px] bg-aej-line-2 border border-aej-line-2 rounded-lg overflow-hidden shadow-sm">
        {children}
      </div>
    </div>
  )
}
