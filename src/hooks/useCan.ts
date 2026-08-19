import { useAuthStore } from '@/store/useAuthStore'

/**
 * Renvoie le vérificateur `can(module, action)`.
 */
export const useCan = () => useAuthStore((s) => s.can)
