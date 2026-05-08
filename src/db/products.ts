import type { DataService } from './DataService'
import { MainDataService } from './MainDataService'
import { ProductRowMapper } from './ProductRowMapper'
import type { Repository } from './Repository'
import { Schema } from './Schema'
import { SqlJsDatabaseConnection } from './SqlJsDatabaseConnection'
import { SqlJsProductsRepository } from './SqlJsProductsRepository'

export type { Product } from './Product'

const databaseConnection = new SqlJsDatabaseConnection(new Schema())

const productRepository: Repository = new SqlJsProductsRepository(
  databaseConnection,
  new ProductRowMapper(),
)

export const dataService: DataService = new MainDataService(productRepository)
