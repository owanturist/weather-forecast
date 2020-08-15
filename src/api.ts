import Decode from 'frctl/Json/Decode'

import http, { Request } from 'httpBuilder'
import TempUnits from 'entities/TempUnits'
import DayForecast, { dayForecastDecoder } from 'entities/DayForecast'
import { Coordinates } from 'geo'

const FORECAST_API_URL = process.env.REACT_APP_FORECAST_API_URL || ''
const FORECAST_API_APPID = process.env.REACT_APP_FORECAST_API_APPID || ''
const TIMEOUT = Number(process.env.REACT_APP_HTTP_TIMEOUT || 0)

export const getFiveDayForecastForCity = (
  units: TempUnits,
  city: string
): Request<Array<DayForecast>> => {
  return http
    .get(`${FORECAST_API_URL}/forecast`)
    .withTimeout(TIMEOUT)
    .withQueryParam('appid', FORECAST_API_APPID)
    .withQueryParam('q', city)
    .withQueryParam('units', units)
    .expectJson(Decode.field('list').of(dayForecastDecoder))
}

export const getFiveDayForecastForCoordinates = (
  units: TempUnits,
  coordinates: Coordinates
): Request<Array<DayForecast>> => {
  return http
    .get(`${FORECAST_API_URL}/forecast`)
    .withTimeout(TIMEOUT)
    .withQueryParam('appid', FORECAST_API_APPID)
    .withQueryParam('lat', coordinates.lat.toString())
    .withQueryParam('lon', coordinates.lon.toString())
    .withQueryParam('units', units)
    .expectJson(Decode.field('list').of(dayForecastDecoder))
}
