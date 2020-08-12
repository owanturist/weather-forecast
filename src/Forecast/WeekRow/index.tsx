import React from 'react'
import Grid from '@material-ui/core/Grid'

import { TempUnits, DayForecast } from 'api'
import DayCard from '../DayCard'
import styles from './styles.module.css'

const CARD_WIDTH_PCT = 33.33

const WeekRow: React.FC<{
  units: TempUnits
  weekForecast: Array<DayForecast>
  shiftIndex: number
}> = ({ units, weekForecast, shiftIndex }) => (
  <Grid
    className={styles.container}
    container
    spacing={2}
    wrap="nowrap"
    style={{
      transform: `translate3d(${-CARD_WIDTH_PCT * shiftIndex}%, 0, 0)`
    }}
  >
    {weekForecast.map(forecast => (
      <Grid
        className={styles.item}
        item
        xs={4}
        key={forecast.date.toISOString()}
      >
        <DayCard units={units} forecast={forecast} />
      </Grid>
    ))}
  </Grid>
)

export default WeekRow
