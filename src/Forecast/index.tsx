import React from 'react'
import RemoteData from 'frctl/RemoteData'
import Zoom from '@material-ui/core/Zoom'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

import { TempUnits, DayForecast } from 'api'
import WeekRow from './WeekRow'
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

const ViewNavigationButton: React.FC<
  IconButtonProps & {
    visible: boolean
  }
> = ({ visible, ...props }) => (
  <Zoom in={visible}>
    <IconButton color="primary" disabled={!visible} {...props} />
  </Zoom>
)

const ViewNavigation: React.FC<{
  prevVisible: boolean
  nextVisible: boolean
  onPrevClick(): void
  onNextClick(): void
}> = React.memo(({ prevVisible, nextVisible, onPrevClick, onNextClick }) => (
  <Box display="flex" justifyContent="space-between">
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
  </Box>
))

const ViewSucceed: React.FC<{
  units: TempUnits
  weekForecast: Array<DayForecast>
}> = React.memo(({ units, weekForecast }) => {
  const [shiftIndex, setShiftIndex] = React.useState(0)

  return (
    <Container disableGutters maxWidth="md">
      <Box padding={1}>
        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            row
            aria-label="Temperature units"
            name="temp-units"
            value={units}
            className={styles.radioGroup}
          >
            <FormControlLabel
              label="Celcius"
              value={TempUnits.Celcius}
              control={<Radio color="primary" />}
            />

            <FormControlLabel
              label="Fahrenheit"
              labelPlacement="start"
              value={TempUnits.Fahrenheit}
              control={<Radio color="primary" />}
            />
          </RadioGroup>
        </FormControl>

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
      </Box>

      <Box padding={1} className={styles.weekRowContainer}>
        <WeekRow
          shiftIndex={shiftIndex}
          units={units}
          weekForecast={weekForecast}
        />
      </Box>
    </Container>
  )
})

export const View: React.FC<{
  state: State
}> = ({ state }) =>
  state.weekForecast.cata({
    Loading: () => <div>Loading...</div>,

    Failure: error => <div>{error}</div>,

    Succeed: weekForecast => (
      <ViewSucceed units={state.units} weekForecast={weekForecast} />
    )
  })
