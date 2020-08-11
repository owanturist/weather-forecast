import React from 'react'
import { createStore, Action } from 'redux'
import { Dispatch, Effects, setupEffects } from 'core'

export type Props<S, A extends Action> = {
  init: [S, Effects<A>]
  update(action: A, model: S): [S, Effects<A>]
  view: React.ComponentType<{
    state: S
    dispatch: Dispatch<A>
  }>
}

export const Provider = React.memo(
  <S, A extends Action>({ view: View, init, update }: Props<S, A>) => {
    const [state, setState] = React.useState<null | {
      state: S
      dispatch: Dispatch<A>
    }>(null)

    React.useEffect(() => {
      const store = setupEffects<S, A, unknown, unknown>(createStore)(
        update,
        init
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
    }, [init, update])

    return state && <View state={state.state} dispatch={state.dispatch} />
  }
)