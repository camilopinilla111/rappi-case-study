import type { Product } from './Product'
import { ProductRowMapper } from './ProductRowMapper'
import type { Repository } from './Repository'
import { SqlJsDatabaseConnection } from './SqlJsDatabaseConnection'

export class SqlJsProductsRepository implements Repository {
  constructor(
    private readonly connection: SqlJsDatabaseConnection,
    private readonly mapper: ProductRowMapper,
  ) {}

  async listProducts(): Promise<Product[]> {
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
