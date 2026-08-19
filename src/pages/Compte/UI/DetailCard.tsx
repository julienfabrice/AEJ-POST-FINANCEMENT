import { Pencil } from 'lucide-react'
import type { DetailItem, EditableField } from '../fields'

interface DetailCardProps {
  item: DetailItem
  onEdit: (field: EditableField) => void
  /** Modification temporairement indisponible (endpoint non confirmé). */
  editDisabled?: boolean
  editDisabledHint?: string
}

export function DetailCard({ item, onEdit, editDisabled, editDisabledHint }: DetailCardProps) {
  const { label, value, icon: Icon, field } = item

  return (
    <div className="group relative flex items-start gap-4 rounded-2xl border p-5 transition-colors hover:bg-muted/40">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="size-5 text-primary" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium break-words">{value}</p>
      </div>

      {field && (
        <button
          type="button"
          onClick={() => onEdit(field)}
          disabled={editDisabled}
          title={editDisabled ? editDisabledHint : `Modifier : ${label.toLowerCase()}`}
          aria-label={`Modifier ${label.toLowerCase()}`}
          className="
            absolute top-4 right-4 flex size-8 cursor-pointer items-center justify-center
            rounded-lg text-muted-foreground opacity-0 transition
            hover:bg-muted hover:text-foreground
            focus-visible:opacity-100 group-hover:opacity-100
            disabled:cursor-not-allowed disabled:opacity-40
          "
        >
          <Pencil className="size-4" />
        </button>
      )}
    </div>
  )
}
