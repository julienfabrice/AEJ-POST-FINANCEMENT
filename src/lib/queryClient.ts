import { QueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'



const statusOf = (error: unknown) =>
  isAxiosError(error) ? error.response?.status : undefined

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /**
       * Sans cette règle, un 401 déjà arbitré par l'intercepteur (refresh
       * tenté, échoué, session vidée) serait retenté 3 fois par TanStack
       */
      retry: (failureCount, error) => {
        const status = statusOf(error)
        if (status && status >= 400 && status < 500) return false
        return failureCount < 2
      },
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})
