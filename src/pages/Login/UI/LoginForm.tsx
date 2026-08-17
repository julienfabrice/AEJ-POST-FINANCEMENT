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
import { Checkbox } from '@/components/ui/checkbox'
import { useLoginForm } from '../hooks/useLoginForm'

export function LoginForm() {
  const { form, onSubmit } = useLoginForm()

  return (
    <div className="flex items-center justify-center p-8 bg-card">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold">Connexion</h2>
          <p className="text-muted-foreground mt-2">Veuillez vous authentifier pour accéder à la plateforme.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identifiant</FormLabel>
                  <FormControl>
                    <Input placeholder="prenom.nom@aej.ci" {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between mt-2">
              <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      Rester connecté
                    </FormLabel>
                  </FormItem>
                )}
              />
              
              <a href="#" className="text-sm font-medium text-orange-600 hover:text-orange-700">
                Mot de passe oublié ?
              </a>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold bg-orange-600 hover:bg-orange-700 text-white">
              Se connecter
            </Button>
          </form>
        </Form>

        <p className="text-xs text-center text-muted-foreground mt-8">
          Prototype de démonstration · données fictives
        </p>
      </div>
    </div>
  )
}
