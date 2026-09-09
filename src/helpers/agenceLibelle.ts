import { MOCK_AGENCES_IMPUTATION } from '@/mock/imputation.mock'

export function agenceLibelle(id: string) {
  return MOCK_AGENCES_IMPUTATION.find((a) => a.id === id)?.libelle ?? id
}
