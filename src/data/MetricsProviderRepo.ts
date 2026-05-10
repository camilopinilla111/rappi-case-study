import type { SqlValue } from 'sql.js'

import { SqlJsDatabaseConnection } from '../db/SqlJsDatabaseConnection'
import type {
  Id,
  MetricsProviderMeasurement,
  MetricsProviderRepo,
} from './MetricsProvider'

export class SqlMetricsProviderRepo implements MetricsProviderRepo {
  constructor(private readonly databaseConnection: SqlJsDatabaseConnection) {}

  async getMeasurements(
    companyId: Id,
    metricId: Id,
  ): Promise<MetricsProviderMeasurement[]> {
    const database = await this.databaseConnection.getDatabase()
    const result = database.exec(
      `
        SELECT
          id,
          value,
          weeks_ago,
          zone_id
        FROM (
          SELECT
            id,
            value,
            weeks_ago,
            zone_id,
            ROW_NUMBER() OVER (
              PARTITION BY zone_id
              ORDER BY weeks_ago ASC, id ASC
            ) AS measurement_rank
          FROM metric_measurement
          WHERE company_id = ? AND metric_id = ?
        )
        WHERE measurement_rank <= 9
        ORDER BY zone_id ASC, weeks_ago DESC, id ASC
      `,
      [companyId, metricId],
    )

    return (result[0]?.values ?? []).map((row) => this.mapRow(row))
  }

  private mapRow(row: SqlValue[]): MetricsProviderMeasurement {
    const [id, value, weeksAgo, zoneId] = row

    return {
      id: String(id),
      value: Number(value),
      weeksAgo: Number(weeksAgo),
      zoneId: String(zoneId),
    }
  }
}
