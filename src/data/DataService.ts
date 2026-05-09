export interface DataService {
  test(): Promise<void>
}

export class MainDataService implements DataService {
  test(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
