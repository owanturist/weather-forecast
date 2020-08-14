import Either from 'frctl/Either'
import RemoteData from 'frctl/RemoteData'

import TempUnits from 'entities/TempUnits'
import { Error as HttpError } from 'httpBuilder'
import * as Forecast from './'

describe('init', () => {
  it('initial state has correct fields', () => {
    const [initialState] = Forecast.init('cityname')

    expect(initialState).toEqual({
      units: TempUnits.Fahrenheit,
      unitsChanging: false,
      weekForecast: RemoteData.Loading
    })
  })
})

describe('update', () => {
  it('LoadForecast', () => {
    const [nextState] = Forecast.update(
      {
        type: 'LoadForecast'
      },
      'cityname',
      {
        units: TempUnits.Celcius,
        unitsChanging: true,
        weekForecast: RemoteData.Failure(HttpError.Timeout)
      }
    )

    expect(nextState).toEqual({
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
        'cityname',
        {
          units: TempUnits.Celcius,
          unitsChanging: true,
          weekForecast: RemoteData.Loading
        }
      )

      expect(nextState).toEqual({
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
        'cityname',
        {
          units: TempUnits.Fahrenheit,
          unitsChanging: true,
          weekForecast: RemoteData.Loading
        }
      )

      expect(nextState).toEqual({
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
      'cityname',
      {
        units: TempUnits.Celcius,
        unitsChanging: false,
        weekForecast: RemoteData.Succeed([])
      }
    )

    expect(nextState).toEqual({
      units: TempUnits.Fahrenheit,
      unitsChanging: true,
      weekForecast: RemoteData.Succeed([])
    })
  })
})
