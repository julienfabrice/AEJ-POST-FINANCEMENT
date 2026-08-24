import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useConfigurationForm } from './hooks/useConfigurationForm'

export function ParametresPage() {
  const { form, onSubmit, isPending, isLoading, isError, isDirty } = useConfigurationForm()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-extrabold text-[#131C29] mb-2">Paramètres système</h1>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <div>
        <h1 className="text-2xl font-extrabold text-[#131C29] mb-2">Paramètres système</h1>
        <p className="text-sm text-red-600">
          Impossible de charger la configuration. Veuillez réessayer plus tard.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#131C29] mb-1">Paramètres système</h1>
          <p className="text-sm text-slate-500">
            Configuration globale de la plateforme : identité, sécurité et notifications.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="identite" className="w-full">
            <div className="overflow-x-auto w-full no-scrollbar">
              <TabsList className="flex items-center gap-1 border-b border-slate-200 w-max min-w-full bg-transparent p-0 h-auto rounded-none justify-start">
                <TabsTrigger
                  value="identite"
                  className="!bg-transparent !shadow-none after:hidden px-4 py-2.5 text-[13.5px] font-semibold text-slate-500 border-t-0 border-l-0 border-r-0 border-b-[2.5px] border-transparent data-[state=active]:text-[#E7722B] data-[state=active]:!border-[#E7722B] hover:text-[#131C29] whitespace-nowrap -mb-[1px] transition-colors rounded-none"
                >
                  Identité
                </TabsTrigger>
                <TabsTrigger
                  value="devise"
                  className="!bg-transparent !shadow-none after:hidden px-4 py-2.5 text-[13.5px] font-semibold text-slate-500 border-t-0 border-l-0 border-r-0 border-b-[2.5px] border-transparent data-[state=active]:text-[#E7722B] data-[state=active]:!border-[#E7722B] hover:text-[#131C29] whitespace-nowrap -mb-[1px] transition-colors rounded-none"
                >
                  Devise
                </TabsTrigger>
                <TabsTrigger
                  value="securite"
                  className="!bg-transparent !shadow-none after:hidden px-4 py-2.5 text-[13.5px] font-semibold text-slate-500 border-t-0 border-l-0 border-r-0 border-b-[2.5px] border-transparent data-[state=active]:text-[#E7722B] data-[state=active]:!border-[#E7722B] hover:text-[#131C29] whitespace-nowrap -mb-[1px] transition-colors rounded-none"
                >
                  Sécurité
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="!bg-transparent !shadow-none after:hidden px-4 py-2.5 text-[13.5px] font-semibold text-slate-500 border-t-0 border-l-0 border-r-0 border-b-[2.5px] border-transparent data-[state=active]:text-[#E7722B] data-[state=active]:!border-[#E7722B] hover:text-[#131C29] whitespace-nowrap -mb-[1px] transition-colors rounded-none"
                >
                  Notifications
                </TabsTrigger>
              </TabsList>
            </div>

            {/* --- Identité (système + structure) --- */}
            <TabsContent value="identite" className="mt-6 outline-none space-y-6">
              <div>
                <h2 className="text-sm font-bold text-[#131C29] mb-3">Système</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="sigle_systeme" render={({ field }) => (
                    <FormItem><FormLabel>Sigle du système</FormLabel><FormControl><Input placeholder="Ex. AEJ-PF" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="intitule_systeme" render={({ field }) => (
                    <FormItem><FormLabel>Intitulé du système</FormLabel><FormControl><Input placeholder="Ex. Plateforme Post-Financement" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="logo_systeme" render={({ field }) => (
                    <FormItem><FormLabel>Logo du système (URL)</FormLabel><FormControl><Input placeholder="https://..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-sm font-bold text-[#131C29] mb-3">Structure</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="sigle_structure" render={({ field }) => (
                    <FormItem><FormLabel>Sigle de la structure</FormLabel><FormControl><Input placeholder="Ex. AEJ" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="intitule_structure" render={({ field }) => (
                    <FormItem><FormLabel>Intitulé de la structure</FormLabel><FormControl><Input placeholder="Ex. Agence Emploi Jeunes" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="logo_structure" render={({ field }) => (
                    <FormItem><FormLabel>Logo de la structure (URL)</FormLabel><FormControl><Input placeholder="https://..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email_structure" render={({ field }) => (
                    <FormItem><FormLabel>E-mail</FormLabel><FormControl><Input type="email" placeholder="contact@aej-ci.net" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="telephone_structure" render={({ field }) => (
                    <FormItem><FormLabel>Téléphone</FormLabel><FormControl><Input placeholder="+225 XX XX XX XX XX" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="whatsapp_structure" render={({ field }) => (
                    <FormItem><FormLabel>WhatsApp</FormLabel><FormControl><Input placeholder="+225 XX XX XX XX XX" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="adresse_sociale_structure" render={({ field }) => (
                    <FormItem className="sm:col-span-2"><FormLabel>Adresse sociale</FormLabel><FormControl><Textarea placeholder="Adresse complète du siège" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </div>
            </TabsContent>

            {/* --- Devise --- */}
            <TabsContent value="devise" className="mt-6 outline-none">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="sigle_monnaie_pays" render={({ field }) => (
                  <FormItem><FormLabel>Sigle monnaie du pays</FormLabel><FormControl><Input placeholder="Ex. XOF" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="sigle_devise_principale" render={({ field }) => (
                  <FormItem><FormLabel>Devise principale</FormLabel><FormControl><Input placeholder="Ex. USD" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="taux_devise_principale" render={({ field: { onChange, ...field } }) => (
                  <FormItem><FormLabel>Taux de change</FormLabel><FormControl><Input type="number" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormDescription>Taux appliqué de la devise principale vers la monnaie du pays.</FormDescription><FormMessage /></FormItem>
                )} />
              </div>
            </TabsContent>

            {/* --- Sécurité --- */}
            <TabsContent value="securite" className="mt-6 outline-none space-y-6">
              <FormField control={form.control} name="mise_en_maintenance" render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                  <div>
                    <FormLabel>Mode maintenance</FormLabel>
                    <FormDescription>Bloque l'accès à la plateforme pour les utilisateurs non-admin.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="delai_inactivite_minutes" render={({ field: { onChange, ...field } }) => (
                  <FormItem><FormLabel>Délai d'inactivité (minutes)</FormLabel><FormControl><Input type="number" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="nombre_session_possible" render={({ field: { onChange, ...field } }) => (
                  <FormItem><FormLabel>Sessions simultanées max.</FormLabel><FormControl><Input type="number" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="nombre_tentatives_connexion" render={({ field: { onChange, ...field } }) => (
                  <FormItem><FormLabel>Tentatives de connexion max.</FormLabel><FormControl><Input type="number" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="delai_code_otp_minutes" render={({ field: { onChange, ...field } }) => (
                  <FormItem><FormLabel>Validité code OTP (minutes)</FormLabel><FormControl><Input type="number" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="delai_changement_mdp_mois" render={({ field: { onChange, ...field } }) => (
                  <FormItem><FormLabel>Renouvellement mot de passe (mois)</FormLabel><FormControl><Input type="number" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="delai_suppression_secondes" render={({ field: { onChange, ...field } }) => (
                  <FormItem><FormLabel>Délai avant suppression (secondes)</FormLabel><FormControl><Input type="number" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </TabsContent>

            {/* --- Notifications --- */}
            <TabsContent value="notifications" className="mt-6 outline-none space-y-6">
              <div>
                <h2 className="text-sm font-bold text-[#131C29] mb-3">WhatsApp</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="code_instance_whatsapp" render={({ field }) => (
                    <FormItem><FormLabel>Code instance</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="token_instance_whatsapp" render={({ field }) => (
                    <FormItem><FormLabel>Token instance</FormLabel><FormControl><Input type="password" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-sm font-bold text-[#131C29] mb-3">E-mail (SMTP)</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="email_notifications" render={({ field }) => (
                    <FormItem><FormLabel>E-mail expéditeur</FormLabel><FormControl><Input type="email" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="mot_de_passe_email_notifications" render={({ field }) => (
                    <FormItem><FormLabel>Mot de passe</FormLabel><FormControl><Input type="password" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="smtp_email_notifications" render={({ field }) => (
                    <FormItem><FormLabel>Compte SMTP</FormLabel><FormControl><Input type="email" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="smtp_host_notifications" render={({ field }) => (
                    <FormItem><FormLabel>Hôte SMTP</FormLabel><FormControl><Input placeholder="smtp.example.com" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="smtp_port_notifications" render={({ field: { onChange, ...field } }) => (
                    <FormItem><FormLabel>Port SMTP</FormLabel><FormControl><Input type="number" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="smtp_encrypt_notifications" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chiffrement</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full"><SelectValue placeholder="Chiffrement" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="tls">TLS</SelectItem>
                          <SelectItem value="ssl">SSL</SelectItem>
                          <SelectItem value="none">Aucun</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-200">
            <Button
              type="button"
              variant="ghost"
              disabled={!isDirty || isPending}
              onClick={() => form.reset()}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-[#E7722B] hover:bg-[#C85E18] text-white"
              disabled={!isDirty || isPending}
            >
              {isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
