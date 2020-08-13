export const clamp = (min: number, max: number, x: number): number => {
  return Math.max(min, Math.min(max, x))
}

/**
 * Tricky helper to handle tricky Cata default '_' case.
 * In Cata we assume that default case is always present
 * in case of current is not provided.
 *
 * @param defaultFn usually '_' pattern case
 * @param fn target optional case
 * @param args arguments for optional case
 */
export const callOrElse = <A extends Array<unknown>, R>(
  defaultFn: (() => R) | undefined,
  fn: ((...args: A) => R) | undefined,
  ...args: A
): R => {
  return typeof fn === 'function' ? fn(...args) : (defaultFn as () => R)()
}

const noop = (): void => {
  /* noop */
}

export const once = <A extends Array<unknown>>(
  fn: (...args: A) => void
): ((...args: A) => void) => {
  let cb = fn

  return (...args: A): void => {
    cb(...args)
    cb = noop
  }
}

export const round = (float: number, digits?: number): number => {
  if (typeof digits === 'undefined') {
    return Math.round(float)
  }

  const pow = 10 ** digits

  return Math.round(pow * float) / pow
}
