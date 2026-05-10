import type { Database } from 'sql.js'

export class RappiCompanySeeder {
  seed(database: Database) {
    const id = crypto.randomUUID()

    database.run(
      'INSERT OR IGNORE INTO company (id, name) VALUES (?, ?)',
      [id, 'Rappi'],
    )
  }
}
