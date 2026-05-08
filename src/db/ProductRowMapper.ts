import type { SqlValue } from 'sql.js'

import type { Product } from './Product'
import { productRowSchema } from './ProductRowSchema'

export class ProductRowMapper {
  toProduct(row: SqlValue[]): Product {
    return productRowSchema.parse(row)
  }
}
