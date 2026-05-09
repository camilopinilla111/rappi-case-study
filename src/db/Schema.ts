import type { Database, SqlValue } from 'sql.js'

import { SAMPLE_PRODUCTS } from './SampleProducts'

const SAMPLE_COUNTRIES = [
  {
    id: '79f8c4c0-1fe0-4c8d-8f7d-4d9a934c9f31',
    code: 'co',
  },
  {
    id: '8bf7b8ea-6f67-4b6f-9f62-423cf59e671a',
    code: 'mx',
  },
  {
    id: '4484e4f7-7c05-48cc-aac4-e9ec1b8e9a83',
    code: 'br',
  },
]

const SAMPLE_CITIES = [
  {
    id: 'c7b6d3f2-1f42-4c90-9a58-fc3a70f6e36a',
    name: 'Bogotá',
    countryId: SAMPLE_COUNTRIES[0].id,
  },
  {
    id: '5f2f7c03-44d3-4879-819b-e9e3d3cfc7f4',
    name: 'Ciudad de México',
    countryId: SAMPLE_COUNTRIES[1].id,
  },
  {
    id: 'e8b75c6f-6460-4e32-a286-4571196810c6',
    name: 'São Paulo',
    countryId: SAMPLE_COUNTRIES[2].id,
  },
]

const SAMPLE_ZONE_TYPES = [
  {
    id: '9911d5b0-3581-4f6e-b953-4ab10ee8cc2a',
    code: 'wealthy',
  },
  {
    id: '2ac4a1b4-55f4-459c-8419-21ef8d9d9c86',
    code: 'non_wealthy',
  },
  {
    id: '7e92dd3f-5341-49aa-854a-c97f6b8de67f',
    code: 'mixed',
  },
]

const SAMPLE_ZONE_PRIORIZATIONS = [
  {
    id: 'cba768ac-e5f7-4a23-8b91-db35d8b062cf',
    code: 'high_priority',
  },
  {
    id: '289cbd71-7d19-418c-8d96-8f70416451ed',
    code: 'prioritized',
  },
  {
    id: '96a0fb3a-b674-4329-99f2-92a706c8cfea',
    code: 'not_prioritized',
  },
]

const SAMPLE_ZONES = [
  {
    id: 'ecf81681-dfd1-4f52-964c-d4aa927e4eaf',
    name: 'Chapinero',
    cityId: SAMPLE_CITIES[0].id,
    typeId: SAMPLE_ZONE_TYPES[0].id,
    priorizationId: SAMPLE_ZONE_PRIORIZATIONS[0].id,
  },
  {
    id: 'caea135b-e4db-45e7-93d7-13a488e97604',
    name: 'Usaquén',
    cityId: SAMPLE_CITIES[0].id,
    typeId: SAMPLE_ZONE_TYPES[0].id,
    priorizationId: SAMPLE_ZONE_PRIORIZATIONS[1].id,
  },
  {
    id: 'a5517934-3c2e-47d9-8f7f-483e1023309b',
    name: 'Roma Norte',
    cityId: SAMPLE_CITIES[1].id,
    typeId: SAMPLE_ZONE_TYPES[0].id,
    priorizationId: SAMPLE_ZONE_PRIORIZATIONS[0].id,
  },
  {
    id: '5463f0ea-4f76-4080-aeb8-031399682340',
    name: 'Polanco',
    cityId: SAMPLE_CITIES[1].id,
    typeId: SAMPLE_ZONE_TYPES[0].id,
    priorizationId: SAMPLE_ZONE_PRIORIZATIONS[1].id,
  },
  {
    id: 'f24477cd-cd84-442a-9c1f-ffce61eb9ac8',
    name: 'Pinheiros',
    cityId: SAMPLE_CITIES[2].id,
    typeId: SAMPLE_ZONE_TYPES[0].id,
    priorizationId: SAMPLE_ZONE_PRIORIZATIONS[0].id,
  },
  {
    id: '3de3f7f2-a220-42c5-a63e-8ddb56b51aa3',
    name: 'Vila Mariana',
    cityId: SAMPLE_CITIES[2].id,
    typeId: SAMPLE_ZONE_TYPES[1].id,
    priorizationId: SAMPLE_ZONE_PRIORIZATIONS[2].id,
  },
]

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
      CREATE TABLE IF NOT EXISTS product (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price NUMERIC NOT NULL
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
      name: 'product',
      insertStatement: 'INSERT INTO product (id, name, price) VALUES (?, ?, ?)',
      rows: SAMPLE_PRODUCTS.map((product) => [
        product.id,
        product.name,
        product.price,
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
