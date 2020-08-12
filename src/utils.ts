export const clamp = (min: number, max: number, x: number): number => {
  return Math.max(min, Math.min(max, x))
}
