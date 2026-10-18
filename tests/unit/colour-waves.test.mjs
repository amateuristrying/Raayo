import { test } from 'node:test'
import assert from 'node:assert/strict'
import { colourWavesAt, COLOUR_WAVE_INTERVAL, COLOUR_WAVE_DURATION } from '../../raayo-landing/ColourWaves.js'

const wavesAt = (seconds) => colourWavesAt(seconds, -0.3, 0.9)

test('opening wave is visible immediately', () => {
  const [opening, previous] = wavesAt(0)
  assert.ok(Math.abs(opening.center - 0.3) < 1e-9)
  assert.equal(opening.strength, 1)
  assert.equal(previous.strength, 0)
})

test('four-second sweeps launch every three seconds and overlap for one second', () => {
  assert.equal(COLOUR_WAVE_INTERVAL, 3)
  assert.equal(COLOUR_WAVE_DURATION, 4)
  assert.equal(wavesAt(2.99)[1].strength, 0)
  assert.ok(wavesAt(3.5).every((wave) => wave.strength > 0))
  assert.equal(wavesAt(4)[1].strength, 0)
  assert.ok(wavesAt(6.5).every((wave) => wave.strength > 0))
  assert.equal(wavesAt(7)[1].strength, 0)
})

test('sweeps move slowly in alternating directions without a boundary flash', () => {
  assert.ok(wavesAt(1)[0].center < wavesAt(0)[0].center)
  assert.ok(wavesAt(4)[0].center > wavesAt(3)[0].center)
  assert.ok(Math.abs(wavesAt(1)[0].center - wavesAt(0)[0].center + 0.15) < 1e-9)
  assert.equal(wavesAt(3)[0].strength, 0)
  assert.ok(wavesAt(3)[1].strength > 0)
  assert.ok(wavesAt(3.99)[1].strength < 0.001)
})
