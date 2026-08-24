import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { configurationServices } from '@/services/configurations.services'
import {
  configurationSchema,
  type ConfigurationFormValues,
} from '@/schema/configurations/configurationSchema'

const DEFAULT_VALUES: ConfigurationFormValues = {
  logo_systeme: '',
  sigle_systeme: '',
  intitule_systeme: '',
  logo_structure: '',
  sigle_structure: '',
  intitule_structure: '',
  adresse_sociale_structure: '',
  email_structure: '',
  whatsapp_structure: '',
  telephone_structure: '',
  sigle_monnaie_pays: '',
  sigle_devise_principale: '',
  taux_devise_principale: 0,
  mise_en_maintenance: false,
  delai_inactivite_minutes: 30,
  nombre_session_possible: 1,
  nombre_tentatives_connexion: 5,
  delai_code_otp_minutes: 5,
  delai_changement_mdp_mois: 6,
  delai_suppression_secondes: 30,
  code_instance_whatsapp: '',
  token_instance_whatsapp: '',
  email_notifications: '',
  mot_de_passe_email_notifications: '',
  smtp_email_notifications: '',
  smtp_host_notifications: '',
  smtp_port_notifications: 587,
  smtp_encrypt_notifications: 'tls',
}

export function useConfigurationForm() {
  const { data: configuration, isLoading, isError } = configurationServices.useGet()
  const { mutate: updateMutation, isPending } = configurationServices.useUpdate()

  const form = useForm<ConfigurationFormValues>({
    resolver: zodResolver(configurationSchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (configuration) {
      form.reset({
        logo_systeme: configuration.logo_systeme ?? '',
        sigle_systeme: configuration.sigle_systeme,
        intitule_systeme: configuration.intitule_systeme,
        logo_structure: configuration.logo_structure ?? '',
        sigle_structure: configuration.sigle_structure,
        intitule_structure: configuration.intitule_structure,
        adresse_sociale_structure: configuration.adresse_sociale_structure ?? '',
        email_structure: configuration.email_structure,
        whatsapp_structure: configuration.whatsapp_structure,
        telephone_structure: configuration.telephone_structure,
        sigle_monnaie_pays: configuration.sigle_monnaie_pays,
        sigle_devise_principale: configuration.sigle_devise_principale,
        taux_devise_principale: configuration.taux_devise_principale,
        mise_en_maintenance: configuration.mise_en_maintenance,
        delai_inactivite_minutes: configuration.delai_inactivite_minutes,
        nombre_session_possible: configuration.nombre_session_possible,
        nombre_tentatives_connexion: configuration.nombre_tentatives_connexion,
        delai_code_otp_minutes: configuration.delai_code_otp_minutes,
        delai_changement_mdp_mois: configuration.delai_changement_mdp_mois,
        delai_suppression_secondes: configuration.delai_suppression_secondes,
        code_instance_whatsapp: configuration.code_instance_whatsapp ?? '',
        token_instance_whatsapp: configuration.token_instance_whatsapp ?? '',
        email_notifications: configuration.email_notifications,
        mot_de_passe_email_notifications: configuration.mot_de_passe_email_notifications,
        smtp_email_notifications: configuration.smtp_email_notifications,
        smtp_host_notifications: configuration.smtp_host_notifications,
        smtp_port_notifications: configuration.smtp_port_notifications,
        smtp_encrypt_notifications: configuration.smtp_encrypt_notifications,
      })
    }
  }, [configuration, form])

  const onSubmit = (values: ConfigurationFormValues) => {
    if (!configuration) return
    updateMutation({ id: configuration.id, data: values })
  }

  return {
    form,
    onSubmit,
    isPending,
    isLoading,
    isError,
    isDirty: form.formState.isDirty,
  }
}
