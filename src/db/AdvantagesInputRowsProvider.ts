import { z } from 'zod'

import type { TsvParser } from '../utils/TsvParser'

export type AdvantagesInputRow = {
  competitor: string
  zone: string
  metric: string
  advantage: number
}

export interface AdvantagesInputRowsProvider {
  getRows(): AdvantagesInputRow[]
}

const tsvRowSchema = z.object({
  competitor: z.string(),
  zone: z.string(),
  metric: z.string(),
  advantage_percentage: z.string(),
})

type TsvRow = z.infer<typeof tsvRowSchema>

export class TsvParserAdvantagesInputRowsProvider
  implements AdvantagesInputRowsProvider
{
  constructor(
    private readonly content: string,
    private readonly tsvParser: TsvParser,
  ) {}

  getRows(): AdvantagesInputRow[] {
    return this.tsvParser
      .parse(this.content, tsvRowSchema)
      .map((row, index) => this.mapRow(row, index + 1))
  }

  private mapRow(row: TsvRow, rowNumber: number): AdvantagesInputRow {
    return {
      competitor: this.getRequiredString(
        row.competitor,
        'competitor',
        rowNumber,
      ),
      zone: this.getRequiredString(row.zone, 'zone', rowNumber),
      metric: this.getRequiredString(row.metric, 'metric', rowNumber),
      advantage: this.mapAdvantage(row.advantage_percentage, rowNumber),
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

  private mapAdvantage(value: string, rowNumber: number): number {
    const trimmedValue = this.getRequiredString(
      value,
      'advantage_percentage',
      rowNumber,
    )
    const advantagePercentage = Number(trimmedValue)

    if (!Number.isFinite(advantagePercentage)) {
      throw new Error(
        `Invalid TSV row ${rowNumber}: advantage_percentage must be numeric.`,
      )
    }

    return advantagePercentage / 100
  }
}
