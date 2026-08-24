import { useDispositifs } from '../hooks/useDispositifs'
import { DispositifCard } from '../UI/DispositifCard'

export function DispositifsList() {
  const { data: dispositifs, isLoading } = useDispositifs()

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
      {dispositifs.map((d) => (
        <DispositifCard key={d.id} dispositif={d} />
      ))}
    </div>
  )
}
