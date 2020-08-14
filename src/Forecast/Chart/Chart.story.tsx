import React from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { date, number } from '@storybook/addon-knobs'

import { DayForecastSegment } from 'entities/DayForecast'
import Chart from './'

export default {
  title: 'Forecast . Chart',
  component: Chart
}

const knobDayjs = (label: string, initialDate: string): Dayjs => {
  return dayjs(date(label, dayjs(initialDate, 'MM-DD-YYYY HH:mm').toDate()))
}

const knobTemp = (label: string, initialTemp: number): number => {
  return number(label, initialTemp, {
    range: true,
    min: -50,
    max: 50,
    step: 0.01
  })
}

const knobSegments = (): Array<DayForecastSegment> => [
  {
    datetime: knobDayjs('Datetime #1', '01-02-2020 00:00'),
    temp: knobTemp('Temp #1', 23)
  },
  {
    datetime: knobDayjs('Datetime #2', '01-02-2020 03:00'),
    temp: knobTemp('Temp #2', 21.32)
  },
  {
    datetime: knobDayjs('Datetime #3', '01-02-2020 06:00'),
    temp: knobTemp('Temp #3', 24.2)
  },
  {
    datetime: knobDayjs('Datetime #4', '01-02-2020 09:00'),
    temp: knobTemp('Temp #4', 25.9)
  },
  {
    datetime: knobDayjs('Datetime #5', '01-02-2020 12:00'),
    temp: knobTemp('Temp #5', 26.1)
  },
  {
    datetime: knobDayjs('Datetime #6', '01-02-2020 15:00'),
    temp: knobTemp('Temp #6', 28.4)
  },
  {
    datetime: knobDayjs('Datetime #7', '01-02-2020 18:00'),
    temp: knobTemp('Temp #7', 25.31)
  },
  {
    datetime: knobDayjs('Datetime #8', '01-02-2020 21:00'),
    temp: knobTemp('Temp #8', 20.97)
  }
]

export const Default: React.FC = () => <Chart segments={knobSegments()} />
