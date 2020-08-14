import React from 'react'
import { action } from '@storybook/addon-actions'
import RemoteData from 'frctl/RemoteData'

import { Error as HttpError } from 'httpBuilder'
import * as App from './index'
import * as Forecast from '../Forecast'

export default {
  title: 'App',
  component: App.View
}

const initial: App.State = App.init('Munich')[0]
const initialForecast: Forecast.State = Forecast.init(initial.city)[0]

export const Initialising: React.FC = () => (
  <App.View state={initial} dispatch={action('dispatch')} />
)

export const Failure: React.FC = () => (
  <App.View
    state={{
      ...initial,
      forecast: {
        ...initialForecast,
        weekForecast: RemoteData.Failure(HttpError.NetworkError)
      }
    }}
    dispatch={action('dispatch')}
  />
)
