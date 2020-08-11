import React from 'react'
import Grid from '@material-ui/core/Grid'
import styled from '@emotion/styled/macro'

import { TempUnits, DayForecast } from 'api'
import DayCard from '../DayCard'

const StyledGridItem = styled(Grid)`
  flex-shrink: 0;
`

const WeekRow: React.FC<{
  units: TempUnits
  weekForecast: Array<DayForecast>
}> = ({ units, weekForecast }) => (
  <Grid container spacing={2} wrap="nowrap">
    {weekForecast.map(forecast => (
      <StyledGridItem item xs={4} key={forecast.date.get('millisecond')}>
        <DayCard units={units} forecast={forecast} />
      </StyledGridItem>
    ))}
  </Grid>
)

export default WeekRow
