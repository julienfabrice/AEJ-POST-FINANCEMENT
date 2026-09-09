import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { ACTIVITY_EVENT } from '@/constants/axiosInstance'
import { AUTH_DISABLED } from '@/constants/devFlags'
import { ROUTES } from '@/constants/routes'
import { useLogout } from '@/hooks/auth.hooks'
import { configurationServices } from '@/services/configurations.services'
import { useAuthStore } from '@/store/useAuthStore'
import { SessionContext } from '@/context/session.context'
import { SessionWarningDialog } from './SessionWarningDialog'

/** Avertissement à 25 % du délai restant, plafonné à 10 minutes. */
const WARNING_RATIO = 0.25
const WARNING_CAP_SECONDS = 10 * 60

/**
 * Expiration de session pour INACTIVITÉ, pilotée par
 * `configurations.delai_inactivite_minutes`.
 *
 * Quatre règles :
 *  1. « activité » = toute réponse API réussie. 
 *  2. la configuration est l'unique source du délai ;
 *  3. Rester connecté recharge le compte
 *     à rebours ;
 *  4. `0` signifie ILLIMITÉ, et le minuteur ne tourne que si l'on est connecté.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { data: config } = configurationServices.useGet()
  const { mutate: logout } = useLogout()

  const [remainingSeconds, setRemaining] = useState(0)
  const [warningVisible, setWarningVisible] = useState(false)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const durationRef = useRef(0)
  const warnAtRef = useRef(0)
  // Empêche une double déconnexion : le passage à 0 ne doit agir qu'une fois.
  const loggedOutRef = useRef(false)

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
  }, [])

  /** Recharge le compte à rebours — activité détectée ou « Rester connecté ». */
  const extend = useCallback(() => {
    if (durationRef.current > 0) setRemaining(durationRef.current)
  }, [])

  const endSession = useCallback(
    (message: string) => {
      if (loggedOutRef.current) return
      loggedOutRef.current = true
      stop()
      setWarningVisible(false)
      logout()
      void navigate({ to: ROUTES.LOGIN, replace: true })
      toast.info(message)
    },
    [logout, navigate, stop],
  )

  // (a) Configuration → minuteur.
  useEffect(() => {

    if (AUTH_DISABLED || !isAuthenticated || !config) {
      stop()
      return
    }

    const duration = (config.delai_inactivite_minutes ?? 0) * 60
    durationRef.current = duration
    warnAtRef.current = Math.min(Math.floor(duration * WARNING_RATIO), WARNING_CAP_SECONDS)
    loggedOutRef.current = false

    // 0 = illimité : on ne démarre rien.
    if (duration === 0) {
      stop()
      setRemaining(0)
      return
    }

    setRemaining(duration)
    stop()
    intervalRef.current = setInterval(() => {
      // L'updater reste PUR : il décrémente, rien d'autre
    
      setRemaining((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)

    return stop
  }, [config, isAuthenticated, stop])

  // (b) Signal d'activité émis par la couche HTTP → on recharge.
  useEffect(() => {
    window.addEventListener(ACTIVITY_EVENT, extend)
    return () => window.removeEventListener(ACTIVITY_EVENT, extend)
  }, [extend])

  // (c) Seuil d'avertissement — dérivé, jamais posé depuis un updater.
  useEffect(() => {
    if (durationRef.current === 0) return
    setWarningVisible(remainingSeconds > 0 && remainingSeconds <= warnAtRef.current)
  }, [remainingSeconds])

  // (d) Expiration.
  useEffect(() => {
    if (remainingSeconds === 0 && durationRef.current > 0 && isAuthenticated) {
      endSession('Session expirée pour inactivité. Veuillez vous reconnecter.')
    }
  }, [remainingSeconds, isAuthenticated, endSession])

  return (
    <SessionContext.Provider
      value={{ remainingSeconds, extend, isTracking: durationRef.current > 0 }}
    >
      {children}

      <SessionWarningDialog
        open={warningVisible && Boolean(isAuthenticated)}
        remainingSeconds={remainingSeconds}
        onExtend={extend}
        onLogout={() => endSession('Vous avez été déconnecté.')}
      />
    </SessionContext.Provider>
  )
}
