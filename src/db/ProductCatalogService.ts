import type { Product } from './Product'
import type { ProductCatalog } from './ProductCatalog'
import type { ProductRepository } from './ProductRepository'

export class ProductCatalogService implements ProductCatalog {
  constructor(private readonly products: ProductRepository) {}

  loadProducts(): Promise<Product[]> {
    return this.products.list()
  }
}
