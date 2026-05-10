import { useEffect, useState } from 'react'

import { dataService as defaultDataService } from '../di/DataServiceInjection'
import type { Company } from '../data/CompanyRepo'
import type { DataService } from '../data/DataService'
import type { Response as MetricAnalysisResponse } from '../data/MetricAnalyzer'
import type { Metric } from '../data/MetricRepo'
import { AnalysisResult } from '../components/AnalysisResult'
import { MetricAnalysisForm } from '../components/MetricAnalysisForm'

type AnalyticsScreenProps = {
  dataService?: DataService
}

export function AnalyticsScreen({
  dataService = defaultDataService,
}: AnalyticsScreenProps) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [referenceCompanyId, setReferenceCompanyId] = useState('')
  const [comparisonCompanyId, setComparisonCompanyId] = useState('')
  const [metricId, setMetricId] = useState('')
  const [result, setResult] = useState<MetricAnalysisResponse | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let isActive = true

    async function loadReferenceData() {
      try {
        const [loadedCompanies, loadedMetrics] = await Promise.all([
          dataService.getCompanies(),
          dataService.getMetrics(),
        ])

        if (!isActive) {
          return
        }

        setCompanies(loadedCompanies)
        setMetrics(loadedMetrics)
        setReferenceCompanyId(loadedCompanies[0]?.id ?? '')
        setComparisonCompanyId(loadedCompanies[1]?.id ?? loadedCompanies[0]?.id ?? '')
        setMetricId(loadedMetrics[0]?.id ?? '')
      } catch {
        if (isActive) {
          setLoadError('No fue posible cargar las compañías y métricas.')
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadReferenceData()

    return () => {
      isActive = false
    }
  }, [dataService])

  const handleSubmit = async () => {
    if (!referenceCompanyId || !comparisonCompanyId || !metricId) {
      return
    }

    setIsSubmitting(true)
    setAnalysisError(null)
    setResult(null)

    try {
      const analysis = await dataService.analyzeMetric(
        referenceCompanyId,
        comparisonCompanyId,
        metricId,
      )
      setResult(analysis)
    } catch {
      setAnalysisError('No fue posible analizar la métrica seleccionada.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormDisabled = isLoading || isSubmitting || Boolean(loadError)

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-normal text-slate-950">
            Análisis de métricas
          </h1>
        </header>

        {loadError ? (
          <section className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-800">
            {loadError}
          </section>
        ) : (
          <MetricAnalysisForm
            companies={companies}
            metrics={metrics}
            referenceCompanyId={referenceCompanyId}
            comparisonCompanyId={comparisonCompanyId}
            metricId={metricId}
            isSubmitting={isSubmitting}
            isDisabled={isFormDisabled}
            onReferenceCompanyChange={setReferenceCompanyId}
            onComparisonCompanyChange={setComparisonCompanyId}
            onMetricChange={setMetricId}
            onSubmit={handleSubmit}
          />
        )}

        {isLoading ? (
          <section className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
            Cargando compañías y métricas...
          </section>
        ) : (
          <AnalysisResult result={result} error={analysisError} />
        )}
      </div>
    </main>
  )
}
