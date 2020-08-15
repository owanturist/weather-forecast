import React from 'react'
import Box from '@material-ui/core/Box'
import Skeleton from '@material-ui/lab/Skeleton'

// S K E L E T O N

const SkeletonChart: React.FC<{ count?: number }> = React.memo(
  ({ count = 8 }) => (
    <Box display="flex" justifyContent="space-around">
      {new Array(count).fill(null).map((_, index) => (
        <Skeleton key={index} variant="rect" width="60px" height="250px" />
      ))}
    </Box>
  )
)

export default SkeletonChart
