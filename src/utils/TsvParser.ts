import { parse } from 'papaparse'
import type { z } from 'zod'

export interface TsvParser {
  parse<TSchema extends z.ZodType>(
    content: string,
    schema: TSchema,
  ): z.infer<TSchema>[]
}

export class PapaParseTsvParser implements TsvParser {
  parse<TSchema extends z.ZodType>(
    content: string,
    schema: TSchema,
  ): z.infer<TSchema>[] {
    const parsedContent = parse<Record<string, string>>(content, {
      delimiter: '\t',
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase(),
    })

    if (parsedContent.errors.length > 0) {
      throw new Error(
        `Invalid TSV content: ${parsedContent.errors
          .map((error) => error.message)
          .join('; ')}`,
      )
    }

    return parsedContent.data.map((row, index) => {
      const parsedRow = schema.safeParse(row)

      if (!parsedRow.success) {
        throw new Error(
          `Invalid TSV row ${index + 1}: ${parsedRow.error.issues
            .map((issue) => issue.message)
            .join('; ')}`,
        )
      }

      return parsedRow.data
    })
  }
}
