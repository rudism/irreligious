/// <reference path="./Job.ts" />

class Pastor extends Job {
  constructor() {
    super(
      'Pastors',
      'pastor',
      'pastors',
      'Collect tithings for you and recruit new members from other faiths automatically.'
    );
  }

  public max: (state: GameState) => number = (state) => {
    let max =
      Math.floor(state.resource.churches?.value ?? 0) *
      (state.config.cfgCapacity.churches?.pastors ?? 0);
    max +=
      Math.floor(state.resource.megaChurches?.value ?? 0) *
      (state.config.cfgCapacity.megaChurches?.pastors ?? 0);
    return Math.floor(max);
  };

  public isUnlocked(state: GameState): boolean {
    if (this._isUnlocked) return true;
    this._isUnlocked = state.resource.churches?.isUnlocked(state) === true;
    return this._isUnlocked;
  }
}
