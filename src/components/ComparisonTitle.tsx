import type { ComparisonType } from '../data/MetricAnalyzer'

type ComparisonTitleProps = {
  comparisonType: ComparisonType
}

const comparisonLabels: Record<ComparisonType, string> = {
  higher_than_reference: 'Mayor que la referencia',
  lower_than_reference: 'Menor que la referencia',
}

export function ComparisonTitle({ comparisonType }: ComparisonTitleProps) {
  if (comparisonType === 'lower_than_reference') {
    return null
  }

  return (
    <h2 className="text-xl font-semibold text-slate-950">
      {comparisonLabels[comparisonType]}
    </h2>
  )
}
