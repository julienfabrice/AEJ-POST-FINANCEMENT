import { createFileRoute, redirect } from '@tanstack/react-router'
import { OtpPage } from '@/pages/Otp'
import { ROUTES } from '@/constants/routes'
import { useAuthFlowStore } from '@/store/useAuthFlowStore'

export const Route = createFileRoute('/2fa')({
  // `pendingUserId` n'est pas persisté : un rafraîchissement ou un accès direct
  // le perd, et l'utilisateur repart du login. C'est voulu.
  beforeLoad: () => {
    if (!useAuthFlowStore.getState().pendingUserId) {
      throw redirect({ to: ROUTES.LOGIN, replace: true })
    }
  },
  component: OtpPage,
})
