import React from 'react'

import { Dispatch, Effects } from 'core'
import logo from './logo.svg'

export const foo = 0

// S T A T E

export type State = {
  count: number
}

export const initial: State = {
  count: 0
}

export const init: [State, Effects<Action>] = [initial, []]

// U P D A T E

export type Action = { type: 'Increment' } | { type: 'Decrement' }

export const udpate = (
  action: Action,
  state: State
): [State, Effects<Action>] => {
  switch (action.type) {
    case 'Increment': {
      return [
        {
          ...state,
          count: state.count + 1
        },
        []
      ]
    }

    case 'Decrement': {
      return [
        {
          ...state,
          count: state.count - 1
        },
        [
          dispatch => {
            setTimeout(() => {
              dispatch({ type: 'Increment' })
            }, 1000)
          }
        ]
      ]
    }
  }
}

// V I E W

export const View: React.FC<{ state: State; dispatch: Dispatch<Action> }> = ({
  state,
  dispatch
}) => {
  return (
    <div>
      <header className="App-header">
        <img src={logo} alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div>
        <button type="button" onClick={() => dispatch({ type: 'Decrement' })}>
          -
        </button>
        {state.count}
        <button type="button" onClick={() => dispatch({ type: 'Increment' })}>
          +
        </button>
      </div>
    </div>
  )
}
