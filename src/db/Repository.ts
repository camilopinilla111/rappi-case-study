import type { Product } from './Product'

export interface Repository {
  listProducts(): Promise<Product[]>
}
