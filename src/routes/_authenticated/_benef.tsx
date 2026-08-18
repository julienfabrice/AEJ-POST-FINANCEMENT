import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/store/useAuthStore'

export const Route = createFileRoute('/_authenticated/_benef')({
  beforeLoad: () => {
    const { user } = useAuthStore.getState()
    if (user?.kind === 'agent') {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: BenefLayout,
})

function BenefLayout() {
  return <Outlet />
}
