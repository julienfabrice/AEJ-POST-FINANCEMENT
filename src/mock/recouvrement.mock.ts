export interface Garantie {
  id: string
  projetId: string
  montantAppele: number
  dateRappel: string
  saisiPar: string
}

// ---------------------------------------------------------
// DONNÉES DE DÉMO (maquette aej-demo.html) — conservées en mock tant que
// le backend n'expose pas d'endpoint "rappels de garantie".
// ---------------------------------------------------------

export const MOCK_RECOUVREMENT_GARANTIES: Garantie[] = [
  { id: 'gr1', projetId: 'p16', montantAppele: 120000, dateRappel: '2025-01-20', saisiPar: 'UNACOOPEC-CI — Agence Plateau' },
  { id: 'gr2', projetId: 'p10', montantAppele: 3120000, dateRappel: '2026-02-10', saisiPar: 'Orange Bank Africa' },
]
