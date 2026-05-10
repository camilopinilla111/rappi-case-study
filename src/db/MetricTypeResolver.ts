import type { MetricType } from '../data/MetricAnalyzer'

const metricTypesByMetricName: Record<string, MetricType> = {
  'Retail SST > SS CVR': 'higher_is_better',
  'Restaurants SST > SS CVR': 'higher_is_better',
  'Delivery Fee (MXN)': 'lower_is_better',
  'Service Fee (%)': 'lower_is_better',
  'Avg Delivery Time (mins)': 'lower_is_better',
  'Customer Satisfaction Score': 'higher_is_better',
}

export class MetricTypeResolver {
  getMetricType(metricName: string): MetricType | null {
    return metricTypesByMetricName[metricName] ?? null
  }
}
