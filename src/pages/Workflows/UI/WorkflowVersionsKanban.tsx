import { useState, useEffect } from 'react'
import { Plus, MoreVertical, Info, Pencil, CheckCircle, Calendar, Tag, FileText, Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { WorkflowTimeline } from './WorkflowTimeline'
import type { WORKFLOW_VERSION_T } from '@/types'
import { workflowServices } from '@/services/workflow'
import { 
  createVersionSchema, 
  updateVersionSchema, 
  etapeSchema,
  type CreateVersionFormValues,
  type UpdateVersionFormValues,
  type EtapeFormValues
} from '@/schema/workflow'

interface WorkflowVersionsKanbanProps {
  versions: WORKFLOW_VERSION_T[]
  activeWorkflowCode?: string
}

export function WorkflowVersionsKanban({ versions, activeWorkflowCode }: WorkflowVersionsKanbanProps) {
  const [selectedVersion, setSelectedVersion] = useState<WORKFLOW_VERSION_T | null>(null)
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUpdateVersionModalOpen, setIsUpdateVersionModalOpen] = useState(false)
  const [isEtapeModalOpen, setIsEtapeModalOpen] = useState(false)
  
  const [editingVersion, setEditingVersion] = useState<WORKFLOW_VERSION_T | null>(null)
  const [versionToDelete, setVersionToDelete] = useState<WORKFLOW_VERSION_T | null>(null)
  const [targetVersionCode, setTargetVersionCode] = useState('')
  
  const createMutation = workflowServices.useCreateVersion()
  const updateVersionMutation = workflowServices.useUpdateVersion()
  const createEtapeMutation = workflowServices.useCreateEtape()
  const deleteVersionMutation = workflowServices.useDeleteVersion()

  // Forms setup
  const createForm = useForm<CreateVersionFormValues>({
    resolver: zodResolver(createVersionSchema),
    defaultValues: { name: '', version: '' }
  })

  const updateForm = useForm<UpdateVersionFormValues>({
    resolver: zodResolver(updateVersionSchema),
    defaultValues: { name: '', version: '', description: '' }
  })

  const etapeForm = useForm<EtapeFormValues>({
    resolver: zodResolver(etapeSchema),
    defaultValues: { code: '', name: '', order: 1, description: '' }
  })

  // Sync update form with selected version
  useEffect(() => {
    if (editingVersion) {
      updateForm.reset({
        name: editingVersion.name,
        version: editingVersion.version,
        description: editingVersion.description || ''
      })
    }
  }, [editingVersion, updateForm])

  const onSubmitCreate = (data: CreateVersionFormValues) => {
    if (!activeWorkflowCode) return
    createMutation.mutate(
      {
        workflow_code: activeWorkflowCode,
        name: data.name,
        version: data.version
      },
      {
        onSuccess: () => {
          setIsCreateModalOpen(false)
          createForm.reset()
        }
      }
    )
  }

  const onSubmitUpdate = (data: UpdateVersionFormValues) => {
    if (!editingVersion) return
    updateVersionMutation.mutate(
      {
        id: editingVersion.id,
        name: data.name,
        version: data.version,
        description: data.description || undefined
      },
      {
        onSuccess: () => {
          setIsUpdateVersionModalOpen(false)
          setEditingVersion(null)
        }
      }
    )
  }

  const onSubmitEtape = (data: EtapeFormValues) => {
    if (!targetVersionCode) return
    createEtapeMutation.mutate(
      {
        workflow_version: targetVersionCode,
        code: data.code,
        name: data.name,
        order: data.order
      },
      {
        onSuccess: () => {
          setIsEtapeModalOpen(false)
          etapeForm.reset()
        }
      }
    )
  }
  
  const handleDeleteVersion = () => {
    if (!versionToDelete) return
    deleteVersionMutation.mutate(versionToDelete.id, {
      onSuccess: () => {
        setVersionToDelete(null)
      }
    })
  }

  const renderColumn = (version: WORKFLOW_VERSION_T) => {
    const statusText = version.is_active ? 'Active' : 'Archivée'
    const statusClass = version.is_active 
      ? 'bg-orange-100 text-orange-700' 
      : 'bg-slate-200 text-slate-600'

    return (
      <Card key={version.id} className="min-w-[550px] w-[550px] bg-slate-50 border-slate-200 rounded-xl flex flex-col h-[calc(100vh-280px)] p-0 gap-0 shadow-none overflow-hidden">
        {/* Header de la colonne */}
        <div className="p-4 border-b border-slate-200 bg-white flex flex-row items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800 text-lg">
              {version.name}
            </h3>
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${statusClass}`}>
              {statusText}
            </span>
            {version.is_default && (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">
                Défaut
              </span>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => setSelectedVersion(version)}
              >
                <Info className="mr-2 h-4 w-4" />
                <span>Infos de la version</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => {
                  setEditingVersion(version)
                  setIsUpdateVersionModalOpen(true)
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                <span>Modifier</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="bg-[#E7722B] text-white focus:bg-[#C85E18] focus:text-white cursor-pointer my-1"
                onClick={() => {
                  setTargetVersionCode(version.code)
                  etapeForm.reset({
                    code: '',
                    name: '',
                    description: '',
                    order: (version.etapes?.length || 0) + 1
                  })
                  setIsEtapeModalOpen(true)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                <span>Ajouter une étape</span>
              </DropdownMenuItem>
              {!version.is_active && (
                <DropdownMenuItem className="text-orange-600 focus:text-orange-700 focus:bg-orange-50 cursor-pointer">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span>Activer cette version</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                onClick={() => setVersionToDelete(version)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Supprimer</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Contenu de la colonne (Workflow Timeline) */}
        <CardContent className="p-4 flex-1 overflow-y-auto custom-scrollbar">
          <WorkflowTimeline etapes={version.etapes || []} />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="flex gap-6 overflow-x-auto pb-4 h-full no-scrollbar">
        {/* Colonnes des versions */}
        {versions.map(renderColumn)}

        {/* Colonne Ajouter une version */}
        <Card 
          onClick={() => {
            createForm.reset()
            setIsCreateModalOpen(true)
          }}
          className="min-w-[400px] w-[400px] border-2 border-dashed border-slate-300 bg-transparent shadow-none rounded-xl flex flex-col items-center justify-center text-slate-500 hover:border-[#E7722B] hover:text-[#E7722B] hover:bg-orange-50/30 transition-all cursor-pointer h-[calc(100vh-280px)] p-6"
        >
          <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mb-4 transition-colors">
            <Plus className="h-7 w-7" />
          </div>
          <span className="font-semibold text-xl">Ajouter une version</span>
          <span className="text-sm text-slate-400 mt-2 text-center">
            Créer un nouveau brouillon de workflow
          </span>
        </Card>
      </div>

      {/* Modal d'ajout d'une version */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(onSubmitCreate)}>
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle version</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-6">
                <FormField
                  control={createForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de la version</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: AGR classique v2026" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de version (ex: 2026)</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: 2026" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={createMutation.isPending} className="bg-[#E7722B] hover:bg-[#C85E18] text-white">
                  {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Créer
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Modal de modification d'une version */}
      <Dialog open={isUpdateVersionModalOpen} onOpenChange={setIsUpdateVersionModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...updateForm}>
            <form onSubmit={updateForm.handleSubmit(onSubmitUpdate)}>
              <DialogHeader>
                <DialogTitle>Modifier la version</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-6">
                <FormField
                  control={updateForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de la version</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de version</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsUpdateVersionModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={updateVersionMutation.isPending} className="bg-[#E7722B] hover:bg-[#C85E18] text-white">
                  {updateVersionMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enregistrer
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Modal d'ajout d'une étape */}
      <Dialog open={isEtapeModalOpen} onOpenChange={setIsEtapeModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...etapeForm}>
            <form onSubmit={etapeForm.handleSubmit(onSubmitEtape)}>
              <DialogHeader>
                <DialogTitle>Ajouter une étape au workflow</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-6">
                <FormField
                  control={etapeForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code de l'étape</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: AGRC_PRCO_1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={etapeForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'étape</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: RÉCUPÉRATION DES PROJETS..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={etapeForm.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ordre d'exécution</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          {...field} 
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEtapeModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={createEtapeMutation.isPending} className="bg-[#E7722B] hover:bg-[#C85E18] text-white">
                  {createEtapeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Ajouter
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Sheet / Drawer d'infos de la version */}
      <Sheet open={selectedVersion !== null} onOpenChange={(open) => !open && setSelectedVersion(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto custom-scrollbar">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-xl">Informations de la version</SheetTitle>
          </SheetHeader>
          
          {selectedVersion && (
            <div className="space-y-6">
              
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h3 className="font-bold text-lg text-slate-800 mb-1">{selectedVersion.name}</h3>
                <div className="flex gap-2 mb-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${selectedVersion.is_active ? 'bg-orange-100 text-orange-700' : 'bg-slate-200 text-slate-600'}`}>
                    {selectedVersion.is_active ? 'Active' : 'Archivée'}
                  </span>
                  {selectedVersion.is_default && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">
                      Version par défaut
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedVersion.description || 'Aucune description fournie.'}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-md text-slate-500">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Code de la version</p>
                    <p className="text-sm font-medium text-slate-900 mt-0.5">{selectedVersion.code}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-md text-slate-500">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Numéro de version</p>
                    <p className="text-sm font-medium text-slate-900 mt-0.5">{selectedVersion.version}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-md text-slate-500">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Créé le</p>
                    <p className="text-sm font-medium text-slate-900 mt-0.5">
                      {new Date(selectedVersion.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-md text-slate-500">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Dernière mise à jour</p>
                    <p className="text-sm font-medium text-slate-900 mt-0.5">
                      {new Date(selectedVersion.updated_at).toLocaleDateString('fr-FR', {
                        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-md text-slate-500">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Nombre d'étapes</p>
                    <p className="text-sm font-medium text-slate-900 mt-0.5">
                      {selectedVersion.etapes ? selectedVersion.etapes.length : 0} étape(s)
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Modal de suppression de version */}
      <DeleteConfirmModal 
        open={!!versionToDelete} 
        onOpenChange={(open) => !open && setVersionToDelete(null)}
        itemLabel={versionToDelete?.name}
        description={`Cette action supprimera définitivement la version "${versionToDelete?.name}" et toutes ses étapes. Vous aurez 5 secondes pour annuler cette action avant qu'elle ne soit définitive.`}
        onConfirm={handleDeleteVersion}
      />
    </>
  )
}
