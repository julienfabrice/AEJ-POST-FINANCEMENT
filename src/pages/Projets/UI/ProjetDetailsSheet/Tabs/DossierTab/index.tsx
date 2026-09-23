import { TabsContent } from '@/components/ui/tabs'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import { useDossierTab } from './useDossierTab'
import { Section, Field } from '../../components'
import { TableauAmortissementSection } from './TableauAmortissementSection'

interface DossierTabProps {
  projet: MICRO_PROJET_T
}

export function DossierTab({ projet }: DossierTabProps) {
  const { sections, planRemboursementId } = useDossierTab(projet)

  return (
    <TabsContent value="dossier" className="mt-0 focus-visible:outline-none space-y-2 pb-6">
      {sections.map((section, idx) => (
        <Section key={idx} title={section.title}>
          {section.fields.map((field, fIdx) => (
            <Field 
              key={fIdx} 
              label={field.label} 
              value={field.value} 
              empty={field.empty} 
            />
          ))}
        </Section>
      ))}

      <TableauAmortissementSection planRemboursementId={planRemboursementId} />
    </TabsContent>
  )
}
