import type { ProductCatalog } from './ProductCatalog'
import { ProductCatalogService } from './ProductCatalogService'
import type { ProductRepository } from './ProductRepository'
import { ProductRowMapper } from './ProductRowMapper'
import { ProductSchema } from './ProductSchema'
import { ProductSeeder } from './ProductSeeder'
import { SAMPLE_PRODUCTS } from './SampleProducts'
import { SqlJsDatabaseConnection } from './SqlJsDatabaseConnection'
import { SqlJsProductRepository } from './SqlJsProductRepository'

export type { Product } from './Product'

const productSeeder = new ProductSeeder(SAMPLE_PRODUCTS)
const productSchema = new ProductSchema(productSeeder)
const databaseConnection = new SqlJsDatabaseConnection(productSchema)

const productRepository: ProductRepository = new SqlJsProductRepository(
  databaseConnection,
  new ProductRowMapper(),
)

export const productCatalog: ProductCatalog = new ProductCatalogService(
  productRepository,
)
