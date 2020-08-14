import React, { ReactNode } from 'react'
import Card, { CardProps } from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Skeleton from '@material-ui/lab/Skeleton'

import { TempUnits, DayForecast } from 'api'

const unitsToLabel = (units: TempUnits): string => {
  switch (units) {
    case TempUnits.Celcius:
      return '°C'
    case TempUnits.Fahrenheit:
      return '°F'
  }
}

const ViewCard: React.FC<
  CardProps & {
    temp: ReactNode
    date: ReactNode
  }
> = ({ temp, date, ...props }) => (
  <Card {...props}>
    <CardContent>
      <Typography variant="h4">{temp}</Typography>

      <Typography variant="subtitle1">{date}</Typography>
    </CardContent>
  </Card>
)

const DayCard: React.FC<{
  unitsChanging?: boolean
  units: TempUnits
  forecast: DayForecast
}> = React.memo(({ unitsChanging, units, forecast }) => (
  <ViewCard
    data-cy="day-card__root"
    temp={
      unitsChanging ? (
        <Skeleton />
      ) : (
        forecast.getAverageTemp().toString() + unitsToLabel(units)
      )
    }
    date={forecast.getDate().format('DD MMM YY')}
  />
))

export default DayCard

// S K E L E T O N

export const SkeletonDayCard: React.FC = React.memo(() => (
  <ViewCard temp={<Skeleton />} date={<Skeleton />} />
))
