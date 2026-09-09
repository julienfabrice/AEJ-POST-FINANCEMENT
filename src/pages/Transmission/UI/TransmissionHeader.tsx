export function TransmissionHeader() {
  return (
    <div>
      <h1 className="text-[24px] font-extrabold text-[#131C29] font-['Archivo'] tracking-tight flex items-center gap-2">
        Transmission par lot
      </h1>
      <p className="text-[13px] text-[#5A6B80] mt-1 flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        <b>Circuit de financement</b> — Répartition des dossiers entre les partenaires financiers, par lot Excel accompagné du courrier de transmission.
      </p>
    </div>
  )
}
