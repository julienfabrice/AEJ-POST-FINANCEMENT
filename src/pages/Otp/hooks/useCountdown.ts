import { useCallback, useEffect, useState } from 'react'

/**
 * Compte à rebours en secondes, purement local. L'écran OTP en utilise deux :
 * le délai avant renvoi et la validité du code.
 */
export function useCountdown() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (seconds <= 0) return
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [seconds])

  const start = useCallback((from: number) => setSeconds(from), [])
  const stop = useCallback(() => setSeconds(0), [])

  return { seconds, start, stop, isRunning: seconds > 0 }
}
