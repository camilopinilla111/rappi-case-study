import type { Database } from 'sql.js'

import { ProductSeeder } from './ProductSeeder'

export class ProductSchema {
  constructor(private readonly seeder: ProductSeeder) {}

  initialize(database: Database) {
    database.run(`
      CREATE TABLE IF NOT EXISTS product (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price NUMERIC NOT NULL
      );
    `)

    this.seeder.seedIfEmpty(database)
  }
}
