import { HeroProvider } from './providers/hero-provider'
import { QueryProvider } from './providers/query-provider'
import { Toaster } from 'sonner'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'

export const App = () => {
  return (
    <HeroProvider>
      <QueryProvider>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </QueryProvider>
    </HeroProvider>
  )
}