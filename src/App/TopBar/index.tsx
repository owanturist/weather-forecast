import React, { ReactNode } from 'react'
import Box from '@material-ui/core/Box'
import Toolbar from '@material-ui/core/Toolbar'
import InputBase from '@material-ui/core/InputBase'
import Typography from '@material-ui/core/Typography'
import SearchIcon from '@material-ui/icons/Search'
import Skeleton from '@material-ui/lab/Skeleton'

import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'

const useSearchInputStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: 'relative',
      marginLeft: theme.spacing(1),
      borderRadius: theme.shape.borderRadius,
      overflow: 'hidden'
    },

    icon: {
      padding: theme.spacing(0, 2),
      position: 'absolute',
      pointerEvents: 'none'
    },

    root: {
      color: 'inherit'
    },

    input: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      transition: theme.transitions.create('width'),
      width: '12ch',
      '&:focus': {
        width: '20ch',
        backgroundColor: fade(theme.palette.common.white, 0.25)
      },
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25)
      }
    }
  })
)

const ViewSearchInput: React.FC = () => {
  const classes = useSearchInputStyles()

  return (
    <div className={classes.container}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
        className={classes.icon}
      >
        <SearchIcon />
      </Box>

      <InputBase
        placeholder="City name…"
        classes={{
          root: classes.root,
          input: classes.input
        }}
        inputProps={{ 'aria-label': 'City Name' }}
      />
    </div>
  )
}

const ViewRoot: React.FC<{ title: ReactNode }> = ({ title, children }) => (
  <Toolbar>
    <Box flexGrow={1}>
      <Typography variant="h6" noWrap>
        {title}
      </Typography>
    </Box>

    {children}
  </Toolbar>
)

const TopBar: React.FC = React.memo(() => (
  <ViewRoot title="Weather Forecast">
    <ViewSearchInput />
  </ViewRoot>
))

export default TopBar

export const SkeletonTopBar: React.FC = React.memo(() => (
  <ViewRoot title={<Skeleton width="165px" />}>
    <Skeleton variant="rect" width="164px" height="35px" />
  </ViewRoot>
))
