import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/store/useAuthStore'

export const Route = createFileRoute('/_authenticated/_benef')({
  beforeLoad: () => {
    // L'espace bénéficiaire n'est ouvert qu'au promoteur (`entreprise`).
    if (useAuthStore.getState().space() !== 'entreprise') {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: BenefLayout,
})

function BenefLayout() {
  return <Outlet />
}
