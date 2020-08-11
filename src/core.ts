import {
  Action,
  PreloadedState,
  StoreEnhancer,
  StoreCreator,
  Store
} from 'redux'

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

export type Dispatch<A extends Action> = (action: A) => void

export const setupEffects = <S, A extends Action, Ext, StateExt>(
  createStore: StoreCreator
) => (
  update: (action: A, state: S) => [S, Effects<A>],
  [initialState, initialEffects]: [S, Effects<A>],
  enhancer?: StoreEnhancer<Ext, StateExt>
): Store<S, A> => {
  const effectReducer = (state: S, action: A): S => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const [nextState, effects] = update(action, state) || [initialState, []]

    if (effects.length > 0) {
      executeEffects(effects)
    }

    return nextState
  }

  const store = createStore(
    effectReducer,
    initialState as PreloadedState<S>,
    enhancer
  )

  const executeEffects = (effects: Effects<A>): void => {
    for (const effect of effects) {
      effect(store.dispatch)
    }
  }

  executeEffects(initialEffects)

  return store
}
