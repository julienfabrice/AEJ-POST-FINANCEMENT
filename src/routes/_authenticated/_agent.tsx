import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/store/useAuthStore'

export const Route = createFileRoute('/_authenticated/_agent')({
  beforeLoad: () => {
    const { user } = useAuthStore.getState()
    if (user?.kind === 'benef') {
      throw redirect({ to: '/benef-dashboard' })
    }
  },
  component: AgentLayout,
})

function AgentLayout() {
  return <Outlet />
}
