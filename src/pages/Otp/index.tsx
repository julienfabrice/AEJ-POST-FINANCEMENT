import { ArrowLeftIcon, ShieldCheck, TimerReset } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { cn } from '@/lib/utils'
import { MethodPicker } from './UI/MethodPicker'
import { useOtpChallenge } from './hooks/useOtpChallenge'
import { LoginBrand } from '../Login/UI/LoginBrand'
import { Link } from '@tanstack/react-router'

export function OtpPage() {
  const {
    method,
    onSelectMethod,
    onSendCode,
    codeSent,
    sentTo,
    code,
    onChange,
    expiresInLabel,
    isExpired,
    resendIn,
    canResend,
    isSending,
    isVerifying,
    otpLength,
    validityLabel,
  } = useOtpChallenge()

  const channelLabel = sentTo === 'email' ? 'email' : 'SMS'

  return (
    <div className="fixed inset-0 grid grid-cols-1 md:grid-cols-2 z-50 bg-background text-foreground">
      <LoginBrand />
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#E7722B]/10">
              <ShieldCheck className="size-6 text-[#E7722B]" />
            </div>
            <h1 className="text-2xl mb-2 font-extrabold">Vérification en deux étapes</h1>
            <h3 className="text-xl font-semibold">
              Aidez nous à confirmer qu'il s'agit bien de vous
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {!codeSent &&
                `Choisissez comment recevoir votre code de vérification. Une fois envoyé, il restera valable ${validityLabel}.`}
              {codeSent &&
                !isExpired &&
                `Saisissez le code à ${otpLength} chiffres reçu par ${channelLabel}.`}
              {codeSent &&
                isExpired &&
                `Le code reçu par ${channelLabel} n'est plus valable. Demandez-en un nouveau.`}
            </p>
          </div>

          <MethodPicker value={method} onSelect={onSelectMethod} disabled={isSending || isVerifying} />

          {/* Étape 1 — le code ne part qu'à la validation du choix. */}
          {!codeSent && (
            <Button
              type="button"
              onClick={onSendCode}
              disabled={!method || isSending}
              className="mt-6 h-12 w-full cursor-pointer bg-[#E7722B] text-base font-semibold text-white hover:bg-[#C85E18]"
            >
              {isSending ? 'Envoi du code…' : 'Envoyer le code'}
            </Button>
          )}



          {/* Étape 2 — saisie, disponible une fois le code expédié. */}
          {codeSent && (
            <>
              <div className="mt-8 flex justify-center">
                <InputOTP
                  maxLength={otpLength}
                  value={code}
                  onChange={onChange}
                  disabled={isSending || isVerifying || isExpired}
                  autoFocus
                >
                  <InputOTPGroup>
                    {Array.from({ length: otpLength }, (_, i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {/* Validité du code — miroir de la durée appliquée côté serveur. */}
              <div
                className={cn(
                  'mt-5 flex items-center justify-center gap-1.5 text-sm font-medium',
                  isExpired ? 'text-destructive' : 'text-muted-foreground',
                )}
                role="status"
                aria-live="polite"
              >
                <TimerReset className="size-4" />
                {isVerifying
                  ? 'Vérification…'
                  : isExpired
                    ? 'Code expiré'
                    : `Ce code expire dans ${expiresInLabel}`}
              </div>

              <div className="mt-4 flex flex-col items-center gap-1">
                <Button
                  variant="ghost"
                  onClick={onSendCode}
                  disabled={!canResend || isVerifying}
                  className="cursor-pointer text-sm font-medium text-[#E7722B] hover:text-[#C85E18]"
                >
                  {canResend ? 'Renvoyer le code' : `Renvoyer le code (${resendIn} s)`}
                </Button>
                <span className="text-xs text-muted-foreground">
                  {sentTo === 'email'
                    ? 'Vérifiez vos courriers indésirables si le code tarde à arriver.'
                    : 'Le SMS peut prendre quelques instants à arriver.'}
                </span>
              </div>
            </>
          )}

            <Link to='/login' className='flex items-center justify-center mt-4 gap-2 text-xs group cursor-pointer hover:text-underline' >
            <ArrowLeftIcon  className='text-[#E7722B] size-5 group-hover:-translate-x-2 duration-600'/>
            Retour à la connexion
            </Link>
        </div>

      
      </div>
    </div>
  )
}
