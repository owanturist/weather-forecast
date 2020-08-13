import React, { ReactNode, ReactElement } from 'react'
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
import { TempUnits, DayForecast, getFiveDayForecastForCity } from 'api'
import { Error as HttpError } from 'httpBuilder'
import WeekRow, { SkeletonWeekRow } from './WeekRow'
import styles from './styles.module.css'

// S T A T E

export type State = {
  units: TempUnits
  weekForecast: RemoteData<HttpError, Array<DayForecast>>
}

const initial: State = {
  units: TempUnits.Fahrenheit,
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

// const LoadForecast: Action = { type: 'LoadForecast' }

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
        { ...state, weekForecast: RemoteData.Loading },
        [getFiveDayForecastForCity(state.units, city).send(LoadForecastDone)]
      ]
    }

    case 'LoadForecastDone': {
      return [
        { ...state, weekForecast: RemoteData.fromEither(action.result) },
        []
      ]
    }

    case 'ChangeUnits': {
      return [
        { ...state, units: action.units },
        [getFiveDayForecastForCity(action.units, city).send(LoadForecastDone)]
      ]
    }
  }
}

// V I E W

const ViewControlsContainer: React.FC = ({ children }) => (
  <Box padding={1}>{children}</Box>
)

const ViewNavigationContainer: React.FC = ({ children }) => (
  <Box display="flex" justifyContent="space-between">
    {children}
  </Box>
)

const ViewWeekRowContainer: React.FC = ({ children }) => (
  <Box padding={1} className={styles.weekRowContainer}>
    {children}
  </Box>
)

const ViewUnits: React.FC<
  RadioGroupProps & {
    control: ReactElement
    celciusNode: ReactNode
    fahrenheitNode: ReactNode
  }
> = ({ control, celciusNode, fahrenheitNode, ...props }) => (
  <FormControl component="fieldset" fullWidth>
    <RadioGroup row className={styles.radioGroup} {...props}>
      <FormControlLabel
        label={celciusNode}
        value={TempUnits.Celcius}
        control={control}
      />

      <FormControlLabel
        label={fahrenheitNode}
        labelPlacement="start"
        value={TempUnits.Fahrenheit}
        control={control}
      />
    </RadioGroup>
  </FormControl>
)

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
      visible={prevVisible}
      aria-label="Scroll to previous day"
      onClick={onPrevClick}
    >
      <ArrowBackIcon />
    </ViewNavigationButton>

    <ViewNavigationButton
      visible={nextVisible}
      aria-label="Scroll to next day"
      onClick={onNextClick}
    >
      <ArrowForwardIcon />
    </ViewNavigationButton>
  </ViewNavigationContainer>
))

const ViewSucceed: React.FC<{
  units: TempUnits
  weekForecast: Array<DayForecast>
  dispatch: Dispatch<Action>
}> = React.memo(({ units, weekForecast, dispatch }) => {
  const [shiftIndex, setShiftIndex] = React.useState(0)

  return (
    <>
      <ViewControlsContainer>
        <ViewUnits
          aria-label="Temperature units"
          name="temp-units"
          value={units}
          control={<Radio color="primary" />}
          celciusNode="Celcius"
          fahrenheitNode="Fahrenheit"
          onChange={event =>
            dispatch(ChangeUnits(event.currentTarget.value as TempUnits))
          }
        />

        <ViewNavigation
          prevVisible={shiftIndex > 0}
          nextVisible={shiftIndex < weekForecast.length - 3}
          onPrevClick={React.useCallback(() => setShiftIndex(shiftIndex - 1), [
            shiftIndex
          ])}
          onNextClick={React.useCallback(() => setShiftIndex(shiftIndex + 1), [
            shiftIndex
          ])}
        />
      </ViewControlsContainer>

      <ViewWeekRowContainer>
        <WeekRow
          pageSize={3}
          shiftIndex={shiftIndex}
          units={units}
          weekForecast={weekForecast}
        />
      </ViewWeekRowContainer>
    </>
  )
})

export const View: React.FC<{
  state: State
  dispatch: Dispatch<Action>
}> = ({ state, dispatch }) =>
  state.weekForecast.cata({
    Loading: () => <SkeletonForecast />,

    Failure: () => <div>error</div>,

    Succeed: weekForecast => (
      <ViewSucceed
        units={state.units}
        weekForecast={weekForecast}
        dispatch={dispatch}
      />
    )
  })

// S K E L E T O N

const SkeletNavButton: React.FC = () => (
  <Skeleton variant="circle" width="48px" height="48px" />
)

const SkeletonForecast: React.FC = React.memo(() => (
  <>
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
      <SkeletonWeekRow pageSize={3} />
    </ViewWeekRowContainer>
  </>
))
