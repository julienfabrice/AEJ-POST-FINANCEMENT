import { IMAGES } from '@/constants/images'

export function LoginBrand() {
  return (
    <div
      className="relative hidden md:flex flex-col p-12 pl-16 text-white overflow-hidden justify-center items-start"
      style={{ background: 'radial-gradient(1200px 600px at -10% -10%, #22314a 0, #131C29 60%)' }}
    >
      {/* Bandeau vertical drapeau CI */}
      <div className="absolute top-0 left-0 h-full w-3.5 flex flex-col">
        <b className="flex-1 bg-[#E7722B]" />
        <b className="flex-1 bg-white" />
        <b className="flex-1 bg-[#20A83A]" />
      </div>

      {/* Cercles décoratifs (Glow) */}
      <div className="absolute w-[520px] h-[520px] rounded-full bg-[#E7722B]/20 blur-3xl -bottom-40 -right-40 pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6 max-w-lg">
        {/* Logo AEJ */}
        <div className="mb-2">
          <img
            src={IMAGES.logoLogin}
            alt="République de Côte d'Ivoire — Agence Emploi Jeunes"
            className="h-30 object-contain rounded-lg" />
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
