import type { Product } from './Product'

export interface ProductCatalog {
  loadProducts(): Promise<Product[]>
}
