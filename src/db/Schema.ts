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

const SAMPLE_METRICS = [
  {
    id: '0fce4a03-8f6c-4c62-8a82-cbd5b08e67a2',
    name: 'metrica_1',
  },
  {
    id: '59ce30ea-97d3-4bf6-81f2-305919110da7',
    name: 'metrica_2',
  },
]

const SAMPLE_MEASUREMENT_IDS = [
  '251b7b7a-19e2-4319-8317-151ec64f7548',
  'a05af4a0-2716-431c-b3ab-6d66a4b8420a',
  '0df3e03f-392d-4689-9a18-23eacbb99c2f',
  '7366b31b-977d-4c38-8baa-31c46e490b49',
  'd40ed394-86b5-4ec5-a949-769374270da2',
  '13c17529-4055-4fa8-a80c-711b60fa244b',
  'cb34a5c6-063a-4dd4-aa92-4b5fe7edb5a5',
  '48281432-1c56-456e-a69a-7400f74716ad',
  '16786a8d-07d3-4e80-9c82-e915be731608',
  '86e37cd6-ec71-4b41-b7e7-b15a39e3271c',
  '5591b9cd-8cfd-42ca-8f7d-976436f01b35',
  '2214605f-28b5-4d71-9551-c2bb5dd24c20',
  '42180b1c-697e-48b5-9940-d5936cfce6fb',
  'f2b3763d-631c-457e-bf8a-ff18af01ed34',
  'b3558b33-cebb-4fd9-91ec-bd38880a113b',
  'a6792086-7af7-4a95-bd8e-110e13bdc470',
  '506cc440-0a43-4350-a15e-785cf36c3c66',
  'f07e757f-7729-4d0d-8466-0c6377538bb8',
  'd648f806-f223-496f-9934-aab6434b34b3',
  '8746d5c9-0be4-4e0e-a43f-6a4bd8294db0',
  'a8df3926-7c91-40b7-8536-8b84143043de',
  'c74d13cd-f5d0-42f8-a545-379ac973b9a1',
  'e7c9c286-d913-4712-920d-e669193bfa5c',
  'f8c329a7-cbcf-43c4-88c7-3f36fc949c79',
  '6963e70d-c68d-4dfb-becd-41f7a54af1e8',
  'f46a3b66-8727-455f-8ebb-62df5f2c077f',
  'eb096169-b2ca-4aa0-aa4a-e8efafdfcf98',
  '5502fa66-5f84-4099-bd1a-f252f26c71a1',
  '6655f27f-1731-4d7a-87f5-7fda72c0a5e7',
  '50537709-4b9e-417b-b235-5b35e072e66b',
  'a612d0cf-b1b2-413a-9685-0908916359ea',
  'e3fa2f4b-e8ba-4625-b769-c02504168bfd',
  '703d742f-e611-4842-9b26-e3af00db9f3f',
  '475f2dc7-8ff2-4b24-bbba-6a43cafcb107',
  'c1ce00d9-3403-4f9f-aeb0-196009b45d37',
  '885b0f2f-91bc-4e61-8891-bc50f5d8e284',
]

const SAMPLE_METRIC_MEASUREMENTS = SAMPLE_ZONES.flatMap((zone, zoneIndex) =>
  SAMPLE_METRICS.flatMap((metric, metricIndex) =>
    [2, 1, 0].map((weeksAgo) => {
      const measurementIndex =
        zoneIndex * SAMPLE_METRICS.length * 3 + metricIndex * 3 + (2 - weeksAgo)

      return {
        id: SAMPLE_MEASUREMENT_IDS[measurementIndex],
        value: (zoneIndex + 1) * 10 + (metricIndex + 1) + (2 - weeksAgo) * 0.5,
        weeksAgo,
        zoneId: zone.id,
        metricId: metric.id,
      }
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
      CREATE TABLE IF NOT EXISTS metric (
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
        FOREIGN KEY (zone_id) REFERENCES zone(id),
        FOREIGN KEY (metric_id) REFERENCES metric(id)
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
      name: 'metric',
      insertStatement: 'INSERT INTO metric (id, name) VALUES (?, ?)',
      rows: SAMPLE_METRICS.map((metric) => [metric.id, metric.name]),
    },
    {
      name: 'metric_measurement',
      insertStatement:
        'INSERT INTO metric_measurement (id, value, weeks_ago, zone_id, metric_id) VALUES (?, ?, ?, ?, ?)',
      rows: SAMPLE_METRIC_MEASUREMENTS.map((metricMeasurement) => [
        metricMeasurement.id,
        metricMeasurement.value,
        metricMeasurement.weeksAgo,
        metricMeasurement.zoneId,
        metricMeasurement.metricId,
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
