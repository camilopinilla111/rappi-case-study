import rowsContent from '../data/rows.tsv?raw'

const tsvContentByFileName = {
  rows: rowsContent,
}

export type TsvFileName = keyof typeof tsvContentByFileName

export class TsvFileReader {
  read(fileName: TsvFileName): string {
    return tsvContentByFileName[fileName]
  }
}
