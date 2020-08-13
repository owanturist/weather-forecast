import React from 'react'

import { Effects, Dispatch, mapEffects } from 'core'
import * as Forecast from '../Forecast'

// S T A T E

export type State = {
  city: string
  forecast: Forecast.State
}

export const init = (initialCity: string): [State, Effects<Action>] => {
  const [initialForecast, effectsOfForecast] = Forecast.init(initialCity)

  return [
    {
      city: initialCity,
      forecast: initialForecast
    },
    mapEffects(ForecastAction, effectsOfForecast)
  ]
}

// U P D A T E

export type Action = { type: 'ForecastAction'; child: Forecast.Action }

const ForecastAction = (child: Forecast.Action): Action => ({
  type: 'ForecastAction',
  child
})

export const update = (
  action: Action,
  state: State
): [State, Effects<Action>] => {
  const [nextForecast, effectsOfForecast] = Forecast.update(
    action.child,
    state.city,
    state.forecast
  )

  return [
    {
      ...state,
      forecast: nextForecast
    },
    mapEffects(ForecastAction, effectsOfForecast)
  ]
}

// V I E W

export const View: React.FC<{ state: State; dispatch: Dispatch<Action> }> = ({
  state,
  dispatch
}) => (
  <Forecast.View
    state={state.forecast}
    dispatch={action => dispatch(ForecastAction(action))}
  />
)
