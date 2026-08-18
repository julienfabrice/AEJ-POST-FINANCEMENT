import { Flag } from 'lucide-react'

export function AdminDashboardHeader() {
  

  return (
    <div className="flex items-center gap-2 text-xl text-[#131C29]">
      <Flag className="w-5 h-5 text-[#E7722B]" />
      <b>Agence Emploi Jeunes - Vue Consolidée</b>
    </div>
  )
}
