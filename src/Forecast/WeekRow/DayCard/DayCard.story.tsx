import React from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { date, number, optionsKnob } from '@storybook/addon-knobs'

import { TempUnits, DayForecast } from 'api'
import DayCard, { SkeletonDayCard } from './index'

export default {
  title: 'Forecast . WeekRow . DayCard',
  component: DayCard
}

const knobUnits = (label: string, initialUnit: TempUnits): TempUnits => {
  return optionsKnob(
    label,
    {
      Celcius: TempUnits.Celcius,
      Fahrenheit: TempUnits.Fahrenheit
    },
    initialUnit,
    {
      display: 'radio'
    }
  )
}

const knobDayjs = (label: string, initialDate: Date): Dayjs => {
  return dayjs(date(label, initialDate))
}

const knobDayForecast = (): DayForecast => ({
  date: knobDayjs('Date', new Date(2020, 7, 14)),
  temp: number('Temperature', 30),
  details: []
})

export const Initial: React.FC = () => (
  <DayCard
    units={knobUnits('Units', TempUnits.Celcius)}
    forecast={knobDayForecast()}
  />
)

export const Skeleton: React.FC = () => <SkeletonDayCard />
