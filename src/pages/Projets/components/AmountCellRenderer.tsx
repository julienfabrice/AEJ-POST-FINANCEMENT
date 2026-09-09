import type { ICellRendererParams } from 'ag-grid-community'
import type { PROJET_T } from '@/types'
import { configurationServices } from '@/services/configurations.services'

export const AmountCellRenderer = (params: ICellRendererParams<PROJET_T>) => {
  const { data: configuration } = configurationServices.useGet()

  return (
    <div className="flex items-center justify-end h-full font-mono font-semibold">
      {params.value} <span className="text-slate-400 font-normal ml-1 text-[11px]">{configuration?.sigle_monnaie_pays || 'FCFA'}</span>
    </div>
  )
}
