import React, { ReactNode } from 'react'
import Card, { CardProps } from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Skeleton from '@material-ui/lab/Skeleton'

import TempUnits from 'entities/TempUnits'
import DayForecast from 'entities/DayForecast'

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
    tempNode: ReactNode
    dateNode: ReactNode
    actionNode: ReactNode
  }
> = ({ tempNode, dateNode, actionNode, ...props }) => (
  <Card {...props}>
    <CardContent>
      <Typography variant="h4">{tempNode}</Typography>

      <Typography variant="subtitle1">{dateNode}</Typography>
    </CardContent>

    <CardActions>{actionNode}</CardActions>
  </Card>
)

const DayCard: React.FC<{
  active?: boolean
  unitsChanging?: boolean
  units: TempUnits
  forecast: DayForecast
  onShowDetails?(): void
}> = React.memo(({ active, unitsChanging, units, forecast, onShowDetails }) => (
  <ViewCard
    data-cy="day-card__root"
    raised={active}
    tempNode={
      unitsChanging ? (
        <Skeleton />
      ) : (
        forecast.getAverageTemp().toString() + unitsToLabel(units)
      )
    }
    dateNode={forecast.getDate().format('DD MMM YY')}
    actionNode={
      <Button
        disabled={active}
        color="primary"
        size="small"
        variant="contained"
        onClick={onShowDetails}
      >
        Show Details
      </Button>
    }
  />
))

export default DayCard

// S K E L E T O N

export const SkeletonDayCard: React.FC = React.memo(() => (
  <ViewCard
    tempNode={<Skeleton />}
    dateNode={<Skeleton />}
    actionNode={<Skeleton variant="rect" width="122px" height="30px" />}
  />
))
