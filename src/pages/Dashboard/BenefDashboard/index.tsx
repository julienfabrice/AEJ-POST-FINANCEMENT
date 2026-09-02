import { useBenefDashboard } from './hooks/useBenefDashboard'
import { BenefDashboardKpis } from './UI/BenefDashboardKpis'
import { BenefDashboardTasks } from './UI/BenefDashboardTasks'

export function BenefDashboard() {
  const { user, projet } = useBenefDashboard()

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-[#131C29]">Mon espace bénéficiaire</h1>
        <p className="text-sm text-[#5A6B80] mt-1">
          Bienvenue {user?.prenom || 'Bénéficiaire'} — voici votre tableau de bord.
        </p>
      </div>

      <BenefDashboardKpis projet={projet} />
      <BenefDashboardTasks />
    </div>
  )
}
