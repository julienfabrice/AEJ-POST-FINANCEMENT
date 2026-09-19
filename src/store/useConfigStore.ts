import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ConfigState {
  sigle_monnaie_pays: string
  setSigleMonnaiePays: (sigle: string) => void
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      sigle_monnaie_pays: 'CFA',
      setSigleMonnaiePays: (sigle) => set({ sigle_monnaie_pays: sigle || 'CFA' }),
    }),
    {
      name: 'aej-config-storage',
    }
  )
)
