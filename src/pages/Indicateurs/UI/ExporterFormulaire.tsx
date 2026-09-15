import type {FORMULAIRE_T, QUESTION_T} from "@/types";
import * as XLSX from 'xlsx';

export function ExporterFormulaire(formulaire: FORMULAIRE_T) {
    const workbook = XLSX.utils.book_new()

    const infoSheet = XLSX.utils.json_to_sheet([
        {
            Code: formulaire.code,
            Libellé: formulaire.libelle,
            'Public cible': formulaire.public_cible,
            Actif: formulaire.actif ? 'Oui': 'Non'
        }
    ])
    XLSX.utils.book_append_sheet(workbook, infoSheet, 'Fiche')

    const questions: QUESTION_T[] = formulaire.questions || []
    const questionsSheet = XLSX.utils.json_to_sheet(
        questions.map((q) => ({
            Code: q.code,
            Libellé: q.libelle,
            Type: q.type_question,
            Options: q.options ? q.options.join(',') : '',
            Ordre: q.ordre,
            Affichage: q.affichage ? 'Oui' : 'Non',
            Obligatoire: q.obligatoire ? 'Oui' : 'Non'
        }))
    )
    XLSX.utils.book_append_sheet(workbook, questionsSheet, 'Questions')

    const autoFitColumns = (sheet: XLSX.WorkSheet, data: Record<string, any>[]) => {
        if (data.length === 0) return
        const colWidths = Object.keys(data[0]).map((key) => ({
            wch: Math.max(key.length, ...data.map((row) => String(row[key] ?? '').length)) + 2
        }))
        sheet['!cols'] = colWidths
    }

        autoFitColumns(infoSheet, [{ Code: formulaire.code, Libellé: formulaire.libelle, 'Public cible': formulaire.public_cible, Actif: formulaire.actif ? 'Oui' : 'Non' }])
        autoFitColumns(questionsSheet, questions.map((q) => ({
            Code: q.code, Libellé: q.libelle, Type: q.type_question,
            Options: q.options ? q.options.join(', ') : '', Ordre: q.ordre,
            Affichage: q.affichage ? 'Oui' : 'Non', Obligatoire: q.obligatoire ? 'Oui' : 'Non',
        })))

    const fileName = `Fiche_${formulaire.code || 'formulaire'}_${new Date().toISOString().slice(0, 10)}.xlsx`
    XLSX.writeFile(workbook, fileName)
}