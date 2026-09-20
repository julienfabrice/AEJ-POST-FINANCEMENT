import { configurationServices } from '@/services/configurations.services'
import { OTP_CONFIG } from '@/constants/security'

/**
 * Politique de sécurité issue de `configurations`, prête à l'emploi.
 *
 * Rôle de ce hook : convertir les unités de la base (minutes, mois) en unités
 * d'interface (secondes), et fournir un REPLI tant que la configuration n'est
 * pas chargée — ou si le champ est absent.

 */
export function useSecurityConfig() {
  const { data: config, isLoading } = configurationServices.useGet()

  const otpMinutes = config?.delai_code_otp_minutes

  return {
    /**
     * Validité du code OTP, en secondes.
     */
    otpTtlSeconds:
      otpMinutes && otpMinutes > 0 ? otpMinutes * 60 : OTP_CONFIG.ttlSeconds,

    /** Absent de la table `configurations` : reste une constante applicative. */
    otpResendCooldownSeconds: OTP_CONFIG.resendCooldownSeconds,

    /** Nombre de tentatives de connexion autorisées — `undefined` si inconnu. */
    loginMaxAttempts: config?.nombre_tentatives_connexion,

    /** Âge maximal du mot de passe, en mois — `undefined` si inconnu. */
    passwordMaxAgeMonths: config?.delai_changement_mdp_mois,

    /** Délai d'inactivité, en minutes. `0` = illimité. */
    inactivityMinutes: config?.delai_inactivite_minutes,

    isLoading,
  }
}
