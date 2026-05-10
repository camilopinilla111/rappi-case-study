import advantagesContent from '../data/raw/advantages.tsv?raw'
import rowsContent from '../data/raw/rows.tsv?raw'

const tsvContentByFileName = {
  advantages: advantagesContent,
  rows: rowsContent,
}

export type TsvFileName = keyof typeof tsvContentByFileName

export class TsvFileReader {
  read(fileName: TsvFileName): string {
    return tsvContentByFileName[fileName]
  }
}
