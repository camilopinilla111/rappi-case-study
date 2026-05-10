import { z } from 'zod'

import type { TsvParser } from '../utils/TsvParser'

const countryCodes = ['ec', 'pe', 'cl', 'uy', 'cr', 'co', 'ar', 'mx', 'br'] as const

export type CountryCode = (typeof countryCodes)[number]
export type ZoneType = 'wealthy' | 'mixed' | 'non_wealthy'
export type ZonePriorization =
  | 'prioritized'
  | 'not_prioritized'
  | 'high_priority'

export type StandardInputRow = {
  company: string
  country: CountryCode
  city: string
  zone: string
  zoneType: ZoneType
  zonePriorization: ZonePriorization
  metric: string
  weeks_ago_0_measurement: number | null
  weeks_ago_1_measurement: number | null
  weeks_ago_2_measurement: number | null
  weeks_ago_3_measurement: number | null
  weeks_ago_4_measurement: number | null
  weeks_ago_5_measurement: number | null
  weeks_ago_6_measurement: number | null
  weeks_ago_7_measurement: number | null
  weeks_ago_8_measurement: number | null
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
  zone_priorization: z.string(),
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

const zonePriorizationByTsvValue = {
  Prioritized: 'prioritized',
  'Not Prioritized': 'not_prioritized',
  'High Priority': 'high_priority',
} satisfies Record<string, ZonePriorization>

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
      zonePriorization: this.mapEnumValue(
        row.zone_priorization,
        zonePriorizationByTsvValue,
        'zone_priorization',
        rowNumber,
      ),
      metric: this.getRequiredString(row.metric, 'metric', rowNumber),
      weeks_ago_0_measurement: this.mapMeasurement(
        row.l0w_roll,
        'l0w_roll',
        rowNumber,
      ),
      weeks_ago_1_measurement: this.mapMeasurement(
        row.l1w_roll,
        'l1w_roll',
        rowNumber,
      ),
      weeks_ago_2_measurement: this.mapMeasurement(
        row.l2w_roll,
        'l2w_roll',
        rowNumber,
      ),
      weeks_ago_3_measurement: this.mapMeasurement(
        row.l3w_roll,
        'l3w_roll',
        rowNumber,
      ),
      weeks_ago_4_measurement: this.mapMeasurement(
        row.l4w_roll,
        'l4w_roll',
        rowNumber,
      ),
      weeks_ago_5_measurement: this.mapMeasurement(
        row.l5w_roll,
        'l5w_roll',
        rowNumber,
      ),
      weeks_ago_6_measurement: this.mapMeasurement(
        row.l6w_roll,
        'l6w_roll',
        rowNumber,
      ),
      weeks_ago_7_measurement: this.mapMeasurement(
        row.l7w_roll,
        'l7w_roll',
        rowNumber,
      ),
      weeks_ago_8_measurement: this.mapMeasurement(
        row.l8w_roll,
        'l8w_roll',
        rowNumber,
      ),
    }
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
