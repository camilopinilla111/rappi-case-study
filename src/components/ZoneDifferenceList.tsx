import type { Zone } from '../data/MetricAnalyzer'
import { ZoneDifferenceItem } from './ZoneDifferenceItem'

type ZoneDifferenceListProps = {
  zones: Zone[]
}

const differenceFormatter = new Intl.NumberFormat('es-CO', {
  maximumFractionDigits: 2,
})

export function ZoneDifferenceList({ zones }: ZoneDifferenceListProps) {
  return (
    <ul className="divide-y-0">
      {zones.map((zone) => (
        <ZoneDifferenceItem
          key={zone.id}
          zone={zone}
          differenceFormatter={differenceFormatter}
        />
      ))}
    </ul>
  )
}
