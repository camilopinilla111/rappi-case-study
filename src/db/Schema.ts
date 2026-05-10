import type { Database, SqlValue } from 'sql.js'

const SAMPLE_COUNTRIES = [
  {
    id: crypto.randomUUID(),
    code: 'co',
  },
  {
    id: crypto.randomUUID(),
    code: 'mx',
  },
  {
    id: crypto.randomUUID(),
    code: 'br',
  },
]

const SAMPLE_CITIES = [
  {
    id: crypto.randomUUID(),
    name: 'Bogotá',
    countryId: SAMPLE_COUNTRIES[0].id,
  },
  {
    id: crypto.randomUUID(),
    name: 'Ciudad de México',
    countryId: SAMPLE_COUNTRIES[1].id,
  },
  {
    id: crypto.randomUUID(),
    name: 'São Paulo',
    countryId: SAMPLE_COUNTRIES[2].id,
  },
]

const SAMPLE_ZONE_TYPES = [
  {
    id: crypto.randomUUID(),
    code: 'wealthy',
  },
  {
    id: crypto.randomUUID(),
    code: 'non_wealthy',
  },
  {
    id: crypto.randomUUID(),
    code: 'mixed',
  },
]

const SAMPLE_ZONE_PRIORIZATIONS = [
  {
    id: crypto.randomUUID(),
    code: 'high_priority',
  },
  {
    id: crypto.randomUUID(),
    code: 'prioritized',
  },
  {
    id: crypto.randomUUID(),
    code: 'not_prioritized',
  },
]

const SAMPLE_ZONES = [
  {
    id: crypto.randomUUID(),
    name: 'Chapinero',
    cityId: SAMPLE_CITIES[0].id,
    typeId: SAMPLE_ZONE_TYPES[0].id,
    priorizationId: SAMPLE_ZONE_PRIORIZATIONS[0].id,
  },
  {
    id: crypto.randomUUID(),
    name: 'Usaquén',
    cityId: SAMPLE_CITIES[0].id,
    typeId: SAMPLE_ZONE_TYPES[0].id,
    priorizationId: SAMPLE_ZONE_PRIORIZATIONS[1].id,
  },
  {
    id: crypto.randomUUID(),
    name: 'Roma Norte',
    cityId: SAMPLE_CITIES[1].id,
    typeId: SAMPLE_ZONE_TYPES[0].id,
    priorizationId: SAMPLE_ZONE_PRIORIZATIONS[0].id,
  },
  {
    id: crypto.randomUUID(),
    name: 'Polanco',
    cityId: SAMPLE_CITIES[1].id,
    typeId: SAMPLE_ZONE_TYPES[0].id,
    priorizationId: SAMPLE_ZONE_PRIORIZATIONS[1].id,
  },
  {
    id: crypto.randomUUID(),
    name: 'Pinheiros',
    cityId: SAMPLE_CITIES[2].id,
    typeId: SAMPLE_ZONE_TYPES[0].id,
    priorizationId: SAMPLE_ZONE_PRIORIZATIONS[0].id,
  },
  {
    id: crypto.randomUUID(),
    name: 'Vila Mariana',
    cityId: SAMPLE_CITIES[2].id,
    typeId: SAMPLE_ZONE_TYPES[1].id,
    priorizationId: SAMPLE_ZONE_PRIORIZATIONS[2].id,
  },
]

const SAMPLE_METRIC_TYPES = [
  {
    id: crypto.randomUUID(),
    code: 'higher_is_better',
  },
  {
    id: crypto.randomUUID(),
    code: 'lower_is_better',
  },
]

const SAMPLE_METRICS = [
  {
    id: crypto.randomUUID(),
    name: 'metrica_1',
    typeId: SAMPLE_METRIC_TYPES[0].id,
  },
  {
    id: crypto.randomUUID(),
    name: 'metrica_2',
    typeId: SAMPLE_METRIC_TYPES[1].id,
  },
]

const SAMPLE_COMPANIES = [
  {
    id: crypto.randomUUID(),
    name: 'company_1',
  },
  {
    id: crypto.randomUUID(),
    name: 'company_2',
  },
]

const SAMPLE_METRIC_MEASUREMENTS = SAMPLE_ZONES.flatMap((zone, zoneIndex) =>
  SAMPLE_METRICS.flatMap((metric, metricIndex) =>
    [2, 1, 0].flatMap((weeksAgo) => {
      const baseValue =
        (zoneIndex + 1) * 10 + (metricIndex + 1) + (2 - weeksAgo) * 0.5

      return SAMPLE_COMPANIES.map((company, companyIndex) => ({
        id: crypto.randomUUID(),
        value: baseValue * (companyIndex + 1),
        weeksAgo,
        zoneId: zone.id,
        metricId: metric.id,
        companyId: company.id,
      }))
    }),
  ),
)

export class Schema {
  private readonly createStatements = [
    `
      CREATE TABLE IF NOT EXISTS country (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE CHECK (code IN ('co', 'mx', 'br'))
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS city (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        country_id TEXT NOT NULL,
        FOREIGN KEY (country_id) REFERENCES country(id)
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS zone_type (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE CHECK (
          code IN ('wealthy', 'non_wealthy', 'mixed')
        )
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS zone_priorization (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE CHECK (
          code IN ('high_priority', 'prioritized', 'not_prioritized')
        )
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS zone (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        city_id TEXT NOT NULL,
        type_id TEXT NOT NULL,
        priorization_id TEXT NOT NULL,
        FOREIGN KEY (city_id) REFERENCES city(id),
        FOREIGN KEY (type_id) REFERENCES zone_type(id),
        FOREIGN KEY (priorization_id) REFERENCES zone_priorization(id)
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS metric_type (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE CHECK (
          code IN ('higher_is_better', 'lower_is_better')
        )
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS metric (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        type_id TEXT NOT NULL,
        FOREIGN KEY (type_id) REFERENCES metric_type(id)
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS company (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS metric_measurement (
        id TEXT PRIMARY KEY,
        value NUMERIC NOT NULL,
        weeks_ago INTEGER NOT NULL,
        zone_id TEXT NOT NULL,
        metric_id TEXT NOT NULL,
        company_id TEXT NOT NULL,
        FOREIGN KEY (zone_id) REFERENCES zone(id),
        FOREIGN KEY (metric_id) REFERENCES metric(id),
        FOREIGN KEY (company_id) REFERENCES company(id)
      );
    `,
  ]
  private readonly seedTables = [
    {
      name: 'country',
      insertStatement: 'INSERT INTO country (id, code) VALUES (?, ?)',
      rows: SAMPLE_COUNTRIES.map((country) => [country.id, country.code]),
    },
    {
      name: 'city',
      insertStatement: 'INSERT INTO city (id, name, country_id) VALUES (?, ?, ?)',
      rows: SAMPLE_CITIES.map((city) => [city.id, city.name, city.countryId]),
    },
    {
      name: 'zone_type',
      insertStatement: 'INSERT INTO zone_type (id, code) VALUES (?, ?)',
      rows: SAMPLE_ZONE_TYPES.map((zoneType) => [zoneType.id, zoneType.code]),
    },
    {
      name: 'zone_priorization',
      insertStatement: 'INSERT INTO zone_priorization (id, code) VALUES (?, ?)',
      rows: SAMPLE_ZONE_PRIORIZATIONS.map((zonePriorization) => [
        zonePriorization.id,
        zonePriorization.code,
      ]),
    },
    {
      name: 'zone',
      insertStatement:
        'INSERT INTO zone (id, name, city_id, type_id, priorization_id) VALUES (?, ?, ?, ?, ?)',
      rows: SAMPLE_ZONES.map((zone) => [
        zone.id,
        zone.name,
        zone.cityId,
        zone.typeId,
        zone.priorizationId,
      ]),
    },
    {
      name: 'metric_type',
      insertStatement: 'INSERT INTO metric_type (id, code) VALUES (?, ?)',
      rows: SAMPLE_METRIC_TYPES.map((metricType) => [
        metricType.id,
        metricType.code,
      ]),
    },
    {
      name: 'metric',
      insertStatement: 'INSERT INTO metric (id, name, type_id) VALUES (?, ?, ?)',
      rows: SAMPLE_METRICS.map((metric) => [
        metric.id,
        metric.name,
        metric.typeId,
      ]),
    },
    {
      name: 'company',
      insertStatement: 'INSERT INTO company (id, name) VALUES (?, ?)',
      rows: SAMPLE_COMPANIES.map((company) => [company.id, company.name]),
    },
    {
      name: 'metric_measurement',
      insertStatement:
        'INSERT INTO metric_measurement (id, value, weeks_ago, zone_id, metric_id, company_id) VALUES (?, ?, ?, ?, ?, ?)',
      rows: SAMPLE_METRIC_MEASUREMENTS.map((metricMeasurement) => [
        metricMeasurement.id,
        metricMeasurement.value,
        metricMeasurement.weeksAgo,
        metricMeasurement.zoneId,
        metricMeasurement.metricId,
        metricMeasurement.companyId,
      ]),
    },
  ]

  initialize(database: Database) {
    database.run('PRAGMA foreign_keys = ON')

    for (const statement of this.createStatements) {
      database.run(statement)
    }

    for (const seedTable of this.seedTables) {
      this.seedIfEmpty(database, seedTable)
    }
  }

  private seedIfEmpty(
    database: Database,
    seedTable: { name: string; insertStatement: string; rows: SqlValue[][] },
  ) {
    const result = database.exec(`SELECT COUNT(*) AS count FROM ${seedTable.name}`)
    const rowCount = Number(result[0]?.values[0]?.[0] ?? 0)

    if (rowCount > 0) {
      return
    }

    database.run('BEGIN')

    try {
      for (const row of seedTable.rows) {
        database.run(seedTable.insertStatement, row)
      }

      database.run('COMMIT')
    } catch (error) {
      database.run('ROLLBACK')
      throw error
    }
  }
}
