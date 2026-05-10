import type { Database, SqlValue } from 'sql.js'

import { MetricTypeResolver } from './MetricTypeResolver'
import type {
  StandardInputRow,
  StandardInputRowsProvider,
} from './StandardInputRowsProvider'

const measurementColumns = [
  { weeksAgo: 0, key: 'weeksAgo0Measurement' },
  { weeksAgo: 1, key: 'weeksAgo1Measurement' },
  { weeksAgo: 2, key: 'weeksAgo2Measurement' },
  { weeksAgo: 3, key: 'weeksAgo3Measurement' },
  { weeksAgo: 4, key: 'weeksAgo4Measurement' },
  { weeksAgo: 5, key: 'weeksAgo5Measurement' },
  { weeksAgo: 6, key: 'weeksAgo6Measurement' },
  { weeksAgo: 7, key: 'weeksAgo7Measurement' },
  { weeksAgo: 8, key: 'weeksAgo8Measurement' },
] as const

export class StandardInputRowsSeeder {
  private readonly metricTypeResolver = new MetricTypeResolver()

  constructor(private readonly providers: StandardInputRowsProvider[]) {}

  seed(database: Database) {
    const rows = this.providers.flatMap((provider) => provider.getRows())

    database.run('BEGIN')

    try {
      for (const row of rows) {
        this.seedRow(database, row)
      }

      database.run('COMMIT')
    } catch (error) {
      database.run('ROLLBACK')
      throw error
    }
  }

  private seedRow(database: Database, row: StandardInputRow) {
    const companyId = this.getOrCreateCompany(database, row.company)
    const countryId = this.getOrCreateCountry(database, row.country)
    const cityId = this.getOrCreateCity(database, row.city, countryId)
    const zoneId = this.getOrCreateZone(database, row, cityId)
    const metricId = this.getOrCreateMetric(database, row.metric)

    this.seedMeasurements(database, row, {
      companyId,
      metricId,
      zoneId,
    })
  }

  private getOrCreateCompany(database: Database, name: string): string {
    const existingId = this.getFirstId(
      database,
      'SELECT id FROM company WHERE name = ? LIMIT 1',
      [name],
    )

    if (existingId) {
      return existingId
    }

    const id = crypto.randomUUID()
    database.run('INSERT INTO company (id, name) VALUES (?, ?)', [id, name])

    return id
  }

  private getOrCreateCountry(database: Database, code: string): string {
    const existingId = this.getFirstId(
      database,
      'SELECT id FROM country WHERE code = ? LIMIT 1',
      [code],
    )

    if (existingId) {
      return existingId
    }

    const id = crypto.randomUUID()
    database.run('INSERT INTO country (id, code) VALUES (?, ?)', [id, code])

    return id
  }

  private getOrCreateCity(
    database: Database,
    name: string,
    countryId: string,
  ): string {
    const existingId = this.getFirstId(
      database,
      'SELECT id FROM city WHERE name = ? AND country_id = ? LIMIT 1',
      [name, countryId],
    )

    if (existingId) {
      return existingId
    }

    const id = crypto.randomUUID()
    database.run('INSERT INTO city (id, name, country_id) VALUES (?, ?, ?)', [
      id,
      name,
      countryId,
    ])

    return id
  }

  private getOrCreateZone(
    database: Database,
    row: StandardInputRow,
    cityId: string,
  ): string {
    const existingId = this.getFirstId(
      database,
      'SELECT id FROM zone WHERE name = ? AND city_id = ? LIMIT 1',
      [row.zone, cityId],
    )

    if (existingId) {
      return existingId
    }

    const typeId = this.getOrCreateZoneType(database, row.zoneType)
    const priorizationId = this.getOrCreateZonePriorization(
      database,
      row.zonePriorization,
    )
    const id = crypto.randomUUID()

    database.run(
      'INSERT INTO zone (id, name, city_id, type_id, priorization_id) VALUES (?, ?, ?, ?, ?)',
      [id, row.zone, cityId, typeId, priorizationId],
    )

    return id
  }

  private getOrCreateZoneType(database: Database, code: string): string {
    const existingId = this.getFirstId(
      database,
      'SELECT id FROM zone_type WHERE code = ? LIMIT 1',
      [code],
    )

    if (existingId) {
      return existingId
    }

    const id = crypto.randomUUID()
    database.run('INSERT INTO zone_type (id, code) VALUES (?, ?)', [id, code])

    return id
  }

  private getOrCreateZonePriorization(
    database: Database,
    code: string,
  ): string {
    const existingId = this.getFirstId(
      database,
      'SELECT id FROM zone_priorization WHERE code = ? LIMIT 1',
      [code],
    )

    if (existingId) {
      return existingId
    }

    const id = crypto.randomUUID()
    database.run('INSERT INTO zone_priorization (id, code) VALUES (?, ?)', [
      id,
      code,
    ])

    return id
  }

  private getOrCreateMetric(database: Database, name: string): string {
    const existingId = this.getFirstId(
      database,
      'SELECT id FROM metric WHERE name = ? LIMIT 1',
      [name],
    )

    if (existingId) {
      return existingId
    }

    const metricType = this.metricTypeResolver.getMetricType(name)

    if (metricType === null) {
      throw new Error(`Metric type not found for metric "${name}".`)
    }

    const typeId = this.getOrCreateMetricType(database, metricType)
    const id = crypto.randomUUID()

    database.run('INSERT INTO metric (id, name, type_id) VALUES (?, ?, ?)', [
      id,
      name,
      typeId,
    ])

    return id
  }

  private getOrCreateMetricType(database: Database, code: string): string {
    const existingId = this.getFirstId(
      database,
      'SELECT id FROM metric_type WHERE code = ? LIMIT 1',
      [code],
    )

    if (existingId) {
      return existingId
    }

    const id = crypto.randomUUID()
    database.run('INSERT INTO metric_type (id, code) VALUES (?, ?)', [id, code])

    return id
  }

  private seedMeasurements(
    database: Database,
    row: StandardInputRow,
    ids: {
      companyId: string
      metricId: string
      zoneId: string
    },
  ) {
    for (const column of measurementColumns) {
      const value = row[column.key]

      if (value === null) {
        continue
      }

      database.run(
        'INSERT INTO metric_measurement (id, value, weeks_ago, zone_id, metric_id, company_id) VALUES (?, ?, ?, ?, ?, ?)',
        [
          crypto.randomUUID(),
          value,
          column.weeksAgo,
          ids.zoneId,
          ids.metricId,
          ids.companyId,
        ],
      )
    }
  }

  private getFirstId(
    database: Database,
    statement: string,
    params: SqlValue[],
  ): string | null {
    const result = database.exec(statement, params)
    const id = result[0]?.values[0]?.[0]

    if (id === undefined || id === null) {
      return null
    }

    return String(id)
  }
}
