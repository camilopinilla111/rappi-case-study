import type { Product } from './Product'

export interface ProductRepository {
  list(): Promise<Product[]>
}
