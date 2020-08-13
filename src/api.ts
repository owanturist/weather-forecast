import dayjs, { Dayjs } from 'dayjs'
import Decode, { Decoder } from 'frctl/Json/Decode'

import http, { Request } from 'httpBuilder'
import { round } from 'utils'

const FORECAST_API_URL = process.env.REACT_APP_FORECAST_API_URL || ''
const FORECAST_API_APPID = process.env.REACT_APP_FORECAST_API_APPID || ''

export enum TempUnits {
  Celcius = 'metric',
  Fahrenheit = 'imperial'
}

export type DayProbeForecast = {
  datetime: Dayjs
  temp: number
}

const dayProbeForecastDecoder: Decoder<DayProbeForecast> = Decode.shape({
  datetime: Decode.field('dt').int.map(ts => dayjs(1000 * ts)),
  temp: Decode.field('main').field('temp').float
})

export type DayForecast = {
  getDate(): Dayjs
  getAverageTemp(): number
  getProbes(): Array<DayProbeForecast>
}

class DayForecastImpl implements DayForecast {
  public constructor(private readonly probes: Array<DayProbeForecast>) {}

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

  public getProbes(): Array<DayProbeForecast> {
    return this.probes
  }
}

const dayForecastArrayDecoder: Decoder<Array<DayForecast>> = Decode.list(
  dayProbeForecastDecoder
).map(probes => {
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

  return acc
})

export const getFiveDayForecastForCity = (
  units: TempUnits,
  city: string
): Request<Array<DayForecast>> => {
  return http
    .get(`${FORECAST_API_URL}/forecast`)
    .withQueryParam('appid', FORECAST_API_APPID)
    .withQueryParam('q', city)
    .withQueryParam('units', units)
    .expectJson(Decode.field('list').of(dayForecastArrayDecoder))
}
