import { z } from 'zod'

import type { Product } from './Product'

const sqliteNumericSchema = z
  .union([
    z.number(),
    z.string().regex(/^-?\d+(\.\d+)?$/).transform(Number),
  ])
  .refine((value) => Number.isFinite(value), {
    message: 'Expected a finite numeric value',
  })

export const productRowSchema = z
  .tuple([z.string(), z.string(), sqliteNumericSchema])
  .transform(
    ([id, name, price]): Product => ({
      id,
      name,
      price,
    }),
  )
