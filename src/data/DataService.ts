import type { Company, CompanyRepo } from './CompanyRepo'
import type { MetricAnalyzer, Response as MetricAnalyzerResponse } from './MetricAnalyzer'
import type { Metric, MetricRepo } from './MetricRepo'
import type { Id } from './MetricsProvider'

export interface DataService {
  getCompanies(): Promise<Company[]>
  getMetrics(): Promise<Metric[]>
  analyzeMetric(
    referenceCompanyId: Id,
    comparisonCompanyId: Id,
    metricId: Id,
  ): Promise<MetricAnalyzerResponse>
}

export class MainDataService implements DataService {
  constructor(
    private readonly metricAnalyzer: MetricAnalyzer,
    private readonly companyRepo: CompanyRepo,
    private readonly metricRepo: MetricRepo,
  ) {}

  getCompanies(): Promise<Company[]> {
    return this.companyRepo.getCompanies()
  }

  getMetrics(): Promise<Metric[]> {
    return this.metricRepo.getMetrics()
  }

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
