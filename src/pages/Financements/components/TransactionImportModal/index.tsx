import { toast } from 'sonner'
import { money } from '@/helpers/money'
import { transactionServices } from '@/services/transactions.services'
import type { TRANSACTION_CREATE_PAYLOAD_T } from '@/schema/transactions/transactionSchema'
import {
  type ParsedTransactionRow,
  parseTransactionFile,
  downloadTransactionTemplate,
} from '@/helpers/transactionExcel'
import {
  ImportInExcelOrJsonModal,
  type ImportColumnDef,
  type FieldGuideSection,
} from '@/components/generics/ImportInExcelOrJsonModal'

interface TransactionImportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const COLUMNS: ImportColumnDef<ParsedTransactionRow>[] = [
  {
    header: 'Projet ID',
    accessorKey: 'micro_projet_id',
    className: 'font-mono',
  },
  {
    header: 'Intitulé',
    accessorKey: 'libelle',
    className: 'font-medium text-slate-800 line-clamp-1',
  },
  {
    header: 'Montant',
    align: 'right',
    className: 'font-mono font-medium',
    cell: (row) => (row.montant ? money(row.montant) : '—'),
  },
  {
    header: 'Type',
    cell: (row) => (
      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
        {row.type}
      </span>
    ),
  },
  {
    header: 'Date',
    accessorKey: 'date',
    className: 'font-mono text-slate-600',
  },
  {
    header: 'Paiement',
    accessorKey: 'mode_paiement',
    className: 'text-slate-600',
  },
  {
    header: 'Statut',
    cell: (row) => (
      <span
        className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
          row.statut === 'VALIDE'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : row.statut === 'SOUMIS'
            ? 'bg-amber-50 text-amber-700 border border-amber-200'
            : row.statut === 'REJETE'
            ? 'bg-red-50 text-red-700 border border-red-200'
            : 'bg-slate-100 text-slate-600'
        }`}
      >
        {row.statut}
      </span>
    ),
  },
]

const GUIDE_SECTIONS: FieldGuideSection[] = [
  {
    title: 'Obligatoires',
    items: [
      { name: 'micro_projet_id', description: 'ID numérique du projet' },
      { name: 'libelle', description: 'Intitulé de la dépense' },
      { name: 'montant', description: 'Montant positif (FCFA)' },
    ],
  },
  {
    title: 'Classification',
    items: [
      { name: 'type', description: 'DEPENSE (défaut) ou RECETTE' },
      { name: 'categorie_id', description: 'ID numérique catégorie (optionnel)' },
    ],
  },
  {
    title: 'Règlement & Référence',
    items: [
      { name: 'date', description: 'AAAA-MM-JJ' },
      { name: 'mode_paiement', description: 'VIREMENT, CHEQUE, ESPECES, BANQUE...' },
      { name: 'reference', description: 'Réf. facture / pièce comptable' },
    ],
  },
  {
    title: 'Validation & Notes',
    items: [
      { name: 'statut', description: 'VALIDE, BROUILLON, SOUMIS, REJETE, ANNULE' },
      { name: 'observations', description: 'Remarques ou détails' },
    ],
  },
]

export function TransactionImportModal({ open, onOpenChange }: TransactionImportModalProps) {
  const { mutateAsync: createMultipleTransactions } = transactionServices.useCreateMultiple()

  const handleImportRows = async (validRows: ParsedTransactionRow[]) => {
    try {
      const payload: { transactions: TRANSACTION_CREATE_PAYLOAD_T[] } = {
        transactions: validRows.map((row) => ({
          micro_projet_id: row.micro_projet_id,
          promoteur_id: null,
          categorie_id: row.categorie_id || null,
          libelle: row.libelle,
          montant: row.montant,
          type: row.type,
          date: row.date || null,
          mode_paiement: row.mode_paiement || null,
          reference: row.reference || null,
          statut: row.statut,
          observations: row.observations || null,
          justificatif_path: null,
        })),
      }

      await createMultipleTransactions(payload)
      
      toast.success(`${validRows.length} dépense(s) importée(s) avec succès !`)
      onOpenChange(false)
    } catch (err: any) {
      console.error('Erreur importation massive de dépenses', err)
      const msg = err.response?.data?.message || err.message || "Erreur lors de l'importation."
      toast.error(msg)
    }
  }

  return (
    <ImportInExcelOrJsonModal<ParsedTransactionRow>
      open={open}
      onOpenChange={onOpenChange}
      title="Importer des dépenses"
      description="Importez des dépenses ou transactions par lot via un fichier Excel (.xlsx, .xls) ou JSON (.json) conforme au formulaire."
      entityName="dépense"
      onParseFile={parseTransactionFile}
      onDownloadTemplate={downloadTransactionTemplate}
      onImportRows={handleImportRows}
      columns={COLUMNS}
      guideSections={GUIDE_SECTIONS}
    />
  )
}
