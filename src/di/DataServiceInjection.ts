import { SqlCompanyRepo } from '../data/CompanyRepo'
import { MainDataService, type DataService } from '../data/DataService'
import { MetricAnalyzer } from '../data/MetricAnalyzer'
import { SqlMetricAnalyzerRepo } from '../data/MetricAnalyzerRepo'
import { SqlMetricRepo } from '../data/MetricRepo'
import { MetricsProvider } from '../data/MetricsProvider'
import { SqlMetricsProviderRepo } from '../data/MetricsProviderRepo'
import { SamplesSeeder } from '../db/SamplesSeeder'
import { Schema } from '../db/Schema'
import { SqlJsDatabaseConnection } from '../db/SqlJsDatabaseConnection'

const schema = new Schema()
const samplesSeeder = new SamplesSeeder()
const databaseConnection = new SqlJsDatabaseConnection(schema, samplesSeeder)

const metricsProviderRepo = new SqlMetricsProviderRepo(databaseConnection)
const metricsProvider = new MetricsProvider(metricsProviderRepo)

const metricAnalyzerRepo = new SqlMetricAnalyzerRepo(databaseConnection)
const metricAnalyzer = new MetricAnalyzer(metricsProvider, metricAnalyzerRepo)

const companyRepo = new SqlCompanyRepo(databaseConnection)
const metricRepo = new SqlMetricRepo(databaseConnection)

export const dataService: DataService = new MainDataService(
  metricAnalyzer,
  companyRepo,
  metricRepo,
)
