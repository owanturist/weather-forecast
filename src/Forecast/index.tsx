import React from 'react'
import { css } from 'emotion/macro'
import RemoteData from 'frctl/RemoteData'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import IconButton from '@material-ui/core/IconButton'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

import { TempUnits, DayForecast } from 'api'
import WeekRow from './WeekRow'
import { clamp } from 'utils'

// S T A T E

export type State = {
  shiftIndex: number
  units: TempUnits
  weekForecast: RemoteData<string, Array<DayForecast>>
}

export const initial: State = {
  shiftIndex: 0,
  units: TempUnits.Fahrenheit,
  weekForecast: RemoteData.Loading
}

// V I E W

const cssWeekRowContainer = css`
  overflow-x: hidden;
  overflow-y: visible;
`

const cssRadioGroup = css`
  justify-content: space-between;
`

const ViewSucceed: React.FC<{
  shiftIndex: number
  units: TempUnits
  weekForecast: Array<DayForecast>
}> = ({ shiftIndex, units, weekForecast }) => (
  <Container maxWidth="md">
    <FormControl component="fieldset" fullWidth>
      <RadioGroup
        row
        aria-label="Temperature units"
        name="temp-units"
        value={units}
        className={cssRadioGroup}
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

    <Box display="flex" justifyContent="space-between">
      <IconButton aria-label="Scroll to previous day" color="primary">
        <ArrowBackIcon />
      </IconButton>

      <IconButton aria-label="Scroll to next day" color="primary">
        <ArrowForwardIcon />
      </IconButton>
    </Box>

    <Box padding={1} className={cssWeekRowContainer}>
      <WeekRow
        shiftIndex={shiftIndex}
        units={units}
        weekForecast={weekForecast}
      />
    </Box>
  </Container>
)

export const View: React.FC<{
  state: State
}> = ({ state }) =>
  state.weekForecast.cata({
    Loading: () => <div>Loading...</div>,

    Failure: error => <div>{error}</div>,

    Succeed: weekForecast => (
      <ViewSucceed
        shiftIndex={clamp(0, 2, state.shiftIndex)}
        units={state.units}
        weekForecast={weekForecast}
      />
    )
  })
