import React, { ReactNode, ReactElement } from 'react'
import Zoom from '@material-ui/core/Zoom'
import Box from '@material-ui/core/Box'
import Radio from '@material-ui/core/Radio'
import RadioGroup, { RadioGroupProps } from '@material-ui/core/RadioGroup'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Button from '@material-ui/core/Button'
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
import { Typography } from '@material-ui/core'

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
  <Box padding={1}>{children}</Box>
)

const ViewNavigationContainer: React.FC = ({ children }) => (
  <Box display="flex" justifyContent="space-between" marginY={6}>
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

const ViewSucceed: React.FC<{
  pageSize: number
  units: TempUnits
  unitsChanging: boolean
  weekForecast: Array<DayForecast>
  dispatch: Dispatch<Action>
}> = React.memo(props => {
  const { pageSize, units, unitsChanging, weekForecast, dispatch } = props
  const [shiftIndex, setShiftIndex] = React.useState(0)

  return (
    <div data-cy="forecast__root">
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
          nextVisible={shiftIndex < weekForecast.length - pageSize}
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
          pageSize={pageSize}
          shiftIndex={shiftIndex}
          units={units}
          unitsChanging={unitsChanging}
          weekForecast={weekForecast}
        />
      </ViewWeekRowContainer>
    </div>
  )
})

const ViewRetrySection: React.FC<{
  onRetry(): void
}> = ({ onRetry: onClick }) => (
  <Box display="flex" justifyContent="center">
    <Button
      data-cy="forecast__retry"
      aria-label="Retry forecast request"
      variant="contained"
      color="primary"
      onClick={onClick}
    >
      Try again
    </Button>
  </Box>
)

const ViewFailureContainer: React.FC<{
  title: ReactNode
}> = ({ title, children }) => (
  <Box data-cy="forecast__report" padding={6}>
    <Typography variant="h4" align="center">
      {title}
    </Typography>

    <Box marginTop={2}>{children}</Box>
  </Box>
)

const ViewFailure: React.FC<{
  error: HttpError
  dispatch: Dispatch<Action>
}> = React.memo(({ error, dispatch }) =>
  error.cata({
    Timeout: () => (
      <ViewFailureContainer title="You are facing a Timeout issue">
        <Typography paragraph align="center">
          It takes too long to get a response so please check your Internect
          connection and try again.
        </Typography>

        <ViewRetrySection onRetry={() => dispatch(LoadForecast)} />
      </ViewFailureContainer>
    ),

    NetworkError: () => (
      <ViewFailureContainer title="You are facing a Network Error">
        <Typography paragraph align="center">
          Pleace check your Internet connection and try again.
        </Typography>

        <ViewRetrySection onRetry={() => dispatch(LoadForecast)} />
      </ViewFailureContainer>
    ),

    BadUrl: url => (
      <ViewFailureContainer title="Oops... we broke something...">
        <Typography paragraph align="center">
          It looks like the app hits a wrong endpoint <code>{url}</code>.
        </Typography>
        <Typography paragraph align="center">
          We are fixing the issue.
        </Typography>
      </ViewFailureContainer>
    ),

    BadStatus: ({ statusCode }) => {
      const [side, role] =
        statusCode < 500 ? ['Client', 'frontend'] : ['Server', 'backend']

      return (
        <ViewFailureContainer
          title={`You are facing an unexpected ${side} side Error ${statusCode}!`}
        >
          <Typography paragraph align="center">
            Our {role} developers are fixing the issue.
          </Typography>
        </ViewFailureContainer>
      )
    },

    BadBody: decodeError => (
      <ViewFailureContainer title="You are facing an unexpected Response Body Error!">
        <Typography paragraph align="center">
          Something went wrong and our apps seems don't communicate well...
        </Typography>

        <Box
          display="flex"
          justifyContent="center"
          overflow="auto"
          maxWidth="100%"
          padding={2}
          bgcolor=""
        >
          <pre className={styles.jsonCode}>
            {decodeError
              .stringify(4)
              .replace(/\\"/g, '"')
              .replace(/\s{3,}"/, '\n\n"')
              .replace(/\\n/g, '\n')}
          </pre>
        </Box>
      </ViewFailureContainer>
    )
  })
)

export const View: React.FC<{
  pageSize: number
  state: State
  dispatch: Dispatch<Action>
}> = ({ pageSize, state, dispatch }) =>
  state.weekForecast.cata({
    Loading: () => <SkeletonForecast pageSize={pageSize} />,

    Failure: error => <ViewFailure error={error} dispatch={dispatch} />,

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
    </div>
  )
)
