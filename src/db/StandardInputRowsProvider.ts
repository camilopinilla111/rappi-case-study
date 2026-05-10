import { z } from 'zod'

import type { TsvParser } from '../utils/TsvParser'

const countryCodes = ['ec', 'pe', 'cl', 'uy', 'cr', 'co', 'ar', 'mx', 'br'] as const

export type CountryCode = (typeof countryCodes)[number]
export type ZoneType = 'wealthy' | 'mixed' | 'non_wealthy'
export type ZonePrioritization =
  | 'prioritized'
  | 'not_prioritized'
  | 'high_priority'

export type StandardInputRow = {
  company: string
  country: CountryCode
  city: string
  zone: string
  zoneType: ZoneType
  zonePrioritization: ZonePrioritization
  metric: string
  weeksAgoMeasurements: Record<number, number>
}

export interface StandardInputRowsProvider {
  getRows(): StandardInputRow[]
}

const tsvRowSchema = z.object({
  competitor: z.string(),
  country: z.string(),
  city: z.string(),
  zone: z.string(),
  zone_type: z.string(),
  zone_prioritization: z.string(),
  metric: z.string(),
  l0w_roll: z.string(),
  l1w_roll: z.string(),
  l2w_roll: z.string(),
  l3w_roll: z.string(),
  l4w_roll: z.string(),
  l5w_roll: z.string(),
  l6w_roll: z.string(),
  l7w_roll: z.string(),
  l8w_roll: z.string(),
})

type TsvRow = z.infer<typeof tsvRowSchema>

const countryCodeSet = new Set<string>(countryCodes)

const zoneTypeByTsvValue = {
  Wealthy: 'wealthy',
  Mixed: 'mixed',
  'Non-Wealthy': 'non_wealthy',
} satisfies Record<string, ZoneType>

const zonePrioritizationByTsvValue = {
  Prioritized: 'prioritized',
  'Not Prioritized': 'not_prioritized',
  'High Priority': 'high_priority',
} satisfies Record<string, ZonePrioritization>

export class TsvParserStandardInputRowsProvider
  implements StandardInputRowsProvider
{
  constructor(
    private readonly content: string,
    private readonly tsvParser: TsvParser,
  ) {}

  getRows(): StandardInputRow[] {
    return this.tsvParser
      .parse(this.content, tsvRowSchema)
      .map((row, index) => this.mapRow(row, index + 1))
  }

  private mapRow(row: TsvRow, rowNumber: number): StandardInputRow {
    return {
      company: this.getRequiredString(row.competitor, 'competitor', rowNumber),
      country: this.mapCountry(row.country, rowNumber),
      city: this.getRequiredString(row.city, 'city', rowNumber),
      zone: this.getRequiredString(row.zone, 'zone', rowNumber),
      zoneType: this.mapEnumValue(
        row.zone_type,
        zoneTypeByTsvValue,
        'zone_type',
        rowNumber,
      ),
      zonePrioritization: this.mapEnumValue(
        row.zone_prioritization,
        zonePrioritizationByTsvValue,
        'zone_prioritization',
        rowNumber,
      ),
      metric: this.getRequiredString(row.metric, 'metric', rowNumber),
      weeksAgoMeasurements: this.mapMeasurements(row, rowNumber),
    }
  }

  private mapMeasurements(
    row: TsvRow,
    rowNumber: number,
  ): Record<number, number> {
    const measurements: Record<number, number> = {}
    const measurementRows = [
      { weeksAgo: 0, value: row.l0w_roll, fieldName: 'l0w_roll' },
      { weeksAgo: 1, value: row.l1w_roll, fieldName: 'l1w_roll' },
      { weeksAgo: 2, value: row.l2w_roll, fieldName: 'l2w_roll' },
      { weeksAgo: 3, value: row.l3w_roll, fieldName: 'l3w_roll' },
      { weeksAgo: 4, value: row.l4w_roll, fieldName: 'l4w_roll' },
      { weeksAgo: 5, value: row.l5w_roll, fieldName: 'l5w_roll' },
      { weeksAgo: 6, value: row.l6w_roll, fieldName: 'l6w_roll' },
      { weeksAgo: 7, value: row.l7w_roll, fieldName: 'l7w_roll' },
      { weeksAgo: 8, value: row.l8w_roll, fieldName: 'l8w_roll' },
    ]

    for (const measurementRow of measurementRows) {
      const measurement = this.mapMeasurement(
        measurementRow.value,
        measurementRow.fieldName,
        rowNumber,
      )

      if (measurement !== null) {
        measurements[measurementRow.weeksAgo] = measurement
      }
    }

    return measurements
  }

  private getRequiredString(
    value: string,
    fieldName: string,
    rowNumber: number,
  ): string {
    const trimmedValue = value.trim()

    if (trimmedValue === '') {
      throw new Error(`Invalid TSV row ${rowNumber}: ${fieldName} is required.`)
    }

    return trimmedValue
  }

  private mapCountry(value: string, rowNumber: number): CountryCode {
    const country = this.getRequiredString(value, 'country', rowNumber)
      .toLowerCase()

    if (!countryCodeSet.has(country)) {
      throw new Error(
        `Invalid TSV row ${rowNumber}: country must be ${countryCodes.join(', ')}.`,
      )
    }

    return country as CountryCode
  }

  private mapEnumValue<TValue extends string>(
    value: string,
    mapping: Record<string, TValue>,
    fieldName: string,
    rowNumber: number,
  ): TValue {
    const trimmedValue = this.getRequiredString(value, fieldName, rowNumber)
    const mappedValue = mapping[trimmedValue]

    if (mappedValue === undefined) {
      throw new Error(`Invalid TSV row ${rowNumber}: invalid ${fieldName}.`)
    }

    return mappedValue
  }

  private mapMeasurement(
    value: string,
    fieldName: string,
    rowNumber: number,
  ): number | null {
    const trimmedValue = value.trim()

    if (trimmedValue === '') {
      return null
    }

    const measurement = Number(trimmedValue)

    if (!Number.isFinite(measurement)) {
      throw new Error(
        `Invalid TSV row ${rowNumber}: ${fieldName} must be numeric.`,
      )
    }

    return measurement
  }
}
