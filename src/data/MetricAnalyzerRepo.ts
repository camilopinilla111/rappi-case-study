import { z } from 'zod'

import { SqlJsDatabaseConnection } from '../db/SqlJsDatabaseConnection'
import type { Id } from './MetricsProvider'
import type { MetricAnalyzerRepo, MetricType } from './MetricAnalyzer'

const metricTypeSchema = z.enum(['higher_is_better', 'lower_is_better'])

export class SqlMetricAnalyzerRepo implements MetricAnalyzerRepo {
  constructor(private readonly databaseConnection: SqlJsDatabaseConnection) {}

  async getMetricType(metricId: Id): Promise<MetricType> {
    const database = await this.databaseConnection.getDatabase()
    const result = database.exec(
      `
        SELECT metric_type.code
        FROM metric
        INNER JOIN metric_type ON metric_type.id = metric.type_id
        WHERE metric.id = ?
      `,
      [metricId],
    )
    const code = result[0]?.values[0]?.[0]
    const metricType = metricTypeSchema.safeParse(code)

    if (!metricType.success) {
      throw new Error(`Metric type not found for metric ${metricId}.`)
    }

    return metricType.data
  }

  async getZoneNames(zoneIds: Id[]): Promise<Map<Id, string>> {
    if (zoneIds.length === 0) {
      return new Map()
    }

    const database = await this.databaseConnection.getDatabase()
    const placeholders = zoneIds.map(() => '?').join(', ')
    const result = database.exec(
      `
        SELECT id, name
        FROM zone
        WHERE id IN (${placeholders})
      `,
      zoneIds,
    )

    return new Map(
      (result[0]?.values ?? []).map((row) => {
        const [id, name] = row

        return [String(id), String(name)]
      }),
    )
  }

}
