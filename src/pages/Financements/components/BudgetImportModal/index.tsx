import { toast } from 'sonner'
import { money } from '@/helpers/money'
import { budgetServices } from '@/services/budgets.services'
import type { BUDGET_CREATE_PAYLOAD_T } from '@/schema/budgets/budgetSchema'
import {
  type ParsedBudgetRow,
  parseBudgetFile,
  downloadBudgetTemplate,
} from '@/helpers/budgetExcel'
import {
  ImportInExcelOrJsonModal,
  type ImportColumnDef,
  type FieldGuideSection,
} from '@/components/generics/ImportInExcelOrJsonModal'

interface BudgetImportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const COLUMNS: ImportColumnDef<ParsedBudgetRow>[] = [
  {
    header: 'Projet ID',
    accessorKey: 'micro_projet_id',
    className: 'font-mono',
  },
  {
    header: 'Intitulé',
    accessorKey: 'intitule',
    className: 'font-medium text-slate-800 line-clamp-1',
  },
  {
    header: 'Montant',
    align: 'right',
    className: 'font-mono font-medium',
    cell: (row) => (row.montant_accorde ? money(row.montant_accorde) : '—'),
  },
  {
    header: 'Approbation',
    cell: (row) => (
      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
        {row.statut}
      </span>
    ),
  },
  {
    header: 'Convention',
    cell: (row) => (
      <span
        className={`text-[11px] px-2 py-0.5 rounded-full ${
          row.signature_convention === 'SIGNEE'
            ? 'bg-emerald-50 text-emerald-700 font-medium'
            : 'bg-slate-100 text-slate-600'
        }`}
      >
        {row.signature_convention === 'SIGNEE' ? 'Signée' : 'Non signée'}
      </span>
    ),
  },
  {
    header: 'Déblocage',
    cell: (row) => (
      <span
        className={`text-[11px] px-2 py-0.5 rounded-full ${
          row.deblocage
            ? 'bg-emerald-50 text-emerald-700 font-medium'
            : 'bg-slate-100 text-slate-600'
        }`}
      >
        {row.deblocage ? 'OUI' : 'NON'}
      </span>
    ),
  },
  {
    header: 'Acte',
    cell: (row) => (
      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
        {row.reception_acte_credit}
      </span>
    ),
  },
]

const GUIDE_SECTIONS: FieldGuideSection[] = [
  {
    title: 'Obligatoires',
    items: [
      { name: 'micro_projet_id', description: 'ID numérique du projet' },
      { name: 'intitule', description: 'Intitulé du budget' },
      { name: 'montant_accorde', description: 'Montant (FCFA)' },
    ],
  },
  {
    title: 'Financement & Accord',
    items: [
      { name: 'devise', description: 'ex. FCFA (défaut: FCFA)' },
      { name: 'source', description: 'AFD, AEJ, BAD...' },
      { name: 'date_accord', description: 'AAAA-MM-JJ' },
      { name: 'statut', description: 'APPROUVE, EN_ATTENTE, NON_APPROUVE' },
    ],
  },
  {
    title: 'Convention & Déblocage',
    items: [
      { name: 'signature_convention', description: 'SIGNEE / NON_SIGNEE' },
      { name: 'date_signature', description: 'AAAA-MM-JJ' },
      { name: 'deblocage', description: 'OUI / NON' },
      { name: 'date_deblocage', description: 'AAAA-MM-JJ' },
    ],
  },
  {
    title: 'Acte & Observations',
    items: [
      { name: 'reception_acte_credit', description: 'OUI / NON / PARTIEL' },
      { name: 'date_reception', description: 'AAAA-MM-JJ' },
      { name: 'observations', description: 'Remarques ou notes' },
    ],
  },
]

export function BudgetImportModal({ open, onOpenChange }: BudgetImportModalProps) {
  const { mutateAsync: createMultipleBudgets } = budgetServices.useCreateMultiple()

  const handleImportRows = async (validRows: ParsedBudgetRow[]) => {
    try {
      const payload: { budgets: BUDGET_CREATE_PAYLOAD_T[] } = {
        budgets: validRows.map((row) => ({
          micro_projet_id: row.micro_projet_id,
          intitule: row.intitule,
          montant_accorde: row.montant_accorde,
          date_accord: row.date_accord || null,
          source: row.source || null,
          devise: row.devise || 'FCFA',
          statut: row.statut as any,
          deblocage: row.deblocage ? 'OUI' : 'NON',
          date_deblocage: row.date_deblocage || null,
          signature_convention: (row.signature_convention || 'NON_SIGNEE') as any,
          date_signature: row.date_signature || null,
          reception_acte_credit: (row.reception_acte_credit || 'NON') as any,
          date_reception: row.date_reception || null,
          observations: row.observations || null,
        })),
      }

      await createMultipleBudgets(payload)
      
      toast.success(`${validRows.length} budget(s) importé(s) avec succès !`)
      onOpenChange(false)
    } catch (err: any) {
      console.error('Erreur importation massive de budgets', err)
      const msg = err.response?.data?.message || err.message || "Erreur lors de l'importation."
      toast.error(msg)
    }
  }

  return (
    <ImportInExcelOrJsonModal<ParsedBudgetRow>
      open={open}
      onOpenChange={onOpenChange}
      title="Importer des budgets"
      description="Importez des budgets accordés par lot via un fichier Excel (.xlsx, .xls) ou JSON (.json) conforme au formulaire."
      entityName="budget"
      onParseFile={parseBudgetFile}
      onDownloadTemplate={downloadBudgetTemplate}
      onImportRows={handleImportRows}
      columns={COLUMNS}
      guideSections={GUIDE_SECTIONS}
    />
  )
}
