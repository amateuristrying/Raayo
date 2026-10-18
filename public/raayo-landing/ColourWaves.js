export const COLOUR_WAVE_INTERVAL = 3
export const COLOUR_WAVE_DURATION = 4

const smoothstep = (value) => {
  const t = Math.min(1, Math.max(0, value))
  return t * t * (3 - 2 * t)
}

// Two overlapping sweeps keep duration independent from the launch interval.
export function colourWavesAt(seconds, min, max) {
  const current = Math.floor(seconds / COLOUR_WAVE_INTERVAL)
  const midpoint = (min + max) / 2
  return [current, current - 1].map((index) => {
    const age = seconds - index * COLOUR_WAVE_INTERVAL
    if (index < 0 || age >= COLOUR_WAVE_DURATION) {
      return { center: midpoint, strength: 0 }
    }
    const progress = age / COLOUR_WAVE_DURATION
    const destination = index % 2 === 0 ? min : max
    const fadeIn = index === 0 ? 1 : smoothstep(age / 0.3)
    const fadeOut = smoothstep((COLOUR_WAVE_DURATION - age) / 0.8)
    return {
      center: midpoint + (destination - midpoint) * progress,
      strength: fadeIn * fadeOut,
    }
  })
}
