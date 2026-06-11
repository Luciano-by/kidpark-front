// src/app/App.tsx
// Adicionado AccessibilityProvider envolvendo toda a aplicação.

import { RouterProvider }         from 'react-router'
import { AuthProvider }           from '../contexts/AuthContext'
import { AccessibilityProvider }  from '../contexts/AccessibilityContext'
import { router }                 from './routes'

export default function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </AccessibilityProvider>
  )
}