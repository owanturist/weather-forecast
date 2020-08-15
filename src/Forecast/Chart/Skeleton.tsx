import React from 'react'
import Box, { BoxProps } from '@material-ui/core/Box'
import Skeleton from '@material-ui/lab/Skeleton'
import colorsGrey from '@material-ui/core/colors/grey'

// S K E L E T O N

const ViewItemContainer: React.FC<BoxProps> = props => (
  <Box display="flex" justifyContent="space-around" {...props} />
)

const SkeletonChart: React.FC<{ count?: number }> = React.memo(
  ({ count = 8 }) => {
    const range = new Array(count).fill(null)

    return (
      <Box paddingX="4px" paddingY={2}>
        <ViewItemContainer>
          {range.map((_, index) => (
            <Skeleton key={index} variant="rect" width="60px" height="190px" />
          ))}
        </ViewItemContainer>

        <ViewItemContainer borderTop={`1px solid ${colorsGrey[300]}`}>
          {range.map((_, index) => (
            <Box key={index} paddingTop="7px" fontSize={14}>
              <Skeleton width="60px" />
            </Box>
          ))}
        </ViewItemContainer>
      </Box>
    )
  }
)

export default SkeletonChart
