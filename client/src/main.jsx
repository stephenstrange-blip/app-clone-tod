import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css_reset.css'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary';
import { routes } from './routes/routes'

import { fallBackRender, logError } from './pages/Error'

const router = createBrowserRouter(routes)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary fallbackRender={fallBackRender} onError={logError}>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)
