import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/store/useAuthStore'

export const Route = createFileRoute('/_authenticated/')({
  beforeLoad: () => {
    const { user } = useAuthStore.getState()
    if (user?.kind === 'benef') {
      throw redirect({ to: '/benef-dashboard' })
    } else {
      throw redirect({ to: '/dashboard' })
    }
  },
})
