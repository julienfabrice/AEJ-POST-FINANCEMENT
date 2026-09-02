import { Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '../components/StatusBadge'

export function TabGaranties() {
  return (
    <Card className="p-0 overflow-hidden border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)]">
      {/* En-tête */}
      <div className="flex items-center gap-3 px-[18px] py-[15px] border-b border-[#EEF2F7]">
        <h3 className="text-[14.5px] font-bold text-[#131C29]">Rappels de garantie</h3>
        <div className="flex-1" />
        <StatusBadge label="En préparation" variant="am" />
      </div>

      <div className="px-[18px] py-[16px]">
        <div className="text-center py-12 text-[#5A6B80]">
          <div className="w-12 h-12 rounded-full bg-[#FBF1D6] text-[#8a6503] grid place-items-center mx-auto mb-3">
            <Clock size={24} />
          </div>
          <b className="block text-[#131C29] text-[15px] mb-1 font-['Archivo']">
            Module Rappels de garantie
          </b>
          <span className="text-[13px] text-[#5A6B80] max-w-md block mx-auto">
            Ce point d'API n'est pas encore disponible sur le serveur backend. Les fonctionnalités et données associées seront automatiquement activées dès leur mise à disposition.
          </span>
        </div>
      </div>
    </Card>
  )
}

