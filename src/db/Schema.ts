import type { Database, SqlValue } from 'sql.js'

import { SAMPLE_PRODUCTS } from './SampleProducts'

const SAMPLE_COUNTRIES: SqlValue[][] = [
  ['79f8c4c0-1fe0-4c8d-8f7d-4d9a934c9f31', 'CO'],
  ['8bf7b8ea-6f67-4b6f-9f62-423cf59e671a', 'MX'],
  ['4484e4f7-7c05-48cc-aac4-e9ec1b8e9a83', 'BR'],
]

const SAMPLE_CITIES: SqlValue[][] = [
  ['c7b6d3f2-1f42-4c90-9a58-fc3a70f6e36a', 'Bogotá', SAMPLE_COUNTRIES[0][0]],
  [
    '5f2f7c03-44d3-4879-819b-e9e3d3cfc7f4',
    'Ciudad de México',
    SAMPLE_COUNTRIES[1][0],
  ],
  ['e8b75c6f-6460-4e32-a286-4571196810c6', 'São Paulo', SAMPLE_COUNTRIES[2][0]],
]

export class Schema {
  private readonly createStatements = [
    `
      CREATE TABLE IF NOT EXISTS country (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE
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
      rows: SAMPLE_COUNTRIES,
    },
    {
      name: 'city',
      insertStatement: 'INSERT INTO city (id, name, country_id) VALUES (?, ?, ?)',
      rows: SAMPLE_CITIES,
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
