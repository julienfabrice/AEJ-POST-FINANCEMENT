import { createFileRoute, redirect } from '@tanstack/react-router'
import { OtpPage } from '@/pages/Otp'
import { ROUTES } from '@/constants/routes'
import { useAuthFlowStore } from '@/store/useAuthFlowStore'

export const Route = createFileRoute('/2fa')({

  beforeLoad: () => {
    if (!useAuthFlowStore.getState().pending) {
      throw redirect({ to: ROUTES.LOGIN, replace: true })
    }
  },
  component: OtpPage,
})
