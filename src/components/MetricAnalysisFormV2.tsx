import type { FormEvent, ReactNode } from 'react'

import type { Company } from '../data/CompanyRepo'
import type { Metric } from '../data/MetricRepo'
import { SubmitButton } from '../widgets/SubmitButton'

type MetricAnalysisFormV2Props = {
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

type InlineSelectProps = {
  id: string
  ariaLabel: string
  value: string
  disabled: boolean
  selectedLabel: string
  children: ReactNode
  onChange: (value: string) => void
}

const metricDisplayNames: Record<string, string> = {
  'Avg Delivery Time (mins)': 'tiempo de entrega',
  'Customer Satisfaction Score': 'satisfacción del cliente',
  'Delivery Fee (MXN)': 'tarifa de envío',
  'Restaurants SST > SS CVR': 'conversión en restaurantes',
  'Retail SST > SS CVR': 'conversión en retail',
  'Service Fee (%)': 'tarifa de servicio',
}

function getMetricDisplayName(metric: Metric): string {
  return metricDisplayNames[metric.name] ?? metric.name
}

function InlineSelect({
  id,
  ariaLabel,
  value,
  disabled,
  selectedLabel,
  children,
  onChange,
}: InlineSelectProps) {
  const widthLabel = selectedLabel || ariaLabel

  return (
    <span className="relative inline-block min-w-0 max-w-full align-middle">
      <span
        aria-hidden="true"
        className="block min-h-10 max-w-full overflow-hidden whitespace-pre rounded-full border border-transparent px-4 py-2 text-base font-semibold"
      >
        {widthLabel}
      </span>
      <select
        id={id}
        aria-label={ariaLabel}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="absolute inset-0 h-full w-full appearance-none truncate rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-base font-semibold text-emerald-950 shadow-sm outline-none transition hover:border-emerald-300 hover:bg-emerald-100 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500"
      >
        {children}
      </select>
    </span>
  )
}

export function MetricAnalysisFormV2({
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
}: MetricAnalysisFormV2Props) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }

  const referenceCompanyName =
    companies.find((company) => company.id === referenceCompanyId)?.name ?? ''
  const comparisonCompanyName =
    companies.find((company) => company.id === comparisonCompanyId)?.name ?? ''
  const metricName =
    metrics.find((metric) => metric.id === metricId)?.name ?? ''
  const metricDisplayName = metricDisplayNames[metricName] ?? metricName

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full min-w-0 flex-col gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-3 text-lg font-medium leading-[2.75rem] text-slate-950">
        <span>¿En cuáles zonas tiene</span>
        <InlineSelect
          id="comparison-company"
          ariaLabel="Compañía de comparación"
          value={comparisonCompanyId}
          disabled={isDisabled}
          selectedLabel={comparisonCompanyName}
          onChange={onComparisonCompanyChange}
        >
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </InlineSelect>
        <span>una ventaja competitiva sobre</span>
        <InlineSelect
          id="reference-company"
          ariaLabel="Compañía de referencia"
          value={referenceCompanyId}
          disabled={isDisabled}
          selectedLabel={referenceCompanyName}
          onChange={onReferenceCompanyChange}
        >
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </InlineSelect>
        <span>en</span>
        <span className="inline-flex min-w-0 max-w-full items-center gap-x-2">
          <InlineSelect
            id="metric"
            ariaLabel="Métrica"
            value={metricId}
            disabled={isDisabled}
            selectedLabel={metricDisplayName}
            onChange={onMetricChange}
          >
            {metrics.map((metric) => (
              <option key={metric.id} value={metric.id}>
                {getMetricDisplayName(metric)}
              </option>
            ))}
          </InlineSelect>
          <span>?</span>
        </span>
      </div>

      <div className="self-start xl:self-end">
        <SubmitButton
          isSubmitting={isSubmitting}
          disabled={
            isDisabled || !referenceCompanyId || !comparisonCompanyId || !metricId
          }
        />
      </div>
    </form>
  )
}
