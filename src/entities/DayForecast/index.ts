import dayjs, { Dayjs } from 'dayjs'
import Decode, { Decoder } from 'frctl/Json/Decode'

import { round } from 'utils'

type DayForecast = {
  getDate(): Dayjs
  getAverageTemp(): number
  getProbes(): Array<DayForecastProbe>
}

export default DayForecast

export type DayForecastProbe = {
  datetime: Dayjs
  temp: number
}

const probeDecoder: Decoder<DayForecastProbe> = Decode.shape({
  datetime: Decode.field('dt').int.map(ts => dayjs(1000 * ts)),
  temp: Decode.field('main').field('temp').float
})

class DayForecastImpl implements DayForecast {
  public constructor(private readonly probes: Array<DayForecastProbe>) {}

  public getDate(): Dayjs {
    if (this.probes.length === 0) {
      return dayjs('01-01-1970')
    }

    return this.probes[0].datetime
  }

  public getAverageTemp(): number {
    // don't divide by zero
    if (this.probes.length === 0) {
      return 0
    }

    let total = 0

    for (const probe of this.probes) {
      total += probe.temp
    }

    return round(total / this.probes.length, 2)
  }

  public getProbes(): Array<DayForecastProbe> {
    return this.probes
  }
}

export const __test_only_initDayForecast__ = (
  probes: Array<DayForecastProbe>
): Array<DayForecast> => {
  if (probes.length === 0) {
    return []
  }

  const acc: Array<DayForecast> = []
  let currentDayProbes = [probes[0]]

  for (let i = 1; i < probes.length; i++) {
    const dayProbe = probes[i]

    if (probes[i - 1].datetime.isSame(dayProbe.datetime, 'day')) {
      currentDayProbes.push(dayProbe)
    } else {
      acc.push(new DayForecastImpl(currentDayProbes))
      currentDayProbes = [dayProbe]
    }
  }

  if (currentDayProbes.length > 0) {
    acc.push(new DayForecastImpl(currentDayProbes))
  }

  return acc
}

export const dayForecastDecoder: Decoder<Array<DayForecast>> = Decode.list(
  probeDecoder
).map(__test_only_initDayForecast__)
