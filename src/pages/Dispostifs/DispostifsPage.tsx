import { DispositifsHeader } from './UI/DispositifsHeader'
import { DispositifsList } from './components/DispositifsList'

export function DispostifsPage() {
  const handleAddDispositif = () => {
    console.log('Nouveau guichet cliqué')
  }

  return (
    <div className="flex flex-col gap-6">
      <DispositifsHeader onAdd={handleAddDispositif} />
      <DispositifsList />
    </div>
  )
}
