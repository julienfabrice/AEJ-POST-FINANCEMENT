import { Download, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { PermissionGate } from '@/components/PermissionGate'
import { MODULES } from '@/constants/modules'

export function JeunesHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-[#131C29]">Promoteurs (porteurs)</h1>
        <p className="text-sm text-[#5A6B80] mt-1">Gestion des jeunes promoteurs enregistrés</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Exporter
        </Button>
        {/* Création : désactivée car les données viennent de l'AEJ */}
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-block">
                <Button disabled size="sm" className="bg-[#E7722B]/50 text-white cursor-not-allowed">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Nouveau promoteur
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[250px] text-center">
              Les données de cette table proviennent directement du système de l'AEJ.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
