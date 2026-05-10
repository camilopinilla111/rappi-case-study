import type { Zone } from '../data/MetricAnalyzer'

type ZoneDifferenceItemProps = {
  zone: Zone
  differenceFormatter: Intl.NumberFormat
}

export function ZoneDifferenceItem({
  zone,
  differenceFormatter,
}: ZoneDifferenceItemProps) {
  return (
    <li className="flex items-center justify-between gap-4 border-b border-slate-200 py-3 last:border-b-0">
      <span className="text-sm font-medium text-slate-800">{zone.name}</span>
      <span className="shrink-0 text-sm font-semibold text-slate-950">
        {differenceFormatter.format(zone.difference)}
      </span>
    </li>
  )
}
