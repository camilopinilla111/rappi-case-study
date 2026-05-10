import type { Database } from 'sql.js'

export class Schema {
  private readonly createStatements = [
    `
      CREATE TABLE IF NOT EXISTS country (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE CHECK (
          code IN ('ec', 'pe', 'cl', 'uy', 'cr', 'co', 'ar', 'mx', 'br')
        )
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS city (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        country_id TEXT NOT NULL,
        FOREIGN KEY (country_id) REFERENCES country(id)
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS zone_type (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE CHECK (
          code IN ('wealthy', 'non_wealthy', 'mixed')
        )
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS zone_prioritization (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE CHECK (
          code IN ('high_priority', 'prioritized', 'not_prioritized')
        )
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS zone (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        city_id TEXT NOT NULL,
        type_id TEXT NOT NULL,
        prioritization_id TEXT NOT NULL,
        FOREIGN KEY (city_id) REFERENCES city(id),
        FOREIGN KEY (type_id) REFERENCES zone_type(id),
        FOREIGN KEY (prioritization_id) REFERENCES zone_prioritization(id)
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS metric_type (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE CHECK (
          code IN ('higher_is_better', 'lower_is_better')
        )
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS metric (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        type_id TEXT NOT NULL,
        FOREIGN KEY (type_id) REFERENCES metric_type(id)
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS company (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS metric_measurement (
        id TEXT PRIMARY KEY,
        value NUMERIC NOT NULL,
        weeks_ago INTEGER NOT NULL,
        zone_id TEXT NOT NULL,
        metric_id TEXT NOT NULL,
        company_id TEXT NOT NULL,
        FOREIGN KEY (zone_id) REFERENCES zone(id),
        FOREIGN KEY (metric_id) REFERENCES metric(id),
        FOREIGN KEY (company_id) REFERENCES company(id)
      );
    `,
  ]

  initialize(database: Database) {
    database.run('PRAGMA foreign_keys = ON')

    for (const statement of this.createStatements) {
      database.run(statement)
    }
  }
}
