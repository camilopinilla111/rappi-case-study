import type { MetricType } from '../data/MetricAnalyzer'

const metricTypesByMetricName: Record<string, MetricType> = {}

export class MetricTypeResolver {
  getMetricType(metricName: string): MetricType | null {
    return metricTypesByMetricName[metricName] ?? null
  }
}
