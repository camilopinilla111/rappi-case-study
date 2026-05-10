import type { Response as MetricAnalysisResponse } from '../data/MetricAnalyzer'
import { ComparisonTitle } from './ComparisonTitle'
import { ZoneDifferenceList } from './ZoneDifferenceList'

type AnalysisResultProps = {
  result: MetricAnalysisResponse | null
  error: string | null
}

export function AnalysisResult({ result, error }: AnalysisResultProps) {
  if (error) {
    return (
      <section className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-800">
        {error}
      </section>
    )
  }

  if (!result) {
    return null
  }

  if (result.zones.length === 0) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <ComparisonTitle comparisonType={result.comparisonType} />
        <p className="mt-3 text-sm text-slate-600">
          No hay zonas con diferencia para esta comparación.
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <ComparisonTitle comparisonType={result.comparisonType} />
      <div className="mt-4">
        <ZoneDifferenceList zones={result.zones} />
      </div>
    </section>
  )
}
