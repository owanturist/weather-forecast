import React from 'react'
import dayjs from 'dayjs'
import styled from '@emotion/styled/macro'

import { TempUnits, DayForecast } from 'api'
import WeekRow from './index'

export default {
  title: 'Forecast . WeekRow',
  component: WeekRow
}

const makeDayForecast = (datestring: string, temp: number): DayForecast => ({
  date: dayjs(datestring),
  temp,
  details: []
})

const Container = styled.div`
  box-sizing: border-box;
  padding: 5px;
  /* width: 480px; */
  background: #ccc;
`

export const Initial: React.FC = () => (
  <Container>
    <WeekRow
      units={TempUnits.Celcius}
      weekForecast={[
        makeDayForecast('09-02-1993', 23),
        makeDayForecast('09-03-1993', 20),
        makeDayForecast('09-04-1993', 24),
        makeDayForecast('09-05-1993', 26),
        makeDayForecast('09-06-1993', 17)
      ]}
    />
  </Container>
)
