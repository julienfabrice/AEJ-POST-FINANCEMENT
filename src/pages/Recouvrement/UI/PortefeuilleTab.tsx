import { Wrench } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { CartePortefeuille } from '../components/CartePortefeuille'
import { type ProjetRecouvrement } from '@/mock/recouvrement.mock'

interface PortefeuilleTabProps {
  aJour: ProjetRecouvrement[]
  leger: ProjetRecouvrement[]
  lourd: ProjetRecouvrement[]
  onActionAmiable: (id: string) => void
  onSortir: (id: string) => void
}

export function PortefeuilleTab({ aJour, leger, lourd, onActionAmiable, onSortir }: PortefeuilleTabProps) {

  return (
    <div>
      <Card className="mb-4 p-2 border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)]">
        <div className="flex items-center gap-[7px] bg-[#FBEADE] text-[#C85E18] text-[12px] px-[11px] py-[8px] rounded-[8px]">
          <Wrench size={14} className="flex-none" />
          Les recouvrements sont assurés par la société <b>C02CI</b>, qui verse au nom du bénéficiaire <em className="text-[#5A6B80] not-italic">— l&apos;interconnexion avec son outil reste à mettre en place</em>
        </div>
      </Card>

      <CartePortefeuille 
        titre="À jour" 
        cls="gr" 
        items={aJour} 
        vide="Aucun dossier à jour" 
        amiable={false} 
      />
      
      <CartePortefeuille 
        titre="≤ 3 échéances impayées — recouvrement à l'amiable" 
        cls="am" 
        items={leger} 
        vide="Aucun dossier concerné" 
        amiable={true} 
        onActionAmiable={onActionAmiable}
      />
      
      <CartePortefeuille 
        titre="> 3 échéances impayées — saisine de l'avocat" 
        cls="rd" 
        items={lourd} 
        vide="Aucun dossier concerné" 
        amiable="lourd" 
        onSortir={onSortir}
      />
    </div>
  )
}
