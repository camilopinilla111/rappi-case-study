import type { Database, SqlValue } from 'sql.js'

import { SAMPLE_PRODUCTS } from './SampleProducts'

export class Schema {
  private readonly tableName = 'product'
  private readonly createStatements = [
    `
      CREATE TABLE IF NOT EXISTS product (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price NUMERIC NOT NULL
      );
    `,
  ]
  private readonly insertStatement =
    'INSERT INTO product (id, name, price) VALUES (?, ?, ?)'
  private readonly seedRows: SqlValue[][] = SAMPLE_PRODUCTS.map((product) => [
    product.id,
    product.name,
    product.price,
  ])

  initialize(database: Database) {
    for (const statement of this.createStatements) {
      database.run(statement)
    }

    this.seedIfEmpty(database)
  }

  private seedIfEmpty(database: Database) {
    const result = database.exec(`SELECT COUNT(*) AS count FROM ${this.tableName}`)
    const rowCount = Number(result[0]?.values[0]?.[0] ?? 0)

    if (rowCount > 0) {
      return
    }

    database.run('BEGIN')

    try {
      for (const row of this.seedRows) {
        database.run(this.insertStatement, row)
      }

      database.run('COMMIT')
    } catch (error) {
      database.run('ROLLBACK')
      throw error
    }
  }
}
