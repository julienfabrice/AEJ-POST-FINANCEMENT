import { Hammer } from 'lucide-react'

export function UnderConstruction() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 bg-slate-50/50 rounded-2xl border-2 border-slate-100 border-dashed mt-6">
      <div className="w-16 h-16 bg-orange-100/50 rounded-2xl flex items-center justify-center mb-5">
        <Hammer className="w-8 h-8 text-[#E7722B]" />
      </div>
      <h2 className="text-xl font-semibold text-[#131C29] mb-2">En cours de construction</h2>
      <p className="text-[#5A6B80] text-sm text-center max-w-sm">
        Cette interface est actuellement en cours de développement. Les fonctionnalités seront disponibles dans une prochaine mise à jour.
      </p>
    </div>
  )
}
