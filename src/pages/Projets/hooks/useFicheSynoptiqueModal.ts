import { useProjetsStore } from '@/store/useProjetsStore'

export function useFicheSynoptiqueModal() {
  const { ficheSynoptiqueModalProjet: projet, setFicheSynoptiqueModalProjet } = useProjetsStore()

  const handleClose = () => setFicheSynoptiqueModalProjet(null)

  // Computations
  const montantSolliciteRaw = projet?.montant_total ? Number(projet.montant_total) : 0
  const montantSollicite = montantSolliciteRaw > 0 
    ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(montantSolliciteRaw) 
    : '—'
  
  // Montant décaissé : somme des lignes de décaissement validées, ou du plan de décaissement, ou 0
  const lignesDecaissement = projet?.plan_decaissement?.lignes || []
  const montantDecaisseRaw = lignesDecaissement
    .filter(l => l.statut === 'VALIDE')
    .reduce((acc, l) => acc + Number(l.montant_ligne), 0)
  const montantDecaisse = montantDecaisseRaw > 0 
    ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(montantDecaisseRaw) 
    : '—'

  // Total dû / remboursé
  const totalDuRaw = projet?.plan_remboursement ? Number(projet.plan_remboursement.montant_credit) : 0
  const totalRembourseRaw = projet?.recouvrements 
    ? projet.recouvrements.reduce((acc, r) => acc + Number(r.montant_recouvre), 0) 
    : 0
  const totalDu = totalDuRaw > 0 
    ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(totalDuRaw) 
    : '0 F'
  const totalRembourse = totalRembourseRaw > 0 
    ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(totalRembourseRaw) 
    : '0 F'

  // Workflow info
  const wfInstance = projet?.workflow_instance
  const currentStep = wfInstance?.current_etape_code || 'N/A'

  const handlePrint = () => {
    const printContent = document.getElementById('printable-fiche-synoptique')
    if (!printContent) return

    const iframe = document.createElement('iframe')
    iframe.style.position = 'absolute'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = 'none'
    document.body.appendChild(iframe)

    const doc = iframe.contentWindow?.document
    if (!doc) return

    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map(style => style.outerHTML)
      .join('')

    doc.open()
    doc.write(`
      <html>
        <head>
          <title>Fiche Synoptique - ${projet?.code || 'N/A'}</title>
          ${styles}
          <style>
            body { padding: 30px; background: white !important; }
            /* On s'assure que le contenu s'affiche en bloc pour l'impression */
            .custom-scrollbar { overflow: visible !important; max-height: none !important; }
          </style>
        </head>
        <body>
          <div style="max-width: 800px; margin: 0 auto;">
            <h2 style="font-family: sans-serif; font-size: 20px; font-weight: bold; margin-bottom: 24px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0;">
              Fiche synoptique — ${projet?.code || 'N/A'}
            </h2>
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `)
    doc.close()

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.focus()
        iframe.contentWindow?.print()
        setTimeout(() => document.body.removeChild(iframe), 1000)
      }, 200)
    }
  }

  return {
    projet,
    handleClose,
    handlePrint,
    montantSollicite,
    montantDecaisse,
    totalDu,
    totalRembourse,
    currentStep
  }
}
