import type { FormEvent } from 'react'

import type { Company } from '../data/CompanyRepo'
import type { Metric } from '../data/MetricRepo'
import { SelectField } from '../widgets/SelectField'
import { SubmitButton } from '../widgets/SubmitButton'

type MetricAnalysisFormProps = {
  companies: Company[]
  metrics: Metric[]
  referenceCompanyId: string
  comparisonCompanyId: string
  metricId: string
  isSubmitting: boolean
  isDisabled: boolean
  onReferenceCompanyChange: (value: string) => void
  onComparisonCompanyChange: (value: string) => void
  onMetricChange: (value: string) => void
  onSubmit: () => void
}

export function MetricAnalysisForm({
  companies,
  metrics,
  referenceCompanyId,
  comparisonCompanyId,
  metricId,
  isSubmitting,
  isDisabled,
  onReferenceCompanyChange,
  onComparisonCompanyChange,
  onMetricChange,
  onSubmit,
}: MetricAnalysisFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[1fr_1fr_1fr_auto] md:items-end"
    >
      <SelectField
        id="reference-company"
        label="Compañía de referencia"
        value={referenceCompanyId}
        disabled={isDisabled}
        onChange={onReferenceCompanyChange}
      >
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </SelectField>

      <SelectField
        id="comparison-company"
        label="Compañía de comparación"
        value={comparisonCompanyId}
        disabled={isDisabled}
        onChange={onComparisonCompanyChange}
      >
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </SelectField>

      <SelectField
        id="metric"
        label="Métrica"
        value={metricId}
        disabled={isDisabled}
        onChange={onMetricChange}
      >
        {metrics.map((metric) => (
          <option key={metric.id} value={metric.id}>
            {metric.name}
          </option>
        ))}
      </SelectField>

      <SubmitButton
        isSubmitting={isSubmitting}
        disabled={isDisabled || !referenceCompanyId || !comparisonCompanyId || !metricId}
      />
    </form>
  )
}
