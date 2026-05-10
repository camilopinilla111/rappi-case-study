import type { Zone } from '../data/MetricAnalyzer'

type ZoneDifferenceListProps = {
  zones: Zone[]
}

const differenceFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
})

export function ZoneDifferenceList({ zones }: ZoneDifferenceListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
          <tr>
            <th scope="col" className="py-3 pr-4">
              Zona
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              Diferencia
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              Compañía de comparación
            </th>
            <th scope="col" className="py-3 pl-4 text-right">
              Compañía de referencia
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {zones.map((zone) => {
            const differencePrefix =
              zone.comparisonData.value >= zone.referenceData.value ? '+' : '-'

            return (
              <tr key={zone.id}>
                <td className="py-3 pr-4 font-medium text-slate-800">
                  {zone.name}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-slate-950">
                  {differencePrefix}
                  {differenceFormatter.format(zone.difference)}
                </td>
                <td className="px-4 py-3 text-right text-slate-700">
                  {differenceFormatter.format(zone.comparisonData.value)}
                </td>
                <td className="py-3 pl-4 text-right text-slate-700">
                  {differenceFormatter.format(zone.referenceData.value)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
