import React from 'react'
import dayjs from 'dayjs'
import { number } from '@storybook/addon-knobs'

import { TempUnits, DayForecast } from 'api'
import WeekRow, { SkeletonWeekRow } from './index'

export default {
  title: 'Forecast . WeekRow',
  component: WeekRow
}

const makeDayForecast = (datestring: string, temp: number): DayForecast => ({
  date: dayjs(datestring),
  temp,
  details: []
})

const styleContainer: React.CSSProperties = {
  boxSizing: 'border-box',
  padding: '20px',
  width: '480px',
  border: '2px solid #ccc',
  overflow: 'hidden'
}

export const Initial: React.FC = () => (
  <div style={styleContainer}>
    <WeekRow
      pageSize={number('Page Size', 3, {
        min: 1
      })}
      shiftIndex={number('Shift Index', 0, {
        min: 0
      })}
      units={TempUnits.Celcius}
      weekForecast={[
        makeDayForecast('09-02-1993', 23),
        makeDayForecast('09-03-1993', 20),
        makeDayForecast('09-04-1993', 24),
        makeDayForecast('09-05-1993', 26),
        makeDayForecast('09-06-1993', 17),
        makeDayForecast('09-07-1993', 18),
        makeDayForecast('09-08-1993', 21),
        makeDayForecast('09-09-1993', 22)
      ]}
    />
  </div>
)

export const Skeleton: React.FC = () => (
  <div style={styleContainer}>
    <SkeletonWeekRow
      pageSize={number('Page Size', 3, {
        min: 1
      })}
    />
  </div>
)
