import React, { ReactNode, ReactElement } from 'react'
import RemoteData from 'frctl/RemoteData'
import Zoom from '@material-ui/core/Zoom'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Radio from '@material-ui/core/Radio'
import RadioGroup, { RadioGroupProps } from '@material-ui/core/RadioGroup'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import Skeleton from '@material-ui/lab/Skeleton'

import { TempUnits, DayForecast } from 'api'
import WeekRow, { SkeletonWeekRow } from './WeekRow'
import styles from './styles.module.css'

// S T A T E

export type State = {
  units: TempUnits
  weekForecast: RemoteData<string, Array<DayForecast>>
}

export const initial: State = {
  units: TempUnits.Fahrenheit,
  weekForecast: RemoteData.Loading
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

const ViewFoo: React.FC<
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
}> = React.memo(({ units, weekForecast }) => {
  const [shiftIndex, setShiftIndex] = React.useState(0)

  return (
    <Container disableGutters maxWidth="md">
      <ViewControlsContainer>
        <ViewFoo
          aria-label="Temperature units"
          name="temp-units"
          value={units}
          control={<Radio color="primary" />}
          celciusNode="Celcius"
          fahrenheitNode="Fahrenheit"
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
    </Container>
  )
})

export const View: React.FC<{
  state: State
}> = ({ state }) =>
  state.weekForecast.cata({
    Loading: () => <SkeletonForecast />,

    Failure: error => <div>{error}</div>,

    Succeed: weekForecast => (
      <ViewSucceed units={state.units} weekForecast={weekForecast} />
    )
  })

// S K E L E T O N

const SkeletNavButton: React.FC = () => (
  <Skeleton variant="circle" width="48px" height="48px" />
)

const SkeletonForecast: React.FC = React.memo(() => (
  <Container disableGutters maxWidth="md">
    <ViewControlsContainer>
      <ViewFoo
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
  </Container>
))
