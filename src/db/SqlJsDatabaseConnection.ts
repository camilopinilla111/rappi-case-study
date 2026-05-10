import initSqlJs, { type Database } from 'sql.js'
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url'

import type { AdvantagesInputRowsSeeder } from './AdvantagesInputRowsSeeder'
import type { RappiCompanySeeder } from './RappiCompanySeeder'
import { Schema } from './Schema'
import type { StandardInputRowsSeeder } from './StandardInputRowsSeeder'

export class SqlJsDatabaseConnection {
  private databasePromise: Promise<Database> | null = null

  constructor(
    private readonly schema: Schema,
    private readonly rappiCompanySeeder: RappiCompanySeeder,
    private readonly standardInputRowsSeeder: StandardInputRowsSeeder,
    private readonly advantagesInputRowsSeeder: AdvantagesInputRowsSeeder,
  ) {}

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
    this.rappiCompanySeeder.seed(database)
    this.standardInputRowsSeeder.seed(database)
    this.advantagesInputRowsSeeder.seed(database)

    return database
  }
}
