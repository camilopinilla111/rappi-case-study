import type { Product } from './Product'

export interface DataService {
  loadProducts(): Promise<Product[]>
}
