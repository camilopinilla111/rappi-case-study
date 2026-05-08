import type { DataService } from './DataService'
import type { Product } from './Product'
import type { Repository } from './Repository'

export class MainDataService implements DataService {
  constructor(private readonly products: Repository) {}

  loadProducts(): Promise<Product[]> {
    return this.products.listProducts()
  }
}
