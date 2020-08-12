import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

import { TempUnits, DayForecast } from 'api'

const unitsToLabel = (units: TempUnits): string => {
  switch (units) {
    case TempUnits.Celcius:
      return '°C'
    case TempUnits.Fahrenheit:
      return '°F'
  }
}

const DayCard: React.FC<{
  units: TempUnits
  forecast: DayForecast
}> = React.memo(({ units, forecast }) => (
  <Card>
    <CardContent>
      <Typography variant="h4">
        {forecast.temp}
        {unitsToLabel(units)}
      </Typography>

      <Typography variant="subtitle1">
        {forecast.date.format('DD MMM YY')}
      </Typography>
    </CardContent>
  </Card>
))

export default DayCard
