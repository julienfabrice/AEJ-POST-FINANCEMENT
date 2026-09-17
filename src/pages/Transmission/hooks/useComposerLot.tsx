import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { axiosInstance } from '@/constants/axiosInstance'
import { lotsImportationServices } from '@/services/lotsImportation.services'
import { lotsTransmissionServices } from '@/services/lotsTransmission.services'
import { guichetServices } from '@/services/guichets.services'
import { organismeServices } from '@/services/organismes.services'
import { parseExcelRepartition, type LigneExcelImportee } from '../utils/parseExcelRepartition'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import type { PROJETS_API_RESPONSE_T } from '@/services/projets.services'

export interface DossierARepartir {
  microProjetId: number
  code: string
  titre: string
  promoteurNom: string
  montant: number
}

export interface LotTransmissionFormState {
  organisme_id: number | null
  guichet_id: number | null
  code: string
  titre: string
  fichier_repartition: string
  fichier_courrier: string
  reference_courrier: string
  reference_convention: string
  date_transmission: string
  taux_recouvrement: number
  duree_differee: number
  duree_remboursement: number
}

const DEFAULT_FORM: LotTransmissionFormState = {
  organisme_id: null,
  guichet_id: null,
  code: '',
  titre: '',
  fichier_repartition: '',
  fichier_courrier: '',
  reference_courrier: '',
  reference_convention: '',
  date_transmission: new Date().toISOString().slice(0, 10),
  taux_recouvrement: 0,
  duree_differee: 0,
  duree_remboursement: 0,
}

/** Recherche un micro-projet existant correspondant au code importé. */
async function rechercherMicroProjetParCode(code: string): Promise<MICRO_PROJET_T | null> {
  const { data } = await axiosInstance.get<PROJETS_API_RESPONSE_T>('/projets', {
    params: { search: code, per_page: 5 },
  })
  return data.data.find((p) => p.code === code) ?? data.data[0] ?? null
}

export function useComposerLot() {
  const [dossiers, setDossiers] = useState<DossierARepartir[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [isImporting, setIsImporting] = useState(false)
  const [form, setForm] = useState<LotTransmissionFormState>(DEFAULT_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: guichets = [] } = guichetServices.useGetAll()
  const { data: organismes = [] } = organismeServices.useGetAll()
  const { mutateAsync: createImportation } = lotsImportationServices.useCreate()
  const { mutateAsync: createLot } = lotsTransmissionServices.useCreate()

  const setFormField = useCallback(<K extends keyof LotTransmissionFormState>(field: K, value: LotTransmissionFormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const toggleDossier = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleSelectAll = useCallback(() => {
    setSelectedIds(new Set(dossiers.map((d) => d.microProjetId)))
  }, [dossiers])

  /** Étapes 1 + 2 : parse le fichier, enregistre chaque ligne, puis ne garde que les dossiers trouvés dans le système. */
  const handleImportExcel = useCallback(async (file: File) => {
    setIsImporting(true)
    try {
      const lignes = await parseExcelRepartition(file)
      if (lignes.length === 0) {
        toast.error("Le fichier ne contient aucune ligne exploitable (colonnes attendues : code, nom, prénom, montant).")
        return
      }

      setFormField('fichier_repartition', file.name)

      const resultats = await Promise.allSettled(
        lignes.map(async (ligne: LigneExcelImportee) => {
          await createImportation(ligne)
          const microProjet = await rechercherMicroProjetParCode(ligne.code)
          if (!microProjet) return null
          const dossier: DossierARepartir = {
            microProjetId: microProjet.id,
            code: microProjet.code,
            titre: microProjet.intitule,
            promoteurNom: `${ligne.prenom_promoteur} ${ligne.nom_promoteur}`.trim(),
            montant: ligne.montant_sollicite,
          }
          return dossier
        })
      )

      const matches = resultats
        .filter((r): r is PromiseFulfilledResult<DossierARepartir | null> => r.status === 'fulfilled')
        .map((r) => r.value)
        .filter((d): d is DossierARepartir => d !== null)

      setDossiers(matches)
      setSelectedIds(new Set())

      const nbEchecs = lignes.length - matches.length
      if (matches.length === 0) {
        toast.error("Aucune correspondance trouvée dans le système pour les lignes importées.")
      } else if (nbEchecs > 0) {
        toast.success(`${matches.length} dossier(s) rapproché(s) — ${nbEchecs} ligne(s) sans correspondance ignorée(s).`)
      } else {
        toast.success(`${matches.length} dossier(s) rapproché(s) avec succès.`)
      }
    } catch (error) {
      toast.error("Erreur lors de l'import du fichier Excel.")
      console.error(error)
    } finally {
      setIsImporting(false)
    }
  }, [createImportation, setFormField])

  /** Étape 4 : création du lot, association des dossiers sélectionnés, puis passage au statut TRANSMIS. */
  const handleTransmettre = useCallback(async () => {
    if (selectedIds.size === 0) {
      toast.error('Sélectionne au moins un dossier à transmettre.')
      return
    }
    if (!form.organisme_id || !form.guichet_id || !form.code || !form.titre) {
      toast.error('Renseigne au minimum le partenaire, le guichet, le code et le titre du lot.')
      return
    }

    setIsSubmitting(true)
    try {
      const lot = await createLot({
        organisme_id: form.organisme_id,
        guichet_id: form.guichet_id,
        code: form.code,
        titre: form.titre,
        fichier_repartition: form.fichier_repartition || null,
        fichier_courrier: form.fichier_courrier || null,
        reference_courrier: form.reference_courrier || null,
        reference_convention: form.reference_convention || null,
        date_transmission: form.date_transmission || null,
        taux_recouvrement: form.taux_recouvrement,
        duree_differee: form.duree_differee,
        duree_remboursement: form.duree_remboursement,
        statut: 'BROUILLON',
      })

      const lotId = lot?.data?.id ?? lot?.id
      if (!lotId) throw new Error('Le lot créé ne renvoie pas d\'identifiant exploitable.')

      // Appels directs (et non les hooks de service) : on est dans une chaîne
      // asynchrone impérative à l'intérieur d'un callback, pas au niveau
      // racine d'un composant — les hooks React ne peuvent pas s'y appeler.
      await axiosInstance.post('/lots-micro-projets', {
        lot_id: lotId,
        micro_projet_ids: Array.from(selectedIds),
        statut: 'EN_ATTENTE',
      })

      await axiosInstance.patch(`/lots-transmission/${lotId}`, { statut: 'TRANSMIS' })

      toast.success(`Lot transmis avec ${selectedIds.size} dossier(s) !`)

      // Les dossiers envoyés disparaissent de la liste à répartir.
      setDossiers((prev) => prev.filter((d) => !selectedIds.has(d.microProjetId)))
      setSelectedIds(new Set())
      setForm(DEFAULT_FORM)
    } catch (error) {
      toast.error('Erreur lors de la transmission du lot.')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }, [selectedIds, form, createLot])

  return {
    guichets,
    organismes,
    dossiers,
    selectedIds,
    toggleDossier,
    handleSelectAll,
    isImporting,
    handleImportExcel,
    form,
    setFormField,
    isSubmitting,
    handleTransmettre,
  }
}