import type { SqlValue } from 'sql.js'

import { SqlJsDatabaseConnection } from '../db/SqlJsDatabaseConnection'
import type { Id } from './MetricsProvider'

export type Metric = {
  id: Id
  name: string
}

export interface MetricRepo {
  getMetrics(): Promise<Metric[]>
}

export class SqlMetricRepo implements MetricRepo {
  constructor(private readonly databaseConnection: SqlJsDatabaseConnection) {}

  async getMetrics(): Promise<Metric[]> {
    const database = await this.databaseConnection.getDatabase()
    const result = database.exec(
      `
        SELECT id, name
        FROM metric
        ORDER BY name ASC
      `,
    )

    return (result[0]?.values ?? []).map((row) => this.mapRow(row))
  }

  private mapRow(row: SqlValue[]): Metric {
    const [id, name] = row

    return {
      id: String(id),
      name: String(name),
    }
  }
}
