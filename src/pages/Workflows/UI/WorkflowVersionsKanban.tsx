import { useState } from 'react'
import { Plus, MoreVertical, Info, Pencil, CheckCircle, Calendar, Tag, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { Label } from "@/components/ui/label"
import { WorkflowTimeline } from './WorkflowTimeline'
import type { WORKFLOW_VERSION_T } from '@/types'
import { workflowServices } from '@/services/workflow.services'

interface WorkflowVersionsKanbanProps {
  versions: WORKFLOW_VERSION_T[]
  activeWorkflowCode?: string
}

export function WorkflowVersionsKanban({ versions, activeWorkflowCode }: WorkflowVersionsKanbanProps) {
  const [selectedVersion, setSelectedVersion] = useState<WORKFLOW_VERSION_T | null>(null)
  
  // Create Version State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newVersionName, setNewVersionName] = useState('')
  const [newVersionCode, setNewVersionCode] = useState('')
  
  // Create Etape State
  const [isEtapeModalOpen, setIsEtapeModalOpen] = useState(false)
  const [targetVersionCode, setTargetVersionCode] = useState('')
  const [newEtapeName, setNewEtapeName] = useState('')
  const [newEtapeCode, setNewEtapeCode] = useState('')
  const [newEtapeOrder, setNewEtapeOrder] = useState<number>(1)
  
  const createMutation = workflowServices.useCreateVersion()
  const createEtapeMutation = workflowServices.useCreateEtape()

  const handleCreateVersion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeWorkflowCode || !newVersionName || !newVersionCode) return

    createMutation.mutate(
      {
        workflow_code: activeWorkflowCode,
        name: newVersionName,
        version: newVersionCode
      },
      {
        onSuccess: () => {
          setIsCreateModalOpen(false)
          setNewVersionName('')
          setNewVersionCode('')
        }
      }
    )
  }

  const handleCreateEtape = (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetVersionCode || !newEtapeName || !newEtapeCode || !newEtapeOrder) return

    createEtapeMutation.mutate(
      {
        workflow_version: targetVersionCode,
        code: newEtapeCode,
        name: newEtapeName,
        order: Number(newEtapeOrder)
      },
      {
        onSuccess: () => {
          setIsEtapeModalOpen(false)
          setNewEtapeName('')
          setNewEtapeCode('')
          setNewEtapeOrder(1)
        }
      }
    )
  }
  
  const renderColumn = (version: WORKFLOW_VERSION_T) => {
    const statusText = version.is_active ? 'Active' : 'Archivée'
    const statusClass = version.is_active 
      ? 'bg-orange-100 text-orange-700' 
      : 'bg-slate-200 text-slate-600'

    return (
      <div key={version.id} className="min-w-[550px] w-[550px] bg-slate-50 border border-slate-200 rounded-xl flex flex-col h-[calc(100vh-280px)]">
        {/* Header de la colonne */}
        <div className="p-4 border-b border-slate-200 bg-white rounded-t-xl flex items-center justify-between sticky top-0 z-10 shadow-sm">
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
              <DropdownMenuItem className="cursor-pointer">
                <Pencil className="mr-2 h-4 w-4" />
                <span>Modifier</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="bg-[#E7722B] text-white focus:bg-[#C85E18] focus:text-white cursor-pointer my-1"
                onClick={() => {
                  setTargetVersionCode(version.code)
                  setNewEtapeOrder((version.etapes?.length || 0) + 1)
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Contenu de la colonne (Workflow Timeline) */}
        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
          <WorkflowTimeline etapes={version.etapes || []} />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex gap-6 overflow-x-auto pb-4 h-full no-scrollbar">
        {/* Colonnes des versions */}
        {versions.map(renderColumn)}

        {/* Colonne Ajouter une version */}
        <div 
          onClick={() => setIsCreateModalOpen(true)}
          className="min-w-[400px] w-[400px] border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:border-[#E7722B] hover:text-[#E7722B] hover:bg-orange-50/30 transition-all cursor-pointer h-[calc(100vh-280px)]"
        >
          <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mb-4 transition-colors">
            <Plus className="h-7 w-7" />
          </div>
          <span className="font-semibold text-xl">Ajouter une version</span>
          <span className="text-sm text-slate-400 mt-2 text-center px-6">
            Créer un nouveau brouillon de workflow
          </span>
        </div>
      </div>

      {/* Modal d'ajout d'une version */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleCreateVersion}>
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle version</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de la version</Label>
                <Input 
                  id="name" 
                  placeholder="ex: AGR classique v2026" 
                  value={newVersionName}
                  onChange={(e) => setNewVersionName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="version">Numéro de version (ex: 2026)</Label>
                <Input 
                  id="version" 
                  placeholder="ex: 2026" 
                  value={newVersionCode}
                  onChange={(e) => setNewVersionCode(e.target.value)}
                  required
                />
              </div>
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
        </DialogContent>
      </Dialog>

      {/* Modal d'ajout d'une étape */}
      <Dialog open={isEtapeModalOpen} onOpenChange={setIsEtapeModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleCreateEtape}>
            <DialogHeader>
              <DialogTitle>Ajouter une étape au workflow</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-6">
              <div className="space-y-2">
                <Label htmlFor="etapeCode">Code de l'étape</Label>
                <Input 
                  id="etapeCode" 
                  placeholder="ex: AGRC_PRCO_1" 
                  value={newEtapeCode}
                  onChange={(e) => setNewEtapeCode(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="etapeName">Nom de l'étape</Label>
                <Input 
                  id="etapeName" 
                  placeholder="ex: RÉCUPÉRATION DES PROJETS..." 
                  value={newEtapeName}
                  onChange={(e) => setNewEtapeName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="etapeOrder">Ordre d'exécution</Label>
                <Input 
                  id="etapeOrder" 
                  type="number"
                  min="1"
                  value={newEtapeOrder}
                  onChange={(e) => setNewEtapeOrder(Number(e.target.value))}
                  required
                />
              </div>
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
    </>
  )
}
