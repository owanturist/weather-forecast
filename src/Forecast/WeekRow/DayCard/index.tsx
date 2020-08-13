import React, { ReactNode } from 'react'
import Card from '@material-ui/core/Card'
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

const ViewCard: React.FC<{
  tempNode: ReactNode
  dateNode: ReactNode
}> = ({ tempNode: tempComponent, dateNode: dateComponent }) => (
  <Card>
    <CardContent>
      <Typography variant="h4">{tempComponent}</Typography>

      <Typography variant="subtitle1">{dateComponent}</Typography>
    </CardContent>
  </Card>
)

const DayCard: React.FC<{
  units: TempUnits
  forecast: DayForecast
}> = React.memo(({ units, forecast }) => (
  <ViewCard
    tempNode={forecast.getAverageTemp().toString() + unitsToLabel(units)}
    dateNode={forecast.getDate().format('DD MMM YY')}
  />
))

export default DayCard

// S K E L E T O N

export const SkeletonDayCard: React.FC = React.memo(() => (
  <ViewCard tempNode={<Skeleton />} dateNode={<Skeleton />} />
))
