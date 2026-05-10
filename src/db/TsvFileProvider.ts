export class TsvFileProvider {
  async getTsvFile(fileName: string): Promise<string> {
    const response = await fetch(`/data/${fileName}.tsv`)

    if (response.status === 404) {
      throw new Error(`TSV file not found: ${fileName}.`)
    }

    if (!response.ok) {
      throw new Error(
        `Failed to fetch TSV file "${fileName}": ${response.status} ${response.statusText}.`,
      )
    }

    return response.text()
  }
}
