import React from 'react'
import Grid from '@material-ui/core/Grid'
import { css } from 'emotion/macro'

import { TempUnits, DayForecast } from 'api'
import DayCard from '../DayCard'

const CARD_WIDTH_PCT = 33.33

const cssGridItem = css`
  flex-shrink: 0;
`

const cssGridContainer = css`
  transition: 0.3s transform ease;
`

const WeekRow: React.FC<{
  units: TempUnits
  weekForecast: Array<DayForecast>
  shiftIndex: number
}> = ({ units, weekForecast, shiftIndex }) => (
  <Grid
    className={cssGridContainer}
    container
    spacing={1}
    wrap="nowrap"
    style={{
      transform: `translate3d(${-CARD_WIDTH_PCT * shiftIndex}%, 0, 0)`
    }}
  >
    {weekForecast.map(forecast => (
      <Grid
        className={cssGridItem}
        item
        xs={4}
        key={forecast.date.get('millisecond')}
      >
        <DayCard units={units} forecast={forecast} />
      </Grid>
    ))}
  </Grid>
)

export default WeekRow
