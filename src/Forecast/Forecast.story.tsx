import React from 'react'
import { action } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs'
import dayjs from 'dayjs'
import RemoteData from 'frctl/RemoteData'

import { Error as HttpError } from 'httpBuilder'
import TempUnits from 'entities/TempUnits'
import DayForecast from 'entities/DayForecast'
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
      weekForecast: RemoteData.Failure(HttpError.Timeout)
    }}
    dispatch={action('dispatch')}
  />
)
