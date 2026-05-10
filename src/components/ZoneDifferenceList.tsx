import type { Zone } from '../data/MetricAnalyzer'

type ZoneDifferenceListProps = {
  zones: Zone[]
  referenceCompanyName: string
  comparisonCompanyName: string
}

const differenceFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
})

export function ZoneDifferenceList({
  zones,
  referenceCompanyName,
  comparisonCompanyName,
}: ZoneDifferenceListProps) {
  return (
    <div className="max-w-full overflow-x-auto">
      <table className="w-max min-w-[40rem] text-left text-sm">
        <thead className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
          <tr>
            <th scope="col" className="py-2.5 pl-4 pr-3">
              Zona
            </th>
            <th scope="col" className="px-3 py-2.5 text-right">
              Diferencia
            </th>
            <th scope="col" className="px-3 py-2.5 text-right">
              {comparisonCompanyName}
            </th>
            <th scope="col" className="py-2.5 pl-3 pr-4 text-right">
              {referenceCompanyName}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {zones.map((zone) => {
            const differencePrefix =
              zone.comparisonData.value >= zone.referenceData.value ? '+' : '-'

            return (
              <tr key={zone.id}>
                <td className="py-2.5 pl-4 pr-3 font-medium text-slate-800">
                  {zone.name}
                </td>
                <td className="px-3 py-2.5 text-right font-semibold text-slate-950">
                  {differencePrefix}
                  {differenceFormatter.format(zone.difference)}
                </td>
                <td className="px-3 py-2.5 text-right text-slate-700">
                  {differenceFormatter.format(zone.comparisonData.value)}
                </td>
                <td className="py-2.5 pl-3 pr-4 text-right text-slate-700">
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
