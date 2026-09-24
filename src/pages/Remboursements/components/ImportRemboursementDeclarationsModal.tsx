import React, { useState } from 'react'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import { ImportInExcelOrJsonModal } from '@/components/generics/ImportInExcelOrJsonModal'
import { parseRawFile, normalizeExcelKey, type GenericTemplateConfig } from '@/helpers/genericExcel'
import type { ImportRowBase, ImportColumnDef, FieldGuideSection } from '@/components/generics/ImportInExcelOrJsonModal'
import { remboursementDeclarationServices } from '@/services/remboursementsDeclarations.services'

interface DeclarationImportRow extends ImportRowBase {
  promoteur_id?: number
  budget_id?: number
  montant_declare?: number
  date_declaree?: string
  reference_banque?: string
  observations?: string
  statut?: string
}

interface Props {
  children: React.ReactNode
}

export function ImportRemboursementDeclarationsModal({ children }: Props) {
  const [open, setOpen] = useState(false)

  const columns: ImportColumnDef<DeclarationImportRow>[] = [
    { header: 'ID Promoteur', accessorKey: 'promoteur_id' },
    { header: 'ID Budget', accessorKey: 'budget_id' },
    { header: 'Montant', accessorKey: 'montant_declare' },
    { header: 'Date', accessorKey: 'date_declaree' },
    { header: 'Réf. Banque', accessorKey: 'reference_banque' },
    { header: 'Statut', accessorKey: 'statut' },
  ]

  const templateConfig: GenericTemplateConfig = {
    filename: 'Modele_Import_Declarations_Paiement',
    sheetName: 'Declarations',
    columns: [
      { key: 'promoteur_id', header: 'promoteur_id', width: 15 },
      { key: 'budget_id', header: 'budget_id', width: 15 },
      { key: 'montant_declare', header: 'montant_declare', width: 20 },
      { key: 'date_declaree', header: 'date_declaree', width: 20 },
      { key: 'reference_banque', header: 'reference_banque', width: 20 },
      { key: 'observations', header: 'observations', width: 30 },
      { key: 'statut', header: 'statut', width: 15, dropdownOptions: ['BROUILLON', 'SOUMIS', 'TRAITE'] },
    ],
    sampleData: [
      {
        promoteur_id: 1,
        budget_id: 10,
        montant_declare: 50000,
        date_declaree: dayjs().format('YYYY-MM-DD'),
        reference_banque: 'REF-12345',
        observations: 'Remboursement de la première tranche',
        statut: 'BROUILLON',
      }
    ]
  }

  const guideSections: FieldGuideSection[] = [
    {
      title: 'Champs obligatoires',
      items: [
        { name: 'promoteur_id', description: 'ID du promoteur dans le système' },
        { name: 'budget_id', description: 'ID du budget associé' },
        { name: 'montant_declare', description: 'Montant déclaré en chiffres' },
      ]
    },
    {
      title: 'Champs optionnels',
      items: [
        { name: 'date_declaree', description: 'Format YYYY-MM-DD (défaut: date du jour)' },
        { name: 'reference_banque', description: 'Référence de la transaction bancaire' },
        { name: 'observations', description: 'Commentaires supplémentaires' },
        { name: 'statut', description: 'BROUILLON, SOUMIS ou TRAITE (défaut: BROUILLON)' },
      ]
    }
  ]

  const handleParseFile = async (file: File): Promise<DeclarationImportRow[]> => {
    const rawData = await parseRawFile(file)
    
    return rawData.map((row, index) => {
      // Normaliser les clés de l'objet pour la souplesse (insensible à la casse/accents)
      const normalizedRow: Record<string, any> = {}
      for (const [key, value] of Object.entries(row)) {
        normalizedRow[normalizeExcelKey(key)] = value
      }

      let isValid = true
      let error = ''

      const promoteur_id = Number(normalizedRow.promoteur_id)
      const budget_id = Number(normalizedRow.budget_id)
      const montant_declare = Number(normalizedRow.montant_declare)
      
      if (!promoteur_id || isNaN(promoteur_id)) {
        isValid = false
        error = 'ID Promoteur invalide ou manquant'
      } else if (!budget_id || isNaN(budget_id)) {
        isValid = false
        error = 'ID Budget invalide ou manquant'
      } else if (!montant_declare || isNaN(montant_declare)) {
        isValid = false
        error = 'Montant déclaré invalide ou manquant'
      }

      // Format date if it's parsed as Date object by ExcelJS/XLSX
      let date_declaree = normalizedRow.date_declaree
      if (date_declaree instanceof Date) {
        date_declaree = dayjs(date_declaree).format('YYYY-MM-DD')
      } else if (date_declaree) {
        date_declaree = String(date_declaree)
      }

      return {
        index: index + 1,
        isValid,
        error,
        promoteur_id,
        budget_id,
        montant_declare,
        date_declaree,
        reference_banque: normalizedRow.reference_banque ? String(normalizedRow.reference_banque) : undefined,
        observations: normalizedRow.observations ? String(normalizedRow.observations) : undefined,
        statut: normalizedRow.statut ? String(normalizedRow.statut).toUpperCase() : 'BROUILLON',
      }
    })
  }

  const { mutateAsync: createDeclaration } = remboursementDeclarationServices.useCreate()

  const handleImportRows = async (validRows: DeclarationImportRow[]) => {
    let successCount = 0
    let errorCount = 0

    // Importation séquentielle car l'API /multiple n'existe pas encore
    for (const row of validRows) {
      try {
        await createDeclaration({
          promoteur_id: row.promoteur_id!,
          budget_id: row.budget_id!,
          montant_declare: row.montant_declare!,
          date_declaree: row.date_declaree || dayjs().format('YYYY-MM-DD'),
          reference_banque: row.reference_banque || null,
          observations: row.observations || null,
          statut: (row.statut as any) || 'BROUILLON',
        })
        successCount++
      } catch (e) {
        errorCount++
      }
    }
    if (successCount > 0) {
      toast.success(`${successCount} déclaration(s) importée(s) avec succès !`)
    }
    if (errorCount > 0) {
      toast.error(`${errorCount} déclaration(s) n'ont pas pu être importée(s).`)
    }
    
    setOpen(false)
  }

  return (
    <>
      <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
        {children}
      </div>
      
      <ImportInExcelOrJsonModal<DeclarationImportRow>
        open={open}
        onOpenChange={setOpen}
        title="Import massif des déclarations"
        description="Importez plusieurs déclarations de paiement depuis un fichier Excel ou JSON."
        entityName="déclaration"
        columns={columns}
        templateConfig={templateConfig}
        guideSections={guideSections}
        onParseFile={handleParseFile}
        onImportRows={handleImportRows}
      />
    </>
  )
}
