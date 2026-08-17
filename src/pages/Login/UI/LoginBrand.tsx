export function LoginBrand() {
  return (
    <div className="relative hidden md:flex flex-col p-12 bg-slate-900 text-white overflow-hidden justify-center items-start">
      {/* Cercles décoratifs (Glow) */}
      <div className="absolute w-[520px] h-[520px] rounded-full bg-orange-500/20 blur-3xl -bottom-40 -right-40" />
      
      <div className="relative z-10 flex flex-col gap-6 max-w-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg">
            <span className="font-bold text-lg">AEJ</span>
          </div>
          <div className="leading-tight">
            <span className="font-extrabold block text-lg tracking-wide">
              AGENCE <em className="text-green-500 not-italic">EMPLOI JEUNES</em>
            </span>
            <span className="text-xs text-slate-400 font-semibold tracking-widest uppercase">
              Guichets Opérationnels
            </span>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold leading-tight mt-6">
          SYSTEME INFORMATISE DE SUIVI DES STAGIAIRES ET DES BENEFICIAIRES DE FINANCEMENTS
        </h1>
        <p className="text-slate-300">
          Pilotage de bout en bout des guichets de financement de la jeunesse — de l'enrôlement au remboursement.
        </p>
      </div>

      <div className="absolute bottom-12 left-12 text-xs text-slate-500 z-10">
        © 2026 Tous droits réservés | COSIT
      </div>
    </div>
  )
}
