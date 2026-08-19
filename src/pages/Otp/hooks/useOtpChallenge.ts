import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useSendOtp, useVerifyOtp } from '@/hooks/auth.hooks'
import { ROUTES } from '@/constants/routes'
import { OTP_CONFIG, formatCountdown } from '@/constants/security'
import { useAuthFlowStore } from '@/store/useAuthFlowStore'
import type { OTP_METHOD_T } from '@/types/auth.types'
import { useCountdown } from './useCountdown'

/**
 * Défi OTP en deux temps sur un seul écran :
 *  1. l'utilisateur choisit un canal — AUCUNE requête n'est envoyée ;
 *  2. il valide, et c'est seulement là que part `POST /send-otp`.
 *
 * Séparer le choix de l'envoi évite d'expédier un code (email/SMS, donc coûteux
 * et limité côté serveur) à chaque clic d'hésitation.
 *
 * Deux comptes à rebours indépendants tournent ensuite :
 *  - `resend`  → délai avant de pouvoir redemander un code ;
 *  - `expiry`  → validité du code, miroir de la durée appliquée côté serveur.
 */
export function useOtpChallenge() {
  const navigate = useNavigate()
  const verify = useVerifyOtp()
  const send = useSendOtp()
  // `has_phone` vient de la réponse de login : sans numéro, pas de WhatsApp.
  const hasPhone = useAuthFlowStore((s) => s.pending?.hasPhone ?? false)

  const resend = useCountdown()
  const expiry = useCountdown()

  /** Canal sélectionné — pas encore forcément utilisé. */
  const [method, setMethod] = useState<OTP_METHOD_T>()
  /** Canal réellement utilisé par le dernier envoi réussi. */
  const [sentTo, setSentTo] = useState<OTP_METHOD_T>()
  const [code, setCode] = useState('')
  const [isExpired, setIsExpired] = useState(false)

  // Évite une double soumission : `InputOTP` peut rappeler `onChange` avec la
  // même valeur complète pendant que la mutation est encore en vol.
  const submittedRef = useRef('')

  const codeSent = !!sentTo

  // Fin de validité : on vide la saisie et on bascule l'écran en « expiré ».
  // Le code reste refusé par le serveur de toute façon — l'affichage ne fait
  // qu'éviter à l'utilisateur de saisir pour rien.
  useEffect(() => {
    if (!codeSent || isExpired || expiry.seconds > 0) return
    setIsExpired(true)
    setCode('')
    submittedRef.current = ''
  }, [codeSent, isExpired, expiry.seconds])

  /** Sélection seule — aucun appel réseau. */
  const onSelectMethod = (next: OTP_METHOD_T) => {
    if (next === method) return
    setMethod(next)
    // Changer de canal invalide l'envoi précédent : il faut re-valider.
    setSentTo(undefined)
    setIsExpired(false)
    setCode('')
    submittedRef.current = ''
    resend.stop()
    expiry.stop()
  }

  /** Validation du choix (ou renvoi) — c'est ici que le code part. */
  const onSendCode = useCallback(() => {
    if (!method || send.isPending) return
    // Un code expiré peut être renvoyé immédiatement, sans attendre le délai.
    if (resend.isRunning && !isExpired) return

    send.mutate(method, {
      onSuccess: () => {
        setSentTo(method)
        setIsExpired(false)
        setCode('')
        submittedRef.current = ''
        resend.start(OTP_CONFIG.resendCooldownSeconds)
        expiry.start(OTP_CONFIG.ttlSeconds)
        toast.success(method === 'MAIL' ? 'Code envoyé par email' : 'Code envoyé par WhatsApp')
      },
      onError: () => toast.error("Impossible d'envoyer le code. Réessayez."),
    })
  }, [method, send, resend, expiry, isExpired])

  const submit = useCallback(
    (value: string) => {
      // `sentTo` est le canal effectivement utilisé — pas `method`, qui peut
      // avoir été changé sans nouvel envoi.
      if (!sentTo || submittedRef.current === value) return
      submittedRef.current = value

      verify.mutate(
        { code: value, mode: sentTo },
        {
          onSuccess: () => {
            void navigate({ to: ROUTES.DASHBOARD, replace: true })
          },
          onError: () => {
            toast.error('Code invalide ou expiré')
            setCode('')
            submittedRef.current = ''
          },
        },
      )
    },
    [navigate, verify, sentTo],
  )

  // Auto-soumission dès le dernier chiffre — sauf code expiré.
  const onChange = (value: string) => {
    if (isExpired) return
    setCode(value)
    if (value.length === OTP_CONFIG.length) submit(value)
  }

  return {
    method,
    onSelectMethod,
    onSendCode,
    hasPhone,
    /** Un code a bien été expédié : la saisie s'ouvre. */
    codeSent,
    sentTo,
    code,
    onChange,

    /** Validité restante, prête à afficher (« 4:32 »). */
    expiresInLabel: formatCountdown(expiry.seconds),
    isExpired,
    /** Délai restant avant de pouvoir redemander un code, en secondes. */
    resendIn: resend.seconds,
    canResend: (!resend.isRunning || isExpired) && !send.isPending,

    isSending: send.isPending,
    isVerifying: verify.isPending,
    otpLength: OTP_CONFIG.length,
    /** Durée de validité annoncée avant le premier envoi (« 5:00 »). */
    validityLabel: formatCountdown(OTP_CONFIG.ttlSeconds),
  }
}
