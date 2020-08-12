import React from 'react'
import dayjs from 'dayjs'
import RemoteData from 'frctl/RemoteData'

import { TempUnits, DayForecast } from 'api'
import * as Forecast from './index'

export default {
  title: 'Forecast . Forecast',
  component: Forecast.View
}

const makeDayForecast = (datestring: string, temp: number): DayForecast => ({
  date: dayjs(datestring),
  temp,
  details: []
})

const knobState = (): Forecast.State => ({
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
  <Forecast.View state={Forecast.initial} />
)

export const Failure: React.FC = () => (
  <Forecast.View
    state={{
      ...Forecast.initial,
      weekForecast: RemoteData.Failure('Error')
    }}
  />
)

export const Succeed: React.FC = () => <Forecast.View state={knobState()} />
