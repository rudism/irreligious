/// <reference path="./Job.ts" />

class Pastor extends Job {
  public readonly resourceKey = ResourceKey.pastors;

  constructor() {
    super(
      'Pastors',
      'pastor',
      'pastors',
      'Collect tithings for you and recruit new members from other faiths automatically.'
    );
  }

  public max = (state: GameState): number => {
    let max =
      (state.resource.churches?.value ?? 0) *
      (state.config.cfgCapacity.churches?.pastors ?? 0);
    max +=
      (state.resource.megaChurches?.value ?? 0) *
      (state.config.cfgCapacity.megaChurches?.pastors ?? 0);
    return max;
  };

  public isUnlocked = (state: GameState): boolean => {
    if (this._isUnlocked) return true;
    this._isUnlocked = state.resource.churches?.isUnlocked(state) === true;
    return this._isUnlocked;
  };
}
