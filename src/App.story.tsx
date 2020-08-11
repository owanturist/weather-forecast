import React from 'react'
import { action } from '@storybook/addon-actions'

import * as App from 'App'

export default {
  title: 'App',
  component: App.View
}

export const Initial: React.FC = () => (
  <App.View state={App.initial} dispatch={action('dispatch')} />
)
