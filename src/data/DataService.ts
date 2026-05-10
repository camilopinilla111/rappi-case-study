import type { MetricAnalyzer, Response as MetricAnalyzerResponse } from './MetricAnalyzer'
import type { Id } from './MetricsProvider'

export interface DataService {
  analyzeMetric(
    referenceCompanyId: Id,
    comparisonCompanyId: Id,
    metricId: Id,
  ): Promise<MetricAnalyzerResponse>
}

export class MainDataService implements DataService {
  constructor(private readonly metricAnalyzer: MetricAnalyzer) {}

  analyzeMetric(
    referenceCompanyId: Id,
    comparisonCompanyId: Id,
    metricId: Id,
  ): Promise<MetricAnalyzerResponse> {
    return this.metricAnalyzer.analyze(
      referenceCompanyId,
      comparisonCompanyId,
      metricId,
    )
  }
}
