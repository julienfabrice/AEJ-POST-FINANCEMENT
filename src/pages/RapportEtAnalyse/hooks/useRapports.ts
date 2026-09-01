import { useState, useMemo } from 'react'
import { MOCK_REPORTS, MOCK_TRENDS } from '@/mock/rapports.mock'

export type ReportType = keyof typeof MOCK_REPORTS

export function useRapports() {
  const [type, setType] = useState<ReportType>('par_region')
  const [dispositif, setDispositif] = useState('')
  const [region, setRegion] = useState('')
  const [statut, setStatut] = useState('')

  const reportData = useMemo(() => {
    return MOCK_REPORTS[type]
  }, [type])

  // Here in a real app, you would filter by dispositif, region, and statut
  // For the mock, we just return the static data for the selected type
  const rows = reportData.rows
  
  const totalN = rows.reduce((acc, r) => acc + r.n, 0)
  const totalM = rows.reduce((acc, r) => acc + r.m, 0)

  const donutData = rows.map(r => ({ k: r.k, v: r.m }))
  const barData = rows.map(r => ({ k: r.k, m: r.m }))

  return {
    filters: { type, dispositif, region, statut },
    setters: { setType, setDispositif, setRegion, setStatut },
    reportData,
    rows,
    totalN,
    totalM,
    donutData,
    barData,
    trendData: MOCK_TRENDS
  }
}
