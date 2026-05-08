import initSqlJs, { type Database } from 'sql.js'
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url'

import { ProductSchema } from './ProductSchema'

export class SqlJsDatabaseConnection {
  private databasePromise: Promise<Database> | null = null

  constructor(private readonly schema: ProductSchema) {}

  getDatabase(): Promise<Database> {
    this.databasePromise ??= this.createDatabase().catch((error: unknown) => {
      this.databasePromise = null
      throw error
    })

    return this.databasePromise
  }

  private async createDatabase(): Promise<Database> {
    const sql = await initSqlJs({
      locateFile: () => sqlWasmUrl,
    })
    const database = new sql.Database()

    this.schema.initialize(database)

    return database
  }
}
