import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { TooltipProvider } from '@/components/ui/tooltip'
import { queryClient } from '@/lib/queryClient'
import { wireSessionBridge } from '@/lib/sessionBridge'
import { routeTree } from './routeTree.gen'
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage'
import './index.css'


const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultNotFoundComponent: NotFoundPage,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Branche la réaction à « session perdue » AVANT le premier rendu : le tout
// premier `/auth/me` part depuis `beforeLoad`, donc avant qu'un composant
// n'existe. 
wireSessionBridge()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>

        <RouterProvider router={router} />
      </TooltipProvider>

      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>,
)
