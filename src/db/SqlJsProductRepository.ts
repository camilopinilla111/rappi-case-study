import type { Product } from './Product'
import type { ProductRepository } from './ProductRepository'
import { ProductRowMapper } from './ProductRowMapper'
import { SqlJsDatabaseConnection } from './SqlJsDatabaseConnection'

export class SqlJsProductRepository implements ProductRepository {
  constructor(
    private readonly connection: SqlJsDatabaseConnection,
    private readonly mapper: ProductRowMapper,
  ) {}

  async list(): Promise<Product[]> {
    const database = await this.connection.getDatabase()
    const result = database.exec(`
      SELECT id, name, price
      FROM product
      ORDER BY name ASC
    `)
    const rows = result[0]?.values ?? []

    return rows.map((row) => this.mapper.toProduct(row))
  }
}
