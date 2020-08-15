import Either from 'frctl/Either'
import RemoteData from 'frctl/RemoteData'

import TempUnits from 'entities/TempUnits'
import { Error as HttpError } from 'httpBuilder'
import * as Forecast from './'

it('initByCity', () => {
  const [initialState] = Forecast.initByCity('cityname')

  expect(initialState).toEqual({
    origin: Forecast.ByCity('cityname'),
    units: TempUnits.Fahrenheit,
    unitsChanging: false,
    weekForecast: RemoteData.Loading
  })
})

it('initByCoordinates', () => {
  const coords = { lat: 13.123, lon: 91.321 }
  const [initialState] = Forecast.initByCoordinates(coords)

  expect(initialState).toEqual({
    origin: Forecast.ByCoordinates(coords),
    units: TempUnits.Fahrenheit,
    unitsChanging: false,
    weekForecast: RemoteData.Loading
  })
})

describe('update', () => {
  it('LoadForecast', () => {
    const [nextState] = Forecast.update(
      {
        type: 'LoadForecast'
      },
      {
        origin: Forecast.ByCity('cityname'),
        units: TempUnits.Celcius,
        unitsChanging: true,
        weekForecast: RemoteData.Failure(HttpError.Timeout)
      }
    )

    expect(nextState).toEqual({
      origin: Forecast.ByCity('cityname'),
      units: TempUnits.Celcius,
      unitsChanging: true,
      weekForecast: RemoteData.Loading
    })
  })

  describe('LoadForecastDone', () => {
    it('set Failure when request fails', () => {
      const [nextState] = Forecast.update(
        {
          type: 'LoadForecastDone',
          result: Either.Left(HttpError.NetworkError)
        },
        {
          origin: Forecast.ByCity('cityname'),
          units: TempUnits.Celcius,
          unitsChanging: true,
          weekForecast: RemoteData.Loading
        }
      )

      expect(nextState).toEqual({
        origin: Forecast.ByCity('cityname'),
        units: TempUnits.Celcius,
        unitsChanging: false,
        weekForecast: RemoteData.Failure(HttpError.NetworkError)
      })
    })

    it('set Succeed when request success', () => {
      const [nextState] = Forecast.update(
        {
          type: 'LoadForecastDone',
          result: Either.Right([])
        },
        {
          origin: Forecast.ByCity('cityname'),
          units: TempUnits.Fahrenheit,
          unitsChanging: true,
          weekForecast: RemoteData.Loading
        }
      )

      expect(nextState).toEqual({
        origin: Forecast.ByCity('cityname'),

        units: TempUnits.Fahrenheit,
        unitsChanging: false,
        weekForecast: RemoteData.Succeed([])
      })
    })
  })

  it('ChangeUnits', () => {
    const [nextState] = Forecast.update(
      {
        type: 'ChangeUnits',
        units: TempUnits.Fahrenheit
      },
      {
        origin: Forecast.ByCity('cityname'),
        units: TempUnits.Celcius,
        unitsChanging: false,
        weekForecast: RemoteData.Succeed([])
      }
    )

    expect(nextState).toEqual({
      origin: Forecast.ByCity('cityname'),
      units: TempUnits.Fahrenheit,
      unitsChanging: true,
      weekForecast: RemoteData.Succeed([])
    })
  })
})
