import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Check } from 'lucide-react'
import { useValiderAction } from '../hooks/actions/useValiderAction'
import { DeliverableUploadSection } from './DeliverableUploadSection'

export function ValiderModal() {
  const {
    projet,
    isOpen,
    handleClose,
    onSubmit,
    form,
    isSubmitting,
    // Livrable existant (lecture)
    planAffairesDeliverable,
    isLoadingExisting,
    // Upload de livrables
    etapeDeliverables,
    isLoadingConfig,
    sources,
    setFile,
    setExistingDocument,
  } = useValiderAction()

  if (!projet) return null

  const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') ?? ''

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Validation — {projet.code}</DialogTitle>
          <div className="text-sm text-slate-500 mt-1 space-y-1">
            <p>
              {projet.intitule} — {projet.promoteur?.nom} {projet.promoteur?.prenom}
              {projet.agence?.nom && ` · ${projet.agence.nom}`}
            </p>
            {/* Plan d'affaires déjà joint (lecture seule) */}
            {planAffairesDeliverable ? (
              <p>
                Plan d'affaires joint :{' '}
                <a
                  href={`${baseUrl}${planAffairesDeliverable.file_path.startsWith('/') ? '' : '/'}${planAffairesDeliverable.file_path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-[#E7722B] hover:underline"
                >
                  {planAffairesDeliverable.file_name}
                </a>
              </p>
            ) : isLoadingExisting ? (
              <p className="text-slate-400">Recherche du plan d'affaires…</p>
            ) : (
              <p>Plan d'affaires joint : <b className="text-slate-400">—</b></p>
            )}
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4 pt-2">
            {/* Livrables à uploader pour cette étape */}
            <DeliverableUploadSection
              etapeDeliverables={etapeDeliverables}
              isLoadingConfig={isLoadingConfig}
              sources={sources}
              setFile={setFile}
              setExistingDocument={setExistingDocument}
              microProjetId={projet.id}
            />

            <FormField
              control={form.control}
              name="observation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observation (facultatif)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Remarques éventuelles…"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Check className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Validation en cours…' : 'Valider et transmettre'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
