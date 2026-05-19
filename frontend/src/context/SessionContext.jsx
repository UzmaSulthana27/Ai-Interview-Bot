import { createContext, useContext, useState } from 'react'
import API from '../api/axios'

const SessionContext = createContext()

export function SessionProvider({ children }) {
  const [sessionsUsed, setSessionsUsed] = useState(
    parseInt(localStorage.getItem('sessionsUsed') || '0')
  )
  const [sessionsLeft, setSessionsLeft] = useState(
    parseInt(localStorage.getItem('sessionsLeft') || '3')
  )
  // NEVER trust localStorage for isPremium — always verify with backend
  const [isPremium, setIsPremium] = useState(false)
  const [showUpgradePopup, setShowUpgradePopup] = useState(false)

  const updateSessionInfo = (used, left, premium) => {
    setSessionsUsed(used)
    setSessionsLeft(left)
    setIsPremium(Boolean(premium))
    localStorage.setItem('sessionsUsed', used)
    localStorage.setItem('sessionsLeft', left)
    // Store for display only — never used to gate features
    localStorage.setItem('isPremium', premium)
  }

  const refreshStatus = async () => {
    const userId = localStorage.getItem('userId')
    if (!userId) return
    try {
      const res = await API.get(`/auth/status/${userId}`)
      updateSessionInfo(
        res.data.sessionsUsed,
        res.data.sessionsLeft,
        res.data.isPremium
      )
    } catch (err) {
      console.error('Status refresh failed:', err)
    }
  }

  // NOTE: handleUpgrade is intentionally removed.
  // Premium is granted ONLY via the UpgradePopup payment form
  // which sends card details to the backend for validation.

  return (
    <SessionContext.Provider value={{
      sessionsUsed,
      sessionsLeft,
      isPremium,
      showUpgradePopup,
      setShowUpgradePopup,
      updateSessionInfo,
      refreshStatus,
    }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext)
