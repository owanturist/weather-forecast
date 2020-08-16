import React, { ReactElement } from 'react'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Maybe from 'frctl/Maybe'
import Either from 'frctl/Either'

import { Effects, Dispatch, mapEffects } from 'core'
import { Coordinates, getCurrentLocation } from 'geo'
import * as Forecast from 'Forecast'
import TopBar, { SkeletonTopBar } from './TopBar'

// S T A T E

export type State = {
  forecast: Maybe<Forecast.State>
}

export const init = (defaultCity: string): [State, Effects<Action>] => [
  {
    forecast: Maybe.Nothing
  },
  [
    getCurrentLocation(coordinates =>
      RetrieveLocation(defaultCity, coordinates)
    )
  ]
]

// U P D A T E

export type Action =
  | {
      type: 'RetrieveLocation'
      defaultCity: string
      coordinates: Either<string, Coordinates>
    }
  | { type: 'ForecastAction'; child: Forecast.Action }

const RetrieveLocation = (
  defaultCity: string,
  coordinates: Either<string, Coordinates>
): Action => ({
  type: 'RetrieveLocation',
  defaultCity,
  coordinates
})

const ForecastAction = (child: Forecast.Action): Action => ({
  type: 'ForecastAction',
  child
})

export const update = (
  action: Action,
  state: State
): [State, Effects<Action>] => {
  switch (action.type) {
    case 'RetrieveLocation': {
      const [initialForecast, effectsOfForecast] = action.coordinates.cata({
        Left: () => Forecast.initByCity(action.defaultCity),
        Right: Forecast.initByCoordinates
      })

      return [
        {
          forecast: Maybe.Just(initialForecast)
        },
        mapEffects(ForecastAction, effectsOfForecast)
      ]
    }

    case 'ForecastAction': {
      return state.forecast.cata({
        Nothing: () => [state, []],

        Just: forecast => {
          const [nextForecast, effectsOfForecast] = Forecast.update(
            action.child,
            forecast
          )

          return [
            {
              ...state,
              forecast: Maybe.Just(nextForecast)
            },
            mapEffects(ForecastAction, effectsOfForecast)
          ]
        }
      })
    }
  }
}

// V I E W

const ViewRoot: React.FC<{ topbar: ReactElement }> = ({ topbar, children }) => (
  <Box>
    <AppBar>
      <Container disableGutters maxWidth="md">
        {topbar}
      </Container>
    </AppBar>

    <Toolbar />

    <Box
      display="flex"
      minHeight="100%"
      justifyContent="center"
      alignItems="center"
      padding={2}
    >
      <Container disableGutters maxWidth="md">
        <Box bgcolor="background.paper">{children}</Box>
      </Container>
    </Box>
  </Box>
)

export const View: React.FC<{ state: State; dispatch: Dispatch<Action> }> = ({
  state,
  dispatch
}) => {
  const forecastDispatch = React.useCallback(
    action => dispatch(ForecastAction(action)),
    [dispatch]
  )

  return state.forecast.cata({
    Nothing: () => (
      <ViewRoot topbar={<SkeletonTopBar />}>
        <Forecast.Skeleton pageSize={3} />
      </ViewRoot>
    ),

    Just: forecast => (
      <ViewRoot topbar={<TopBar />}>
        <Forecast.View
          pageSize={3}
          state={forecast}
          dispatch={forecastDispatch}
        />
      </ViewRoot>
    )
  })
}
