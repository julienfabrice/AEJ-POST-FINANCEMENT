import { useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, Loader2, SkipForward } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ImportedRow } from '@/helpers/imputationExcel'

interface ImputationImportDialogProps {
  open: boolean
  rows: ImportedRow[]
  onClose: () => void
  onConfirm: (grouped: { agence_id: number | null; projetIds: number[] }[]) => Promise<void>
}

const STATUS_CONFIG = {
  valid: {
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-200',
    label: 'Valide',
  },
  direction: {
    icon: Info,
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200',
    label: 'Direction',
  },
  already_imputed: {
    icon: SkipForward,
    color: 'text-gray-400',
    bg: 'bg-gray-50 border-gray-200',
    label: 'Déjà imputé',
  },
  invalid_code: {
    icon: AlertCircle,
    color: 'text-red-600',
    bg: 'bg-red-50 border-red-200',
    label: 'Code inconnu',
  },
  invalid_agence: {
    icon: AlertCircle,
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-200',
    label: 'Agence inconnue',
  },
}

export function ImputationImportDialog({ open, rows, onClose, onConfirm }: ImputationImportDialogProps) {
  const [isConfirming, setIsConfirming] = useState(false)

  const stats = useMemo(() => ({
    valid: rows.filter(r => r.status === 'valid').length,
    direction: rows.filter(r => r.status === 'direction').length,
    errors: rows.filter(r => r.status === 'invalid_code' || r.status === 'invalid_agence').length,
    skipped: rows.filter(r => r.status === 'already_imputed').length,
  }), [rows])

  const canConfirm = stats.errors === 0 && (stats.valid + stats.direction) > 0

  const handleConfirm = async () => {
    // Grouper les projets eligibles par agence_id
    const eligibleRows = rows.filter(r => r.status === 'valid' || r.status === 'direction')
    const grouped = new Map<number | null, number[]>()

    for (const row of eligibleRows) {
      if (!row.projet) continue
      const key = row.status === 'direction' ? null : row.agence_id
      if (!grouped.has(key)) grouped.set(key, [])
      grouped.get(key)!.push(row.projet.id)
    }

    const payload = Array.from(grouped.entries()).map(([agence_id, projetIds]) => ({
      agence_id,
      projetIds,
    }))

    setIsConfirming(true)
    try {
      await onConfirm(payload)
      onClose()
    } finally {
      setIsConfirming(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#131C29]">Prévisualisation de l'import</DialogTitle>
          <DialogDescription>
            Vérifiez les lignes importées avant de confirmer l'imputation.
          </DialogDescription>
        </DialogHeader>

        {/* Résumé en badges */}
        <div className="flex flex-wrap gap-2 text-[12.5px]">
          {stats.valid > 0 && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 size={12} /> {stats.valid} à imputer en agence
            </span>
          )}
          {stats.direction > 0 && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              <Info size={12} /> {stats.direction} vers la Direction
            </span>
          )}
          {stats.skipped > 0 && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
              <SkipForward size={12} /> {stats.skipped} déjà imputé(s), ignoré(s)
            </span>
          )}
          {stats.errors > 0 && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
              <AlertCircle size={12} /> {stats.errors} erreur(s) — corriger le fichier
            </span>
          )}
        </div>

        <ScrollArea className="h-[340px] border border-[#E5EAF1] rounded-lg">
          <div className="p-2 space-y-2">
            {rows.map((row) => {
              const cfg = STATUS_CONFIG[row.status]
              const Icon = cfg.icon
              return (
                <div
                  key={row.line}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${cfg.bg} transition-colors`}
                >
                  <Icon size={15} className={`mt-0.5 flex-none ${cfg.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#131C29]">
                      {row.code}
                      {row.intitule && <span className="font-normal text-[#5A6B80] ml-1">— {row.intitule}</span>}
                    </p>
                    <p className={`text-[12px] ${cfg.color}`}>
                      {row.errorMsg ?? (
                        row.status === 'direction'
                          ? 'Conservé à la Direction'
                          : row.status === 'already_imputed'
                          ? 'Déjà imputé — sera ignoré'
                          : `Imputé à : ${row.agence_nom}`
                      )}
                    </p>
                  </div>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} border flex-none`}>
                    {cfg.label}
                  </span>
                </div>
              )
            })}
          </div>
        </ScrollArea>

        {stats.errors > 0 && (
          <p className="text-[12.5px] text-red-600 flex items-center gap-1">
            <AlertCircle size={13} />
            Corrigez les erreurs dans le fichier Excel et réimportez-le pour pouvoir confirmer.
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isConfirming}>
            Annuler
          </Button>
          <Button
            className="bg-[#E7722B] hover:bg-[#c9601e]"
            disabled={!canConfirm || isConfirming}
            onClick={handleConfirm}
          >
            {isConfirming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmer l'imputation ({stats.valid + stats.direction} dossier{stats.valid + stats.direction > 1 ? 's' : ''})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
