import React from 'react'
import { boolean } from '@storybook/addon-knobs'
import AppBar from '@material-ui/core/AppBar'

import TopBar, { SkeletonTopBar } from './index'

export default {
  title: 'App . TopBar',
  component: TopBar
}

const ViewContainer: React.FC = ({ children }) => {
  if (boolean('Wrap to AppBar', true)) {
    return <AppBar>{children}</AppBar>
  }

  return <>{children}</>
}

export const Default: React.FC = () => (
  <ViewContainer>
    <TopBar />
  </ViewContainer>
)

export const Skeleton: React.FC = () => (
  <ViewContainer>
    <SkeletonTopBar />
  </ViewContainer>
)
