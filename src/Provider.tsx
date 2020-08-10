import React from 'react'
import { createStore, Action, PreloadedState } from 'redux'

export type Dispatch<A extends Action> = (action: A) => void

export type Props<S, A extends Action> = {
  initial: S
  update(action: A, model: S): S
  view: React.ComponentType<{
    state: S
    dispatch: Dispatch<A>
  }>
}

export const Provider = React.memo(
  <S, A extends Action>({ view: View, initial, update }: Props<S, A>) => {
    const [state, setState] = React.useState<null | {
      state: S
      dispatch: Dispatch<A>
    }>(null)

    React.useEffect(() => {
      const store = createStore<S, A, unknown, unknown>(
        (dangerousState, action) => {
          const actualState = dangerousState || initial

          return update(action, actualState) || actualState
        },
        initial as PreloadedState<S>
      )

      const unsubscribe = store.subscribe(() => {
        setState({
          state: store.getState(),
          dispatch: store.dispatch
        })
      })

      setState({
        state: store.getState(),
        dispatch: store.dispatch
      })

      return () => unsubscribe()
    }, [initial, update])

    return state && <View state={state.state} dispatch={state.dispatch} />
  }
)
