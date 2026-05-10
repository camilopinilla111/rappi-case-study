export type Id = string

export type Measurement = {
  id: Id
  value: number
  weeksAgo: number
}

export type Zone = {
  id: Id
  average: number
  measurements: Measurement[]
}

export type MetricsProviderMeasurement = Measurement & {
  zoneId: Id
}

export interface MetricsProviderRepo {
  getMeasurements(
    companyId: Id,
    metricId: Id,
  ): Promise<MetricsProviderMeasurement[]>
}

const MAX_MEASUREMENTS_PER_ZONE = 8

export class MetricsProvider {
  constructor(private readonly repo: MetricsProviderRepo) {}

  async getMeasurementsByZone(companyId: Id, metricId: Id): Promise<Zone[]> {
    const measurements = await this.repo.getMeasurements(companyId, metricId)
    const measurementsByZone = this.groupMeasurementsByZone(measurements)

    return Array.from(measurementsByZone.entries()).map(
      ([zoneId, zoneMeasurements]) => {
        const measurements = this.getLatestMeasurements(zoneMeasurements)
        const average = this.getAverage(measurements)

        return {
          id: zoneId,
          average,
          measurements,
        }
      },
    )
  }

  private groupMeasurementsByZone(
    measurements: MetricsProviderMeasurement[],
  ): Map<Id, MetricsProviderMeasurement[]> {
    const measurementsByZone = new Map<Id, MetricsProviderMeasurement[]>()

    for (const measurement of measurements) {
      const zoneMeasurements = measurementsByZone.get(measurement.zoneId) ?? []
      zoneMeasurements.push(measurement)
      measurementsByZone.set(measurement.zoneId, zoneMeasurements)
    }

    return measurementsByZone
  }

  private getLatestMeasurements(
    measurements: MetricsProviderMeasurement[],
  ): Measurement[] {
    return [...measurements]
      .sort((first, second) => first.weeksAgo - second.weeksAgo)
      .slice(0, MAX_MEASUREMENTS_PER_ZONE)
      .sort((first, second) => second.weeksAgo - first.weeksAgo)
      .map((measurement) => ({
        id: measurement.id,
        value: measurement.value,
        weeksAgo: measurement.weeksAgo,
      }))
  }

  private getAverage(measurements: Measurement[]): number {
    if (measurements.length === 0) {
      return 0
    }

    const total = measurements.reduce(
      (sum, measurement) => sum + measurement.value,
      0,
    )

    return total / measurements.length
  }
}
