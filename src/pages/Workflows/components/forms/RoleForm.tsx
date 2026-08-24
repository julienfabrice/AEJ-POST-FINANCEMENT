import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRoleForm } from '../../hooks/forms/useRoleForm'
import type { WORKFLOW_ETAPE_ROLE_T } from '@/types'

interface RoleFormProps {
  etapeCode: string
  selectedRole?: WORKFLOW_ETAPE_ROLE_T | null
  onCancel: () => void
  onSuccess?: () => void
}

export function RoleForm({ etapeCode, selectedRole = null, onCancel, onSuccess }: RoleFormProps) {
  const { 
    form, 
    onSubmit, 
    isSubmitting, 
    isEditMode, 
    availableRoles, 
    isAvailableRolesLoading 
  } = useRoleForm(etapeCode, selectedRole, () => {
    onCancel()
    onSuccess?.()
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Modifier un acteur (Rôle)" : "Ajouter un acteur (Rôle)"}</DialogTitle>
        </DialogHeader>
        
        <FormField
          control={form.control}
          name="role_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rôle / Acteur</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={isAvailableRolesLoading ? "Chargement..." : "Sélectionnez un rôle"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role.code} value={role.code}>
                      {role.name || role.libelle || role.code}
                    </SelectItem>
                  ))}
                  {availableRoles.length === 0 && !isAvailableRolesLoading && (
                    <SelectItem value="" disabled>Aucun rôle disponible</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="action"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Action</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez une action" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="AJOUT_PLAN_AFFAIRES">Ajout Plan d'Affaires</SelectItem>
                  <SelectItem value="SOUMISSION">Soumission</SelectItem>
                  <SelectItem value="VALIDATION">Validation</SelectItem>
                  <SelectItem value="REJET">Rejet</SelectItem>
                  <SelectItem value="REVISION">Révision / Modification</SelectItem>
                  <SelectItem value="CONSULTATION">Consultation (Lecture seule)</SelectItem>
                  <SelectItem value="APPROBATION_FINALE">Approbation Finale</SelectItem>
                  <SelectItem value="DECISION">Décision</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter className="mt-6">
          <Button variant="outline" type="button" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting} className={isEditMode ? "bg-[#131C29] hover:bg-[#202d40] text-white" : "bg-[#E7722B] hover:bg-[#C85E18] text-white"}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Enregistrer" : "Ajouter"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
