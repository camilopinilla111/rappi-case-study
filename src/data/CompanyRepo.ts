import type { SqlValue } from 'sql.js'

import { SqlJsDatabaseConnection } from '../db/SqlJsDatabaseConnection'
import type { Id } from './MetricsProvider'

export type Company = {
  id: Id
  name: string
}

export interface CompanyRepo {
  getCompanies(): Promise<Company[]>
}

export class SqlCompanyRepo implements CompanyRepo {
  constructor(private readonly databaseConnection: SqlJsDatabaseConnection) {}

  async getCompanies(): Promise<Company[]> {
    const database = await this.databaseConnection.getDatabase()
    const result = database.exec(
      `
        SELECT id, name
        FROM company
        ORDER BY name ASC
      `,
    )

    return (result[0]?.values ?? []).map((row) => this.mapRow(row))
  }

  private mapRow(row: SqlValue[]): Company {
    const [id, name] = row

    return {
      id: String(id),
      name: String(name),
    }
  }
}
