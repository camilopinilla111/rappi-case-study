import { MainDataService, type DataService } from '../data/DataService'
import { MetricAnalyzer } from '../data/MetricAnalyzer'
import { SqlMetricAnalyzerRepo } from '../data/MetricAnalyzerRepo'
import { MetricsProvider } from '../data/MetricsProvider'
import { SqlMetricsProviderRepo } from '../data/MetricsProviderRepo'
import { Schema } from '../db/Schema'
import { SqlJsDatabaseConnection } from '../db/SqlJsDatabaseConnection'

const schema = new Schema()
const databaseConnection = new SqlJsDatabaseConnection(schema)

const metricsProviderRepo = new SqlMetricsProviderRepo(databaseConnection)
const metricsProvider = new MetricsProvider(metricsProviderRepo)

const metricAnalyzerRepo = new SqlMetricAnalyzerRepo(databaseConnection)
const metricAnalyzer = new MetricAnalyzer(metricsProvider, metricAnalyzerRepo)

export const dataService: DataService = new MainDataService(metricAnalyzer)
