import React from 'react'
import { action } from '@storybook/addon-actions'
import { text, number, boolean, optionsKnob } from '@storybook/addon-knobs'
import dayjs from 'dayjs'
import Decode from 'frctl/Json/Decode'
import RemoteData from 'frctl/RemoteData'

import { Error as HttpError } from 'httpBuilder'
import { TempUnits, DayForecast } from 'api'
import * as Forecast from './index'

export default {
  title: 'Forecast',
  component: Forecast.View
}

const initial: Forecast.State = Forecast.init('Munich')[0]

const makeDayForecast = (datestring: string, temp: number): DayForecast => ({
  getDate: () => dayjs(datestring),
  getAverageTemp: () => temp,
  getProbes: () => []
})

const knobState = (): Forecast.State => ({
  ...initial,
  unitsChanging: boolean('Units changing', false),
  units: TempUnits.Fahrenheit,
  weekForecast: RemoteData.Succeed([
    makeDayForecast('09-02-1993', 23),
    makeDayForecast('09-03-1993', 20),
    makeDayForecast('09-04-1993', 24),
    makeDayForecast('09-05-1993', 26),
    makeDayForecast('09-06-1993', 17)
  ])
})

const knobHttpError = (label: string): HttpError => {
  const opt:
    | 'NetworkError'
    | 'Timeout'
    | 'BadUrl'
    | 'BadStatus500'
    | 'BadStatus400'
    | 'BadBody' = optionsKnob(
    label,
    {
      NetworkError: 'NetworkError',
      Timeout: 'Timeout',
      BadUrl: 'BadUrl',
      BadStatus500: 'BadStatus500',
      BadStatus400: 'BadStatus400',
      BadBody: 'BadBody'
    },
    'NetworkError',
    {
      display: 'radio'
    }
  )

  if (opt === 'NetworkError') {
    return HttpError.NetworkError
  }

  if (opt === 'Timeout') {
    return HttpError.Timeout
  }

  if (opt === 'BadUrl') {
    return HttpError.BadUrl(text('Url', 'wrongurl'))
  }

  if (opt === 'BadStatus500') {
    return HttpError.BadStatus({
      url: text('Url 5**', 'https://google.com'),
      statusCode: number('Status Code 5**', 501, {
        min: 500,
        max: 599
      }),
      statusText: text('Status Text 5**', 'Not Implemented'),
      headers: {},
      body: ''
    })
  }

  if (opt === 'BadStatus400') {
    return HttpError.BadStatus({
      url: text('Url 4**', 'https://google.com'),
      statusCode: number('Status Code 4**', 404, {
        min: 400,
        max: 499
      }),
      statusText: text('Status Text 4**', 'Not Found'),
      headers: {},
      body: ''
    })
  }

  return HttpError.BadBody(
    Decode.Error.Field(
      'items',
      Decode.Error.Index(
        0,
        Decode.Error.Failure(
          text('Failure Message', 'Expect STRING but get NUMBER'),
          JSON.stringify(
            {
              items: [123, '456']
            },
            null,
            4
          )
        )
      )
    ),
    {
      url: 'https://google.com',
      statusCode: 200,
      statusText: 'OK',
      headers: {},
      body: ''
    }
  )
}

export const Loading: React.FC = () => (
  <Forecast.View pageSize={3} state={initial} dispatch={action('dispatch')} />
)

export const Succeed: React.FC = () => (
  <Forecast.View
    pageSize={3}
    state={knobState()}
    dispatch={action('dispatch')}
  />
)

export const Failure: React.FC = () => (
  <Forecast.View
    pageSize={3}
    state={{
      ...initial,
      weekForecast: RemoteData.Failure(knobHttpError('Http Error'))
    }}
    dispatch={action('dispatch')}
  />
)
