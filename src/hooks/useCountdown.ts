import { useCallback, useEffect, useState } from 'react'

/**
 * Compte à rebours en secondes, purement local.
 *
 * Utilisé par l'écran OTP (délai de renvoi, validité du code) et par l'écran de
 * connexion (durée de blocage du compte).
 */
export function useCountdown() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (seconds <= 0) return
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [seconds])

  const start = useCallback((from: number) => setSeconds(Math.max(0, Math.floor(from))), [])
  const stop = useCallback(() => setSeconds(0), [])

  return { seconds, start, stop, isRunning: seconds > 0 }
}
