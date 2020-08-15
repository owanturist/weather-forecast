import React, { ReactNode, ReactElement, Suspense } from 'react'
import Zoom from '@material-ui/core/Zoom'
import Box from '@material-ui/core/Box'
import Radio from '@material-ui/core/Radio'
import RadioGroup, { RadioGroupProps } from '@material-ui/core/RadioGroup'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import Skeleton from '@material-ui/lab/Skeleton'
import RemoteData from 'frctl/RemoteData'
import Either from 'frctl/Either'

import { Effects, Dispatch } from 'core'
import { getFiveDayForecastForCity } from 'api'
import TempUnits from 'entities/TempUnits'
import DayForecast from 'entities/DayForecast'
import { Error as HttpError } from 'httpBuilder'
import WeekRow, { SkeletonWeekRow } from './WeekRow'
import ErrorReport from './ErrorReport'
import SkeletonChart from './Chart/Skeleton'
import styles from './styles.module.css'

// S T A T E

export type State = {
  units: TempUnits
  unitsChanging: boolean
  weekForecast: RemoteData<HttpError, Array<DayForecast>>
}

const initial: State = {
  units: TempUnits.Fahrenheit,
  unitsChanging: false,
  weekForecast: RemoteData.Loading
}

export const init = (city: string): [State, Effects<Action>] => [
  initial,
  [getFiveDayForecastForCity(initial.units, city).send(LoadForecastDone)]
]

// U P D A T E

export type Action =
  | { type: 'LoadForecast' }
  | { type: 'LoadForecastDone'; result: Either<HttpError, Array<DayForecast>> }
  | { type: 'ChangeUnits'; units: TempUnits }

const LoadForecast: Action = { type: 'LoadForecast' }

const LoadForecastDone = (
  result: Either<HttpError, Array<DayForecast>>
): Action => ({
  type: 'LoadForecastDone',
  result
})

const ChangeUnits = (units: TempUnits): Action => ({
  type: 'ChangeUnits',
  units
})

export const update = (
  action: Action,
  city: string,
  state: State
): [State, Effects<Action>] => {
  switch (action.type) {
    case 'LoadForecast': {
      return [
        {
          ...state,
          weekForecast: RemoteData.Loading
        },
        [getFiveDayForecastForCity(state.units, city).send(LoadForecastDone)]
      ]
    }

    case 'LoadForecastDone': {
      return [
        {
          ...state,
          unitsChanging: false,
          weekForecast: RemoteData.fromEither(action.result)
        },
        []
      ]
    }

    case 'ChangeUnits': {
      return [
        {
          ...state,
          unitsChanging: true,
          units: action.units
        },
        [getFiveDayForecastForCity(action.units, city).send(LoadForecastDone)]
      ]
    }
  }
}

// V I E W

const ViewControlsContainer: React.FC = ({ children }) => (
  <Box paddingX={2} paddingTop={1}>
    {children}
  </Box>
)

const ViewNavigationContainer: React.FC = ({ children }) => (
  <Box display="flex" justifyContent="space-between" marginY={6}>
    {children}
  </Box>
)

const ViewWeekRowContainer: React.FC = ({ children }) => (
  <Box paddingX={1} paddingY={3} className={styles.weekRowContainer}>
    {children}
  </Box>
)

const ViewChartContainer: React.FC = ({ children }) => (
  <Box paddingTop={1} paddingBottom={3}>
    {children}
  </Box>
)

const ViewUnits: React.FC<
  RadioGroupProps & {
    control: ReactElement
    celciusNode: ReactNode
    fahrenheitNode: ReactNode
  }
> = React.memo(({ control, celciusNode, fahrenheitNode, ...props }) => (
  <FormControl component="fieldset" fullWidth>
    <RadioGroup row className={styles.radioGroup} {...props}>
      <FormControlLabel
        data-cy="forecast__radio_metric"
        label={celciusNode}
        value={TempUnits.Celcius}
        control={control}
      />

      <FormControlLabel
        data-cy="forecast__radio_imperial"
        label={fahrenheitNode}
        labelPlacement="start"
        value={TempUnits.Fahrenheit}
        control={control}
      />
    </RadioGroup>
  </FormControl>
))

const ViewNavigationButton: React.FC<
  IconButtonProps & {
    visible: boolean
  }
> = React.memo(({ visible, ...props }) => (
  <Zoom in={visible}>
    <IconButton color="primary" disabled={!visible} {...props} />
  </Zoom>
))

const ViewNavigation: React.FC<{
  prevVisible: boolean
  nextVisible: boolean
  onPrevClick(): void
  onNextClick(): void
}> = React.memo(({ prevVisible, nextVisible, onPrevClick, onNextClick }) => (
  <ViewNavigationContainer>
    <ViewNavigationButton
      data-cy="forecast__navigation_prev"
      aria-label="Scroll to previous day"
      visible={prevVisible}
      onClick={onPrevClick}
    >
      <ArrowBackIcon />
    </ViewNavigationButton>

    <ViewNavigationButton
      data-cy="forecast__navigation_next"
      aria-label="Scroll to next day"
      visible={nextVisible}
      onClick={onNextClick}
    >
      <ArrowForwardIcon />
    </ViewNavigationButton>
  </ViewNavigationContainer>
))

const ViewChart = React.lazy(() => import('./Chart'))

const radioControl = <Radio color="primary" />

const ViewSucceed: React.FC<{
  pageSize: number
  units: TempUnits
  unitsChanging: boolean
  weekForecast: Array<DayForecast>
  dispatch: Dispatch<Action>
}> = React.memo(props => {
  const { pageSize, units, unitsChanging, weekForecast, dispatch } = props
  const [{ shiftIndex, activeIndex }, setState] = React.useState({
    shiftIndex: 0,
    activeIndex: 0
  })

  const onPrevClick = React.useCallback(
    () => setState(state => ({ ...state, shiftIndex: state.shiftIndex - 1 })),
    []
  )
  const onNextClick = React.useCallback(
    () => setState(state => ({ ...state, shiftIndex: state.shiftIndex + 1 })),
    []
  )
  const onShowDetails = React.useCallback(
    index =>
      setState(state => ({ ...state, activeIndex: index - state.shiftIndex })),
    []
  )
  const onChangeUnits = React.useCallback(
    event => dispatch(ChangeUnits(event.currentTarget.value as TempUnits)),
    [dispatch]
  )

  const activeDaySegments = weekForecast[shiftIndex + activeIndex].getSegments()

  return (
    <div data-cy="forecast__root">
      <ViewControlsContainer>
        <ViewUnits
          aria-label="Temperature units"
          name="temp-units"
          value={units}
          control={radioControl}
          celciusNode="Celcius"
          fahrenheitNode="Fahrenheit"
          onChange={onChangeUnits}
        />

        <ViewNavigation
          prevVisible={shiftIndex > 0}
          nextVisible={shiftIndex < weekForecast.length - pageSize}
          onPrevClick={onPrevClick}
          onNextClick={onNextClick}
        />
      </ViewControlsContainer>

      <ViewWeekRowContainer>
        <WeekRow
          pageSize={pageSize}
          shiftIndex={shiftIndex}
          activeIndex={shiftIndex + activeIndex}
          units={units}
          unitsChanging={unitsChanging}
          weekForecast={weekForecast}
          onShowDetails={onShowDetails}
        />
      </ViewWeekRowContainer>

      <ViewChartContainer>
        <Suspense fallback={<SkeletonChart />}>
          <ViewChart segments={activeDaySegments} />
        </Suspense>
      </ViewChartContainer>
    </div>
  )
})

export const View: React.FC<{
  pageSize: number
  state: State
  dispatch: Dispatch<Action>
}> = React.memo(({ pageSize, state, dispatch }) => {
  const onRetry = React.useCallback(() => dispatch(LoadForecast), [dispatch])

  return state.weekForecast.cata({
    Loading: () => <SkeletonForecast pageSize={pageSize} />,

    Failure: error => <ErrorReport error={error} onRetry={onRetry} />,

    Succeed: weekForecast => (
      <ViewSucceed
        pageSize={pageSize}
        units={state.units}
        unitsChanging={state.unitsChanging}
        weekForecast={weekForecast}
        dispatch={dispatch}
      />
    )
  })
})

// S K E L E T O N

const SkeletNavButton: React.FC = () => (
  <Skeleton variant="circle" width="48px" height="48px" />
)

const SkeletonForecast: React.FC<{ pageSize: number }> = React.memo(
  ({ pageSize }) => (
    <div data-cy="forecast__skeleton">
      <ViewControlsContainer>
        <ViewUnits
          control={
            <Box
              width="42px"
              height="42px"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Skeleton variant="circle" width="20px" height="20px" />
            </Box>
          }
          celciusNode={<Skeleton width="54px" />}
          fahrenheitNode={<Skeleton width="78px" />}
        />

        <ViewNavigationContainer>
          <SkeletNavButton />
          <SkeletNavButton />
        </ViewNavigationContainer>
      </ViewControlsContainer>

      <ViewWeekRowContainer>
        <SkeletonWeekRow pageSize={pageSize} />
      </ViewWeekRowContainer>

      <ViewChartContainer>
        <SkeletonChart />
      </ViewChartContainer>
    </div>
  )
)
