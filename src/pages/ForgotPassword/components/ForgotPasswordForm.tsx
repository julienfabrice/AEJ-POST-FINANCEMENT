import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RESET_LINK_CONFIG } from '@/constants/security'
import type { PASSWORD_LINK_MODE_T } from '@/types/auth.types'
import { FORGOT_COPY } from '../copy'
import { useForgotPasswordForm } from '../hooks/useForgotPasswordForm'

export function ForgotPasswordForm({ mode }: { mode: PASSWORD_LINK_MODE_T }) {
  const { form, onSubmit, isSubmitting, errorMessage, sentTo, onResend, resendIn, canResend } =
    useForgotPasswordForm(mode)
  const copy = FORGOT_COPY[mode]

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        {errorMessage && (
          <div
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
          >
            {errorMessage}
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse e-mail</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="prenom.nom@aej.ci"
                  autoComplete="email"
                  {...field}
                  className="h-12"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full cursor-pointer bg-[#E7722B] text-base font-semibold text-white hover:bg-[#C85E18]"
        >
          {isSubmitting ? 'Envoi…' : copy.submitLabel}
        </Button>

        {/* Une fois le lien parti : rappel anti-spam + renvoi, sans quitter l'écran. */}
        {sentTo && (
          <p className="text-sm leading-relaxed text-muted-foreground" role="status" aria-live="polite">
            Lien envoyé à <span className="font-medium text-foreground">{sentTo}</span>, valable{' '}
            {RESET_LINK_CONFIG.ttlMinutes} minutes.
            <br />
            {copy.resend}{' '}
            <button
              type="button"
              onClick={onResend}
              disabled={!canResend}
              className="cursor-pointer font-medium text-[#E7722B] underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-60"
            >
              {canResend ? 'renvoyez-le' : `renvoyez-le (${resendIn} s)`}
            </button>
          </p>
        )}
      </form>
    </Form>
  )
}
