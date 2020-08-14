import React from 'react'
import Grid from '@material-ui/core/Grid'

import TempUnits from 'entities/TempUnits'
import DayForecast from 'entities/DayForecast'
import DayCard, { SkeletonDayCard } from './DayCard'
import styles from './styles.module.css'

const ViewGrid: React.FC<{
  pageSize: number
  shiftIndex: number
}> = ({ pageSize, shiftIndex, children }) => {
  const itemSize = Math.floor(10000 / pageSize) / 100
  const styleItem: React.CSSProperties = {
    flexBasis: `${itemSize}%`,
    maxWidth: `${itemSize}%`
  }

  return (
    <Grid
      className={styles.container}
      container
      spacing={2}
      wrap="nowrap"
      style={{
        transform: `translate3d(${-itemSize * shiftIndex}%, 0, 0)`
      }}
    >
      {React.Children.map(children, (child, index) => (
        <Grid
          className={styles.item}
          style={styleItem}
          item
          key={React.isValidElement(child) ? child.key : index}
        >
          {child}
        </Grid>
      ))}
    </Grid>
  )
}

const WeekRow: React.FC<{
  pageSize: number
  activeIndex: number
  shiftIndex: number
  unitsChanging?: boolean
  units: TempUnits
  weekForecast: Array<DayForecast>
  onShowDetails(index: number): void
}> = React.memo(
  ({
    pageSize,
    activeIndex,
    shiftIndex,
    unitsChanging,
    units,
    weekForecast,
    onShowDetails
  }) => (
    <ViewGrid pageSize={pageSize} shiftIndex={shiftIndex}>
      {weekForecast.map((forecast, index) => (
        <DayCard
          key={forecast.getDate().toISOString()}
          active={index === activeIndex}
          unitsChanging={unitsChanging}
          units={units}
          forecast={forecast}
          onShowDetails={() => onShowDetails(index)}
        />
      ))}
    </ViewGrid>
  )
)

export default WeekRow

// S K E L E T O N

export const SkeletonWeekRow: React.FC<{
  pageSize: number
}> = React.memo(({ pageSize }) => (
  <ViewGrid pageSize={pageSize} shiftIndex={0}>
    {new Array(pageSize).fill(0).map((_, index) => (
      <SkeletonDayCard key={index} />
    ))}
  </ViewGrid>
))
