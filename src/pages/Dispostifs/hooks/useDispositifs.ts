import { MOCK_DISPOSITIFS } from '@/mock/dispositifs.mock'

export function useDispositifs() {
  // Simuler un fetch avec le mock pour le moment
  return {
    data: MOCK_DISPOSITIFS,
    isLoading: false,
    error: null,
  }
}
