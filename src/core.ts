import {
  Action as ReduxAction,
  PreloadedState,
  StoreEnhancer,
  StoreCreator,
  Store
} from 'redux'

import { once } from 'utils'

export type Action = ReduxAction

/**
 * Effect allows to call Action in async moment.
 * Seems like redux-thunk but it comes from reducer (update)
 * but not from action.
 * This small difference makes possible to get rid of properties
 * and handlers drilling and keep all state global at the same time
 * when the app becomes bigger and bigger.
 *
 * This is an extremelly simplified [redux-loop](https://github.com/redux-loop/redux-loop)
 */
export type Effect<A extends Action> = (dispatch: Dispatch<A>) => void

export type Effects<A extends Action> = Array<Effect<A>>

export const mapEffect = <A extends Action, R extends Action>(
  tagger: (action: A) => R,
  effect: Effect<A>
): Effect<R> => {
  return dispatch => effect(action => dispatch(tagger(action)))
}

export const mapEffects = <A extends Action, R extends Action>(
  tagger: (action: A) => R,
  effects: Effects<A>
): Effects<R> => {
  return effects.map(effect => mapEffect(tagger, effect))
}

export type Dispatch<A extends Action> = (action: A) => void

export const createStoreWithEffects = <S, A extends Action, Ext, StateExt>(
  createStore: StoreCreator
) => (
  update: (action: A, state: S) => [S, Effects<A>],
  [initialState, initialEffects]: [S, Effects<A>],
  enhancer?: StoreEnhancer<Ext, StateExt>
): Store<S, A> => {
  let initialised = false

  const effectReducer = (state: S, action: A): S => {
    if (!initialised) {
      initialised = true

      return state
    }

    const [nextState, effects] = update(action, state)

    executeEffects(effects)

    return nextState
  }

  const store = createStore(
    effectReducer,
    initialState as PreloadedState<S>,
    enhancer
  )

  const executeEffects = (effects: Effects<A>): void => {
    for (const effect of effects) {
      effect(once(store.dispatch))
    }
  }

  executeEffects(initialEffects)

  return store
}
