export class FixedTimestep {
  constructor({ dt = 1 / 120, maxSteps = 6 } = {}) {
    this.dt = dt;
    this.maxSteps = maxSteps;
    this.accumulator = 0;
    this.lastTime = null;
  }

  update(currentTime) {
    if (this.lastTime === null) {
      this.lastTime = currentTime;
      return 0;
    }

    let frameTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    if (frameTime > 0.25) {
      frameTime = 0.25;
    }

    this.accumulator += frameTime;

    let steps = 0;
    while (this.accumulator >= this.dt && steps < this.maxSteps) {
      this.accumulator -= this.dt;
      steps++;
    }

    return steps;
  }
}
