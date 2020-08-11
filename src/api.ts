import { Dayjs } from 'dayjs'

export enum TempUnits {
  Celcius = 'metric',
  Fahrenheit = 'imperial'
}

export type DayForecast = {
  date: Dayjs
  temp: number
  details: Array<DayDetailedForecast>
}

export type DayDetailedForecast = {
  datetime: Dayjs
  temp: number
}
