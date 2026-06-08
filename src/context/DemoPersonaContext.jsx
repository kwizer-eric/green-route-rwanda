import { createContext, useContext, useState, useEffect } from 'react'

export const DEMO_PERSONAS = {
  farmer: { id: 'f1', role: 'farmer', name: 'Uwimana Jean', label: 'Farmer' },
  transporter: { id: 't1', role: 'transporter', name: 'Kamanzi Transport', label: 'Transporter' },
  buyer: { id: 'b1', role: 'buyer', name: 'Kigali Fresh Market', label: 'Buyer' },
  admin: { id: null, role: 'admin', name: 'Platform Admin', label: 'Admin' },
}

const STORAGE_KEY = 'greenroute-demo-persona'

const DemoPersonaContext = createContext()

export function DemoPersonaProvider({ children }) {
  const [personaKey, setPersonaKey] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'farmer'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, personaKey)
  }, [personaKey])

  const persona = DEMO_PERSONAS[personaKey] || DEMO_PERSONAS.farmer

  return (
    <DemoPersonaContext.Provider value={{ personaKey, persona, setPersonaKey }}>
      {children}
    </DemoPersonaContext.Provider>
  )
}

export function useDemoPersona() {
  const ctx = useContext(DemoPersonaContext)
  if (!ctx) throw new Error('useDemoPersona must be used within DemoPersonaProvider')
  return ctx
}
