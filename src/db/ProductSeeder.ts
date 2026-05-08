import type { Database } from 'sql.js'

import type { Product } from './Product'

export class ProductSeeder {
  constructor(private readonly products: Product[]) {}

  seedIfEmpty(database: Database) {
    const result = database.exec('SELECT COUNT(*) AS count FROM product')
    const productCount = Number(result[0]?.values[0]?.[0] ?? 0)

    if (productCount > 0) {
      return
    }

    database.run('BEGIN')

    try {
      for (const product of this.products) {
        database.run(
          'INSERT INTO product (id, name, price) VALUES (?, ?, ?)',
          [product.id, product.name, product.price],
        )
      }

      database.run('COMMIT')
    } catch (error) {
      database.run('ROLLBACK')
      throw error
    }
  }
}
