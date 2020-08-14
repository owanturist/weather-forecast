import React from 'react'
import { BarChart, Bar, ResponsiveContainer } from 'recharts'
import colorsCyan from '@material-ui/core/colors/cyan'

import { DayForecastSegment } from 'entities/DayForecast'

const Chart: React.FC<{ segments: Array<DayForecastSegment> }> = ({
  segments
}) => (
  <ResponsiveContainer height={250}>
    <BarChart data={segments}>
      <Bar fill={colorsCyan[500]} dataKey="temp" maxBarSize={60} />
    </BarChart>
  </ResponsiveContainer>
)

export default Chart
